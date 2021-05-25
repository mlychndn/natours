const User = require('../Models/userModel');
const multer = require('multer');
const sharp = require('sharp');
const AppError = require('../util/appError');
const catchAsync = require('../util/catchAsync');
const factory = require('./handlerfactory');

// const multerStorage = multer.diskStorage({
//     destination: (req, file, cb)=>{
//         cb(null, './public/img/users');
//     },
//     filename: (req, file, cb) => {
//                 //user-userid-currenttimestamp.jpeg
//                 const ext = file.mimetype.split('/')[1];
//                 cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//             }
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if(file.mimetype.startsWith('image')){
        cb(null, true);
    }else{
        cb(new AppError('Not an Image! Please upload only images!.',400),false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single('photo');

// to resize req image to upload, we use one middle ware before update me.
// we will use sharp npm package to resize image.
exports.resizeUserPhoto = catchAsync(async(req, res, next) => {
     if(!req.file) return next();

     req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`

    await  sharp(req.file.buffer)
     .resize(500,500)
     .toFormat('jpeg')
     .jpeg({quality:90})
     .toFile(`public/img/users/${req.file.filename}`);

     next();
});


const filterObj = (obj, ...allowedFields)=>{
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el))newObj[el] = obj[el]
    })
    return newObj;
}


exports.getAllUsers = factory.getAll(User);

exports.getMe = (req, res, next)=>{
    req.params.id = req.user.id;
    next();
}



exports.updateMe = catchAsync(async(req,res,next) =>{
   // 1).  Create error if user POSTs password data
   
   console.log(req.file);


if(req.body.password || req.body.passwordConfirm){
    return next(new AppError('This route is not for updating password!'),400);
}

 // 2). update user document
 const filteredBody = filterObj(req.body, 'name', 'email');
 if(req.file) filteredBody.photo = req.file.filename;
 const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody       , {
     new: true, 
     runValidators: true
    });
 



 res.status(200).json({
     status: 'success',
      data: {
          user: updatedUser,
      }
 })
});

exports.deleteMe = catchAsync(async(req, res, next) => {
    User.findByIdAndUpdate(req.user.id, {active: false})

    res.status(204).json({
        status: 'success',
        data:null
    })

});

exports.getUser = factory.getOne(User);

exports.createUsers = (req,res)=>{
    res.status(200).json({
        status: 'error',
        message: 'This route is not defined🧒, Please use signup instead of this'
    })
};

// Do NOT update passwords with this!
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
