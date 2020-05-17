const nodemailer = require('nodemailer');

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

exports.contactForm = (req, res) => {
  const { name, email, message } = req.body;

  const mailOptions = {
    from: email,
    to: 'vidit.the.known@gmail.com',
    subject: `Contact Form - ${process.env.APP_NAME}`,
    html: `
      <div style="background:#eee; padding:1rem; border-radius:5px;"
      <h1>Contact Form Message</h1>
      <hr>
      <p>Sender's name: ${name}</p>
      <p>Sender's email: ${email}</p>
      <p>Sender's message: ${message}</p>
      <p>Regards <strong>Travelogue</strong>.</p>
      </div>`,
  };
  transporter.sendMail(mailOptions, (err, success) => {
    if (err) {
      return res.status(400).json({
        error: 'no field should be empty',
      });
    } else {
      return res.json({
        success: true,
      });
    }
  });
};
