const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const MESSAGES = require("../errors/error.messages");

const verifyToken = (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: MESSAGES.VERIFICATION_TOKEN_MISSING });
    }

    const token = header.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.verifyUserId = decoded.id;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = verifyToken;
