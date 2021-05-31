const Tour = require('./../Models/tourModel');
const Booking = require('./../Models/bookingModel');
const catchAsync = require('./../util/catchAsync');
const AppError = require('./../util/appError');
const User = require('./../Models/userModel');

exports.getOverview = catchAsync (async(req, res, next) => {
 //1.Get Tours data
 const tours = await Tour.find();
console.log(tours);
    

 //2. Build templates

 // 3. Render that templates using tour data form 1)
    res.status(200).render('overview.pug', {
        title: 'All Tours',
        tours,
    });
    
});

exports.getTour = catchAsync(async (req, res, next)=> {
    // console.log(req.params);''
    // console.log(req.params.slug);
    const tour = await Tour.findOne({slug: req.params.slug}).populate({
        path: 'reviews',
        fields: 'review rating user'
    }); 
     
     if(!tour){
         return next(new AppError('There is no tour with that name.', 404));
     }
    
         
     res
    .status(200)
    .setHeader(
      'Content-Security-Policy',
      "default-src 'self' https://*.mapbox.com https://*.stripe.com ; connect-src 'self' https://*.mapbox.com https://*.stripe.com ws://127.0.0.1:*/ ; base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self' https://cdnjs.cloudflare.com https://api.mapbox.com https://js.stripe.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
    )
    .render('tour', {
      title: `${tour.name} tour`,
      tour
    });
});

exports.getLoginForm = (req, res)=>{
    res.status(200).render('login',{
        title: 'Login into your account',
    })
}

exports.getAccount = (req, res)=> {
    
    res.status(200).render('account', {
        title: 'Your account'
    });
}

exports.updateUserData = async(req, res, next) => {
    
   const updatedUser = await User.findByIdAndUpdate(req.user.id,{
     name: req.body.name,
     email: req.body.email,
    },{
        new: true,
        runValidators: true
    }
    );

    res.status(200).render('account',{
        title: 'Your account',
        user: updatedUser
    })
}

exports.getBookings = catchAsync(async (req, res, next) => {
    //1. get all bookings.
    // console.log(req.user.id);
    const booking = await Booking.find({user: req.user.id});
   
    //2. get all the tours booked for particular bookings.
     const tourIds = booking.map( el => el.tour );
    //   console.log(tourIds);
    const tours = await Tour.find({_id: {$in: tourIds}});
    //  console.log(tours);

    res.status(200).render('overview', {
        title: 'My Tours',
        tours,
    })

    

    


    //2. find tours corresponding to the user
});