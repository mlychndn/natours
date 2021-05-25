  const express = require('express');
  
  const tourController = require('../controllers/tourController');
  const authController = require('../controllers/authController');
  const reviewRouter = require('./reviewRoutes');










const router = express.Router();

//  Implementing Simple Nested Routes
//  POST/tour/234fad4/reviews
//  GET/tour/234fad4/reviews
//  GET/tour/234fad4/reviews/94887fda

//  router
//  .route('/:tourId/reviews')
//  .post(
//     authController.protect, 
//     authController.restrictTo('user'),
//     reviewController.createReviews
//    );

router.use('/:tourId/reviews', reviewRouter);















// router.param('id', tourController.checkId);

router
 .route('/top-5-cheap')
 .get(tourController.aliasTopTours, tourController.getTours);

 router
 .route('/tours-within/:distance/center/:latlng/unit/:unit')
 .get(tourController.getToursWithin);
 // /tours-within?distance=233&center=-40,45&unit=mi
 // /tours-within/233/center/-40,45/unit/mi

 router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

router
.route('/')
.get(tourController.getTours)
.post(
  authController.protect,
  authController.restrictTo('admin', 'lead-guide'),
  tourController.createTour
  );

router
.route('/tour-stats')
.get(tourController.getTourStats);

router.route('/monthly-plan/:year')
.get(
  authController.protect,
  authController.restrictTo('admin', 'lead-guide', 'guide'),
  tourController.getMonthlyPlan
  );

router
  .route('/:id')
  .get(tourController.getOneTour)
  .patch(authController.protect, 
    authController.restrictTo('admin', 'lead-guide'),
    tourController.uploadImageFile,
    tourController.resizeTourImage,
    tourController.updateTour)
  .delete(authController.protect, authController.restrictTo('admin', 'lead-guide'),tourController.deleteTour)









module.exports = router;

