const { User } = require("../models");

const searchUsers = async (query, currentUserId, page, limit) => {
  const skip = (page - 1) * limit;
  return User.find({
    _id: { $ne: currentUserId },
    isDeleted: false,
    isVerified: true,
    $or: [
      { name: { $regex: query, $options: "i" } },
      { email: { $regex: query, $options: "i" } }
    ]
  }).select("_id name email").skip(skip).limit(limit);
};

module.exports = {
  searchUsers
};
