const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const { ERROR_CODES, createError } = require("../errors");

const verifyToken = (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header) {
      throw createError(ERROR_CODES.VERIFICATION_TOKEN_MISSING);
    }

    if (!header.startsWith("Bearer ")) {
      throw createError(ERROR_CODES.INVALID_TOKEN);
    }

    const token = header.split(" ")[1];
    if (!token) {
      throw createError(ERROR_CODES.INVALID_TOKEN);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.verifyUserId = decoded.id;

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = verifyToken;
