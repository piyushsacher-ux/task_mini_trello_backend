const { userService } = require("../services");

const searchUsers = async (req, res) => {
  try {
    const users = await userService.searchUsers(req.query.q || "");

    res.json({
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
