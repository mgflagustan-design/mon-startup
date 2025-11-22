const morgan = require('morgan');

const stream = {
  write: (message) => {
    process.stdout.write(message);
  },
};

const httpLogger = morgan(':method :url :status :response-time ms', { stream });

module.exports = {
  httpLogger,
};

