const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { createError, ERROR_CODES } = require("../errors");

const authMiddleware = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      
      throw createError(ERROR_CODES.INVALID_TOKEN);
    }

    const token = header.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({
      _id: decoded.id,
      isDeleted: false
    });

    if (!user) throw createError(ERROR_CODES.NOT_AUTHORIZED);

    req.user = user;

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = authMiddleware;
