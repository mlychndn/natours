const express = require('express');
const fs = require('fs');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const compression =require('compression');

const tourRouter = require('./routes/tourRoute');
const userRouter = require('./routes/userRoute'); 
const AppError = require('./util/appError');
const globalErr = require('./controllers/errorController');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const checkoutRouter = require('./routes/checkoutRoute');


const app = express();
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'))


// 1) Global Middlewares:\
//Serving static files
app.use(express.static(path.join(__dirname,'public')));
app.use(cors({credentials: true, origin: true }));
// Security HTTP headers

//Helmet helps you to secure your express apps by setting various http headers.
app.use(helmet({
    contentSecurityPolicy: false,
}))



// Developement logging

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}
//limit rquests from same api
const limiter = rateLimit({
    max: 100,
    windowMs: 60*60*1000, //Giving one hour time and 100 requests
    message: 'Too many requests from IP, please try again in an hour!'
})

app.use('/api', limiter);


//Middleware


// Body parser, reading data from body to req.body
app.use(express.json({limit: '10kb'}));
app.use(cookieParser());
app.use(express.urlencoded({extended: true, limit: '10kb'}));


//MongoSanitize() will basically look at the req.body, req.queryString, req.params
//and then it basically filter out, all of the dollar signs and dots.

app.use(mongoSanitize());

app.use(xss());  // clean any user input from malicious html code, basically

app.use(hpp({
    whitelist: ['duration', 'ratingsQuantity', 'ratingsAverage', 'maxGroupSize', 'difficulty', 'price']
}))





// app.use((req, res, next)=>{
//     console.log('Hello from the middleware😁');
//     next();
// })


// Test middle ware
app.use((req,res,next)=>{
    req.requestTime = new Date().toISOString();
    // console.log(req.cookies);
    
    next();
});

app.use(compression()); // to compress the file and code



app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/checkout', checkoutRouter);



app.all('*', (req,res,next)=>{
    next(new AppError(`Can't find ${req.originalUrl} on this server!`,404));
    
});

app.use(globalErr);



module.exports = app; 