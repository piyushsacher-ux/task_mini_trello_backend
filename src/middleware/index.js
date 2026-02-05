module.exports = {
  validate: require("./validate.middleware"),
  authMiddleware: require("./auth.middleware"),
  verifyToken: require("./verifyToken.middleware")
};
