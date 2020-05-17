const User = require('../models/user.model');
const Blog = require('../models/blog.model');
const shortId = require('shortid');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const { errorHandler } = require('../helper/dbErrorHandler');
const nodemailer = require('nodemailer');
const _ = require('lodash');
const { OAuth2Client } = require('google-auth-library');

exports.signup = (req, res) => {
  User.findOne({ email: req.body.email }).exec((err, user) => {
    if (user) {
      return res.status(400).json({
        error: 'Email is taken',
      });
    }

    const { name, email, password } = req.body;
    let username = shortId.generate();
    let profile = `${process.env.CLIENT_URL}/profile/${username}`;

    let newUser = new User({
      name,
      email,
      password,
      profile,
      username,
    });
    newUser.save((err, success) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      // res.status(200).json({
      //   user: success,
      // });
      res.status(200).json({
        message: 'sign up success! You can sign in now',
      });
    });
  });
};

exports.signin = (req, res) => {
  const { email, password } = req.body;
  //check if user exist
  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "user doesn't exist. Please sign up",
      });
    }
    // authenticate
    if (!user.authenticate(password)) {
      return res.status(400).json({
        error: 'email and password do not match',
      });
    }
    // create token
    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' },
    );

    res.cookie('token', token, { expiresIn: '1d' });
    const { _id, username, name, email, role } = user;
    return res.json({
      token,
      user: { _id, username, name, email, role },
    });
  });
};

exports.signout = (req, res) => {
  res.clearCookie('token');
  res.json({
    message: 'signout successful',
  });
};

exports.requireSignin = expressJwt({
  secret: 'jhjdhfhhgfhgsk8748jhjkhdj7378738jfkkk',
});

exports.authMiddleware = (req, res, next) => {
  const authuserId = req.user._id;
  User.findById({ _id: authuserId }).exec((err, user) => {
    if (err || !user) {
      res.status(400).json({
        error: 'user not found',
      });
    }
    req.profile = user;
    next();
  });
};

exports.adminMiddleware = (req, res, next) => {
  const adminUserId = req.user._id;
  User.findById({ _id: adminUserId }).exec((err, user) => {
    if (err || !user) {
      res.status(400).json({
        error: 'user not found',
      });
    }

    if (user.role !== 1) {
      res.status(400).json({
        error: 'Admin resource. Access denied',
      });
    }

    req.profile = user;
    next();
  });
};

exports.canUpdateDeleteBlog = (req, res, next) => {
  let slug = req.params.slug.toLowerCase();

  Blog.findOne({ slug }).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    let authorizedUser =
      data.postedBy._id.toString() === req.profile._id.toString();
    if (!authorizedUser) {
      return res.status(400).json({
        error: 'You are not authorized',
      });
    }
    next();
  });
};

exports.forgotPassword = (req, res) => {
  const { email } = req.body;

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({
        error: 'User with that email does not exist',
      });
    }
    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_RESET_PASSWORD,
      { expiresIn: '10m' },
    );

    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        type: 'OAuth2',
        user: 'vidit.the.known@gmail.com',
        clientId:
          '1096273975776-cets53ef2i7m13ftcrdl93ecasj9e1is.apps.googleusercontent.com',
        clientSecret: 'FQhcSWek3oo-4hoBJzCdyTZF',
        refreshToken:
          '1//04XHSW3CUAszVCgYIARAAGAQSNwF-L9IruSxn8S5WISbNKFg7vIZ9p4sueblacD5AaTugrqgQMUiyR-_iECJT-MJJMky13PHaPdU',
        accessToken:
          'ya29.Il-_BySUpOwDuphEW8VqEMYtpxcEMgjSc0zvhKO5gjirwFMcJ_pu2Qmv6Yi6KO8uDeF4NDn6HGgLt2_RJrRZEUDwF1HPATRiyxVdooTeaiODaBrRUAyCXhxcUblFbwV2Sw',
        expires: 1484314697598,
      },
    });

    const mailOptions = {
      from: 'vidit.the.known@gmail.com',
      to: email,
      subject: 'RESET PASSWORD LINK',
      html: `
      <div style="background:#eee; padding:1rem; border-radius:5px;"
      <h1>Reset Password</h1>
      <hr>
      <p>Click the link given below in order to reset your password</p>
      <p>${process.env.CLIENT_URL}/settings/password/${token}</p>
      <p>Regards <strong>Travelogue</strong>.</p>
      </div>`,
    };

    return user.updateOne(
      { resetPasswordLink: token },
      (err, success) => {
        if (err) {
          return res.json({ error: errorHandler(err) });
        } else {
          transporter.sendMail(mailOptions, (err, success) => {
            if (err) {
              return res.status(400).json({
                error: 'no field should be empty',
              });
            } else {
              return res.json({
                message:
                  'A link for password reset has been sent to your registered email',
              });
            }
          });
        }
      },
    );
  });
};

exports.resetPassword = (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;
  console.log(process.env.JWT_RESET_PASSWORD);

  if (resetPasswordLink) {
    jwt.verify(
      resetPasswordLink,
      process.env.JWT_RESET_PASSWORD,
      function(err, decoded) {
        if (err) {
          console.log(err);
          return res.status(401).json({
            error: 'token expired.',
          });
        }
        User.findOne({ resetPasswordLink }, (err, user) => {
          if (err || !user) {
            console.log(err);
            return res.status(401).json({
              error: 'user do not exist',
            });
          }
          const updatedFields = {
            password: newPassword,
            resetPasswordLink: '',
          };

          user = _.extend(user, updatedFields);
          user.save((err, result) => {
            if (err) {
              console.log(err);
              return res.status(400).json({
                error: errorHandler(err),
              });
            }
            res.json({
              message: 'Password has been reset successfully.',
            });
          });
        });
      },
    );
  }
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
exports.googleLogin = (req, res) => {
  const idToken = req.body.tokenId;
  client
    .verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    })
    .then(response => {
      console.log(response);
      const { email_verified, name, email, jti } = response.payload;
      if (email_verified) {
        User.findOne({ email }).exec((err, user) => {
          if (user) {
            console.log(user);
            const token = jwt.sign(
              { _id: user._id },
              process.env.JWT_SECRET,
              { expiresIn: '1d' },
            );
            res.cookie('token', token, { expiresIn: '1d' });
            const { _id, email, name, role, username } = user;
            return res.json({
              token,
              user: { _id, email, name, role, username },
            });
          } else {
            let username = shortId.generate();
            let profile = `${process.env.CLIENT_URL}/profile/${username}`;
            let password = jti;
            user = new User({
              name,
              email,
              profile,
              username,
              password,
            });
            user.save((err, data) => {
              if (err) {
                return res.status(400).json({
                  error: errorHandler(err),
                });
              }
              const token = jwt.sign(
                { _id: data._id },
                process.env.JWT_SECRET,
                { expiresIn: '1d' },
              );
              res.cookie('token', token, { expiresIn: '1d' });
              const { _id, email, name, role, username } = data;
              return res.json({
                token,
                user: { _id, email, name, role, username },
              });
            });
          }
        });
      } else {
        return res.status(400).json({
          error: 'Google login failed. Try again',
        });
      }
    });
};
