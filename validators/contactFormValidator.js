const { check } = require('express-validator');

exports.contactFormValidator = [
  check('name')
    .not()
    .isEmpty()
    .withMessage('name is required'),

  check('email')
    .isEmail()
    .withMessage('email is required'),

  check('message')
    .not()
    .isEmpty()
    .isLength({ min: 30 })
    .withMessage('Please elaborate'),
];
