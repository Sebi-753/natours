const express = require('express');
const viewControler = require('../controllers/viewController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.get(
  '/',
  bookingController.createBookingCheckout,
  authController.isLoggedIn,
  viewControler.getOverview,
);
router.get('/tour/:slug', authController.isLoggedIn, viewControler.getTour);
router.get('/login', authController.isLoggedIn, viewControler.getLoginForm);
router.get('/me', authController.protect, viewControler.getAccount);
router.get('/my-tours', authController.protect, viewControler.getMyTours);

router.post(
  '/submit-user-data',
  authController.protect,
  viewControler.updateUserData,
);

module.exports = router;
