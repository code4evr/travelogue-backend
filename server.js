const app = require('./app');
const mongoose = require('mongoose');

const port = process.env.PORT || 5002;

require('dotenv').config();

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD,
);
mongoose
  .connect(DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('DB connect successful');
  })
  .catch(err => {
    console.log(err);
  });

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
