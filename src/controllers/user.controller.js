const { userService } = require("../services");
const { StatusCodes } = require("http-status-codes");


const searchUsers = async (req, res, next) => {
  try {
    const users = await userService.searchUsers(req.query.q || "", req.user._id, req.query.page || 1, req.query.limit || 10);

    res.status(StatusCodes.OK).json({
      success: true,
      data: users
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  searchUsers
};
