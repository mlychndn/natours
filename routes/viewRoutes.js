const express  = require('express');
const viewsController = require('./../controllers/viewsController');
const authController = require('../controllers/authController');
const checkoutController = require('../controllers/checkoutController');

const router = express.Router();

router.get('/',checkoutController.createBookingCheckout, authController.isLoggedIn, viewsController.getOverview);
router.get('/tours/:slug',authController.isLoggedIn, viewsController.getTour);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/me', authController.protect, viewsController.getAccount);
router.post('/submit-user-data',authController.protect, viewsController.updateUserData);
router.get('/myBookings', authController.protect, viewsController.getBookings);

module.exports = router;