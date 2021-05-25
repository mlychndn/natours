
const Tour = require('../Models/tourModel.js');
const multer = require('multer');
const sharp = require('sharp');
const ApiFeatures = require('../util/class.js');
const catchAsync = require('../util/catchAsync');
const AppError = require('./../util/appError');
const factory = require('./handlerfactory');

// define destination and file name.
// const multerStorage = multer.diskStorage({
//     destination: (req, file, cb)=> {
//       cb(null, `./public/img/tours`)
//     },
//     filename: (req, file, cb) => {
//         const ext = file.mimetype.split('/')[1];
//         cb(null, `user-${req.user.id}-${Date.now()}.${ext}`)
//     }
//   })

// Here don't need to store file in diskstorage cuz we have to further process them.
// so I will store in buffer.
const multerStorage = multer.memoryStorage(); 
  
  const multerFilter = (req, file, cb)=> {
    if(file.mimetype.startsWith('image')){
        cb(null,true)
    }else{
        cb(new AppError('You are not uploading image file.',400),false)
    }
  }

  const upload = multer({
      storage:multerStorage,
      fileFilter: multerFilter
  });

  exports.uploadImageFile = upload.fields([
      {name: 'imageCover', maxCount:1},
      {name: 'images', maxCount:3}
  ]);

  exports.resizeTourImage = async (req, res, next) => {
      if(!req.files.imageCover || !req.files.images) return next();
      console.log(req.files);

      // 1.) process with imageCover.
      const imageCoverFilename = `user-${req.params.id}-${Date.now()}-cover.jpeg`;
        await  sharp(req.files.imageCover[0].buffer)
          .resize(2000,1333)
          .toFormat('jpeg')
          .jpeg({quality: 90})
          .toFile(`public/img/tours/${imageCoverFilename}`);

          req.body.imageCover = imageCoverFilename;
           
      // 2.) process with images.
          req.body.images =[]
         await Promise.all(
              req.files.images.map(async(file,i)=>{
              const filename = `tour-${req.params.id}-${Date.now()}-${i+1}.jpeg`;

              await sharp(req.files.images[i].buffer)
               .resize(2000, 1333)
               .toFormat('jpeg')
               .jpeg({quality: 90})
               .toFile(`public/img/tours/${filename}`);

               req.body.images.push(filename);
          })
         );
      // we have imageCover and images
      next();
  }


exports.aliasTopTours = (req,res,next)=>{
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage, Price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
    
}


 
exports.getTours =   factory.getAll(Tour);
exports.getOneTour = factory.getOne(Tour, {path:'reviews'});
exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

exports.getTourStats = async (req,res,next) => {
    
        const stats = await Tour.aggregate([
            {
                $match: {ratingsAverage: {$gte: 4}}
            },
            {
                $group: {
                    _id: {$toUpper: '$difficulty'},
                    numTours: {$sum: 1},
                    numRatings: {$sum: '$ratingsQuantity'},
                    avgRating: { $avg: '$ratingsAverage'},
                    avgPrice: {$avg: '$price' },
                    minPrice: {$min: '$price'},
                    maxPrice: {$max: '$price'},
            }
            },
            {
                $match: {_id: {$ne: 'EASY'} }
            }
        ])
        res.status(200).json({
            status: 'success',
            data: {
                stats,
            }
        })
        }

exports.getMonthlyPlan = catchAsync (async (req,res,next)=>{
    
        
        const  year = req.params.year*1;

        const plan = await Tour.aggregate([
              {
                  $unwind: '$startDates'
              },
              {
                  $match: {
                      startDates: {
                        $gte:  new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                      }
                  }
              },
              {
                  $group: {
                      _id: { $month: '$startDates' },
                      numTourStarts: {$sum : 1},
                      tours: {$push: '$name'}
                  }
              },
              {
                  $addFields: { month: '$_id'}
              },
              {
                  $project:{
                      _id: 0
                  }
              },
              {
                  $sort: { numTourStarts: -1}
              },
              {
                  $limit: 12
              }


        ])
        res.status(200).json({
            status: 'success',
            result: plan.length,
            data: {
                plan,
            }
        })
    


});

exports.getToursWithin = catchAsync(async(req, res, next)=>{
    const { distance, latlng, unit } = req.params;
   const [lat, lng] = latlng.split(',');

   const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
   if(!lat || !lng){
       next(new AppError('Please provide latitude and longitude in the format lat, lng'), 400);
   }

//    console.log(distance, lat, lng, unit);
   const tours = await Tour.find({ startLocation: { $geoWithin: {$centerSphere: [[lng, lat], radius]}}});

   res.status(200).json({
       status: 'success',
       results: tours.length,
       data:{
           data: tours
       }
   })
});

exports.getDistances = catchAsync(async (req,res,next)=>{
     // /distances/:latlng/unit/:unit
     const {latlng, unit} = req.params;
     const[lat, lng] = latlng.split(',');

     const multiplier = unit === 'mi' ? 0.000621371:0.001;

     if(!lat || !lng){
         next(new AppError('Please provide latitude and longitude in the format lat, lng.'), 400);
     }

 const distances = await  Tour.aggregate([
     {
         $geoNear:{
             near: {
                 type: 'Point',
                 coordinates: [lng*1, lat*1]
             },
             distanceField: 'distance',
             distanceMultiplier: multiplier
         }
     },
     {
         $project:{
             distance: 1,
             name:1
         }
     }

 ]);
    res.status(200).json({
        status: 'success',
        data: {
            data: distances
        }
    })

})


