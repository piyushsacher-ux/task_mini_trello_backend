const ERROR_CODES = require("./error.codes");

const createError = (error) => {
  return {
    message: error.message,
    statusCode: error.statusCode
  };
};

module.exports = {
  ERROR_CODES,
  createError
};
