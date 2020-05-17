const express = require('express');
const router = express.Router();
const authController = require('../controllers/authcontroller');

const { runValidation } = require('../validators');
const {
  userSignupValidator,
  userSigninValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require('../validators/validateData');

router.post(
  '/signup',
  userSignupValidator,
  runValidation,
  authController.signup,
);
router.post(
  '/signin',
  userSigninValidator,
  runValidation,
  authController.signin,
);
router.get('/signout', authController.signout);

router.put(
  '/forgot_password',
  forgotPasswordValidator,
  runValidation,
  authController.forgotPassword,
);

router.put(
  '/reset_password',
  resetPasswordValidator,
  runValidation,
  authController.resetPassword,
);

router.post('/glogin', authController.googleLogin);

module.exports = router;
