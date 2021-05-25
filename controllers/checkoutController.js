const Booking = require('../Models/bookingModel');
const Tour = require('./../Models/tourModel');
const catchAsync = require('./../util/catchAsync');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.checkout =catchAsync(async(req, res, next) => {
    // 1. get tour for which payment will be done
          console.log('Malay')
          console.log(req);

          const tour = await Tour.findById(req.params.tourId);
          
    //2. create checkout session:
         const session = await stripe.checkout.sessions.create({
             payment_method_types: ['card'],
             success_url: `${req.protocol}://${req.get('host')}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
             cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
             customer_email: req.user.email,
             client_reference_id: req.params.tourId,
             line_items: [
                 {
                     name: `${tour.name} Tour`,
                     description: tour.summary,
                     images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
                     amount: tour.price*89,
                     currency: 'inr',
                     quantity : 1
                 }
             ]
             })


    // 3. Create response cycle for checkout session
          res.status(200).json({
              status: 'success',
              session,
          })
});

exports.createBookingCheckout = catchAsync(async(req, res, next) => {
    //This is only temporary, because its unsecure.
    const {tour, user, price} = req.query;

    if(!tour && !user && !price ) return next();

    await Booking.create({tour, user, price });

    res.redirect(req.originalUrl.split('?')[0]);
});