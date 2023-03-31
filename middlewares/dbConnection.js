const mongoose = require('mongoose');
const config = require('../config');
const startServer = require('../index');

const MONGO_URI = config.db_url;

mongoose.set("strictQuery", false);
mongoose
  .connect(MONGO_URI, {
    retryWrites: true,
    w: 'majority',
  })
  .then(() => {
    startServer();
  })
  .catch((error) => console.error(error));

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to db Successfully.');
});

mongoose.connection.on('error', (err) => {
  console.log(err.message)
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose connection is disconnected.')
});

process.on('SIGINT', async () => {
  await mongoose.connection.close()
  process.exit(0)
});