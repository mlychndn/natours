

const AppError = require('./../util/appError');




const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
    const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/);
    // console.log(value);
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError(message, 400);
}
const handValidationError = err => {
    const errors =Object.values(err.errors).map(el => el.message);
     
    const message = `Invalid input data. ${errors.join(', ')}`;
    return new AppError(message,400);
}
    
const handleJWTError = () => new AppError('Invalid token, please login again!', 401);

const handleJWTExpiredError = () => new AppError('Your token has expired! Please login again.', 401);

const sendErrDev = (err, req, res)=>{
    // A.API
    // console.log(req);
    if(req.originalUrl.startsWith('/api')){
     
       return  res.status(err.statusCode).json({
            status: err.status,
            error:err,
            message: err.message,
            stack: err.stack
        });
   } 

    // B. RENDERED WEBSITE
      return  res.status(err.statusCode).render('error',{
           title: 'Something went wrong!',
           msg: err.message
       });

    
};




const sendErrProd = (err, req, res)=>{

 if (req.originalUrl.startsWith('/api')){

//Operational Error: Send message to clent.
    if(err.isOperational){
       
        return  res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
// Programming error:Don't leak error details.
    }
        //1. Log Error
         console.error('ERROR 🧒', err);
         
         //2. Send generic message
         return  res.status(err.statusCode).json({
             status: 'error',
             message: 'Something went very weong!'
         });
    }


 //Rendered Website
    if(err.isOperational){
       
      return res.status(err.statusCode).render('error',{
          title: 'Something went wrong!',
          msg: err.message
      })
// Programming error:Don't leak error details.
    }
        //1. Log Error
        //  console.error('ERROR 🧒', err);
         
         //2. Send generic message
       return  res.status(500).render('error', {
           title: 'Something went very wrong!',
           msg: 'Please try again later.'
       });
 
    }






module.exports =(err,req,res,next)=>{
    //console.log(err.stack);
    // console.log(process.env);
   

    err.statusCode = err.statusCode || 500 ;
    err.status = err.status || 'error';

    // console.log(err.statusCode);
    // console.log(err.status);

      
    if(process.env.NODE_ENV === 'developement '){
           
        sendErrDev(err,req, res);

    } else if(process.env.NODE_ENV === 'production'){
        // console.log(process.env.NODE_ENV);
        let error = { ...err };
        error.message = err.message;

        if(error.name === 'CastError') error = handleCastErrorDB(error);
        if(error.code === 11000 ) error = handleDuplicateFieldsDB(error);
        if(error.name === 'ValidationError')error = handValidationError(error);
        if(error.name === "JsonWebTokenError")error = handleJWTError();
        if(error.name === 'TokenExpiredError')error = handleJWTExpiredError();

        sendErrProd(error, req, res);
        
         }

    
}; 