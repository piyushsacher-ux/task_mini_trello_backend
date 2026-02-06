const { userService } = require("../services");
const { StatusCodes } = require("http-status-codes");


const searchUsers = async (req, res) => {
  try {
    const users = await userService.searchUsers(req.query.q || "");

    res.status(StatusCodes.OK).json({
      success: true,
      data: users
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

module.exports = {
  searchUsers
};
