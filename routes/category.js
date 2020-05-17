const express = require('express');
const categoryController = require('../controllers/categoryController');
const {
  requireSignin,
  adminMiddleware,
} = require('../controllers/authcontroller');

// validators
const { runValidation } = require('../validators');
const {
  categoryValidator,
} = require('../validators/categoryValidator');

const router = express.Router();

router
  .route('/category')
  .post(
    requireSignin,
    adminMiddleware,
    categoryValidator,
    runValidation,
    categoryController.create,
  );

router.get('/categories', categoryController.list);

router
  .route('/category/:slug')
  .get(categoryController.read)
  .delete(requireSignin, adminMiddleware, categoryController.remove);

module.exports = router;
