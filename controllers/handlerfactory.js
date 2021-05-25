const catchAsync = require("../util/catchAsync");
const AppError = require('./../util/appError');
const ApiFeatures = require('../util/class.js');
// const { Model } = require("mongoose");


exports.deleteOne = Model => catchAsync( async (req, res, next)=>{

    const doc = await Model.findByIdAndRemove(req.params.id,{
        rawResult: true
       }) 
   
       if(!doc){
        return new AppError('Could not able to find document of that id', 404)
    }
   
        res.status(200).json({
            status: 'success',
            data: null,
        })

});


exports.updateOne = Module => catchAsync( async (req,res, next)=>{

    const doc = await Module.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    })

    if(!doc){
        return new AppError('Could not able to find document of that id', 404)
    }

    res.status(200).json({
        status: 'success',
        data: {
            data:doc,
        }

    })

});

exports.createOne = Model => catchAsync(async (req,res, next)=>{
   
    const doc = await Model.create(req.body);

    if(!doc){
        return new AppError('Could not able to find document of that id', 404)
    }
   
    res.status(201).json({
        status: 'success',
        data: {
            data: doc,
        }   
     })


    })

exports.getOne = (Model, popOptions) => catchAsync(async (req,res,next)=>{
       let query = Model.findById(req.params.id);
    //    console.log(popOptions);
      if(popOptions)query = query.populate(popOptions);
       const doc = await query;
    
        if(!doc){
            return new AppError('Could not able to find doc of that id', 404)
        }
    res.status(200).json({
        status: 'success',
        data: {
            data: doc,
        }

    });
        
    
});
   

exports.getAll = Model => catchAsync( async (req,res,next)=>{
    // To allow for nested GET reviews on tour(hack)
    let filter ={};
  if(req.params.tourId) filter = {tour: req.params.tourId}

    const features = new ApiFeatures(Model.find(), req.query)
    .filter()
    .sort()
    .limiting()
    .pagination();

    

       const doc = await features.query; //.explain();
       

       res.status(200).json({
           status: 'success',
           result : doc.length,
           data: {
               data: doc
           }
       })
        
    
});
    
    






