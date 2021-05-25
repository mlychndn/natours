const Review = require('./../Models/reviewModel');
const catchAsync = require('./../util/catchAsync');
const factory = require('./handlerfactory');



  

exports.setUserIds = (req, res, next) => {
  //Allow nested routes
  if(!req.body.tour) req.body.tour = req.params.tourId;
  if(!req.body.user) req.body.user = req.user.id;
  next();
}

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReviews = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
