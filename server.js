const express = require('express');
const cors = require('cors');

const routes = require('./routes');

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// routes
app.use('/healthCheck', (req, res) => {
  res.status(200).json({
    message: 'Server is running'
  });
});
app.use('/api', routes);

// 404 NotFound route
app.use((_, res, next) => {
  res.status(404).json({ message: 'Not Found' });
  next();
});

/** Error Handler */
app.use(async (err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

module.exports = app;