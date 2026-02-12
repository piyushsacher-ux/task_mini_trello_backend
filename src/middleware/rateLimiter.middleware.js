const rateLimit = require("express-rate-limit");
const {ERROR_CODES, createError} = require("../errors");

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, 
  handler: (req, res, next) => {
    next(createError(ERROR_CODES.TOO_MANY_REQUESTS));
  },
  standardHeaders: true,
  legacyHeaders: false
});

const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, 
  handler: (req, res, next) => {
    next(createError(ERROR_CODES.TOO_MANY_REQUESTS));
  },
  standardHeaders: true,
  legacyHeaders: false
});


module.exports = {
  globalLimiter,
  authLimiter
};
