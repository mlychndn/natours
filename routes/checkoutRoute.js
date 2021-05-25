const express = require('express');
const authController = require('./../controllers/authController');
const checkoutController = require('./../controllers/checkoutController');


const router = express.Router();


router.get('/:tourId', authController.protect, checkoutController.checkout);

module.exports = router;