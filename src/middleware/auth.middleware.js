const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { StatusCodes } = require("http-status-codes");
const MESSAGES = require("../errors/error.messages");

const authMiddleware = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: MESSAGES.NO_TOKEN_PROVIDED });
    }

    const token = header.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({
      _id: decoded.id,
      isDeleted: false
    });

    if (!user) return res.status(StatusCodes.UNAUTHORIZED).json({ message: MESSAGES.NOT_AUTHORIZED });

    req.user = user;

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
