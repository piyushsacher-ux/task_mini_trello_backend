const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { ERROR_CODES , createError} = require("../errors");

const socketAuth = async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      throw createError(ERROR_CODES.NO_TOKEN_PROVIDED);
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw createError(ERROR_CODES.INVALID_TOKEN);
    }
    // Optional but recommended: verify user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      throw createError(ERROR_CODES.USER_NOT_FOUND);
    }

    // Attach user to socket
    socket.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = socketAuth;