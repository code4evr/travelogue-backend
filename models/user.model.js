const mongoose = require('mongoose');
const validator = require('validator');
const crypto = require('crypto');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
      max: 24,
      unique: true,
      index: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, 'enter the email'],
      unique: true,
      validate: [validator.isEmail, 'please provide a valid email'],
    },
    name: {
      type: String,
      required: true,
    },
    profile: {
      type: String,
      required: true,
    },
    hashed_password: {
      type: String,
      required: [true, 'enter the password'],
      minlength: 8,
    },
    salt: String,
    about: {
      type: String,
    },
    role: {
      type: Number,
      default: 0,
    },
    photo: {
      type: Buffer,
      contentType: String,
    },
    resetPasswordLink: {
      data: String,
      default: '',
    },
  },
  {
    timestamps: true,
  },
);

userSchema
  .virtual('password')
  .set(function(password) {
    //create a temporary variable called _password
    this._password = password;
    //generate salt
    this.salt = this.makeSalt();
    //encrypt password
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function() {
    return this._password;
  });

userSchema.methods = {
  //user authentication on login
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },
  encryptPassword: function(password) {
    if (!password) return '';
    try {
      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex');
    } catch (err) {
      return '';
    }
  },
  makeSalt: function() {
    return Math.round(new Date().valueOf() * Math.random()) + '';
  },
};

const User = mongoose.model('User', userSchema);

module.exports = User;
