const jwt = require("jsonwebtoken");
const { User, TokenBlacklist } = require("../models");
const { createError, ERROR_CODES } = require("../errors");

const authMiddleware = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header) {
      throw createError(ERROR_CODES.NO_TOKEN_PROVIDED);
    }

    if (!header.startsWith("Bearer ")) {
      throw createError(ERROR_CODES.INVALID_TOKEN);
    }

    const token = header.split(" ")[1];

    const blacklisted = await TokenBlacklist.findOne({ token });
    if (blacklisted) {
      throw createError(ERROR_CODES.INVALID_TOKEN);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({
      _id: decoded.id,
      isDeleted: false,
    });

    if (!user) throw createError(ERROR_CODES.NOT_AUTHORIZED);

    if (decoded.tokenVersion !== user.tokenVersion) {
      throw createError(ERROR_CODES.TOKEN_EXPIRED_OR_INVALID);
    }

    req.user = user;

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = authMiddleware;
