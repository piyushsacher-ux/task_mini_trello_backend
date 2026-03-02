const { logger } = require("../utils");
const { StatusCodes } = require("http-status-codes");

const errorHandler = (err, req, res, next) => {
  logger.error(`${err.statusCode || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: err.message || "Internal server error"
  });
};

module.exports = errorHandler;
