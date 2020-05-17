const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const blogRouter = require('./routes/blogs/blogRoutes');
const userRouter = require('./routes/users/userRoutes');
const signUp = require('./routes/auth');
const categoryRoute = require('./routes/category');
const tagRoute = require('./routes/tag');
const contactFormRoute = require('./routes/contactForm');
const forgotPasswordRoute = require('./routes/auth');
const resetPasswordRoute = require('./routes/auth');
const googleLoginRoute = require('./routes/auth');

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(cors({ option: `${process.env.CLIENT_URL}` }));
}

app.use('/api', blogRouter);
app.use('/api', userRouter);
app.use('/api', signUp);
app.use('/api', categoryRoute);
app.use('/api', tagRoute);
app.use('/api', contactFormRoute);
app.use('/api', forgotPasswordRoute);
app.use('/api', resetPasswordRoute);
app.use('/api', googleLoginRoute);

module.exports = app;
