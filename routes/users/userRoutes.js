const express = require('express');
const userController = require('../../controllers/userController');
const {
  requireSignin,
  authMiddleware,
} = require('../../controllers/authcontroller');
const router = express.Router();

router
  .route('/user/profile')
  .get(requireSignin, authMiddleware, userController.read);

router.route('/user/:username').get(userController.publicProfile);

router
  .route('/user/update_profile')
  .put(requireSignin, authMiddleware, userController.update);

router
  .route('/user/photo/:username')
  .put(requireSignin, authMiddleware, userController.photo);

module.exports = router;
