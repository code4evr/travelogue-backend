const express = require('express');
const tagController = require('../controllers/tagController');
const {
  requireSignin,
  adminMiddleware,
} = require('../controllers/authcontroller');

// validators
const { runValidation } = require('../validators');
const { tagValidator } = require('../validators/tagValidator');

const router = express.Router();

router
  .route('/tag')
  .post(
    requireSignin,
    adminMiddleware,
    tagValidator,
    runValidation,
    tagController.create,
  );

router.route('/tags').get(tagController.list);

router
  .route('/tag/:slug')
  .get(tagController.read)
  .delete(requireSignin, adminMiddleware, tagController.remove);

module.exports = router;
