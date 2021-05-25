const express = require('express');
const reviewController = require('./../Controllers/reviewController');
const authController = require('./../controllers/authController');




const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
.route('/')
.get(reviewController.getAllReviews)
.post(
     authController.restrictTo('user'),
    reviewController.setUserIds,
    reviewController.createReviews
    );

router
.route('/:id')
.get(reviewController.getReview)
.patch( 
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview
    ).delete(
authController.restrictTo('user', 'admin'),  
reviewController.deleteReview
);




module.exports = router;


