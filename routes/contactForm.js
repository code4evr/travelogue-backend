const express = require('express');
const formController = require('../controllers/contactFormController');

// validators
const { runValidation } = require('../validators');
const {
  contactFormValidator,
} = require('../validators/contactFormValidator');

const router = express.Router();

router
  .route('/contact')
  .post(
    contactFormValidator,
    runValidation,
    formController.contactForm,
  );

module.exports = router;
