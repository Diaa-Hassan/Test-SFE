const app = require('./server');
const config = require('./config');

module.exports = async function startServer() {
  app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
    console.log(`check out http://localhost:${config.port}/healthCheck`);

  });
}

require('./middlewares/dbConnection');