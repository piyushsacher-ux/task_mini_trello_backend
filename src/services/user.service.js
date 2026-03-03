const { User, Project, Task } = require("../models");

const { logger } = require("../utils");

const searchUsers = async (query, currentUserId, page, limit) => {
  logger.debug(`User search: "${query}" by user: ${currentUserId}`);
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

const getUserStats = async (userId) => {
  logger.debug(`Fetching stats for user: ${userId}`);

  const [totalProjects, tasks] = await Promise.all([
    Project.countDocuments({
      isDeleted: false,
      $or: [
        { owner: userId },
        { admins: userId },
        { members: userId }
      ]
    }),
    Task.find({
      isDeleted: false,
      "assignees.user": userId
    }).select("status assignees")
  ]);

  const stats = {
    totalProjects,
    totalTasks: tasks.length,
    todo: 0,
    inProgress: 0,
    done: 0
  };

  tasks.forEach(task => {    
    const userAssignee = task.assignees.find(a => a.user.toString() === userId.toString());
    
    // 1. Done: The user has marked their individual status as done.
    if (userAssignee && userAssignee.status === "done") {
      stats.done++;
    } 
    // 2. In Progress: User status is todo, but overall task is in_progress.
    else if (task.status === "in_progress") {
      stats.inProgress++;
    } 
    // 3. Todo: Both are todo (or anything else that isn't done/in_progress).
    else {
      stats.todo++;
    }
  });

  return stats;
};


module.exports = {
  searchUsers,
  getUserStats
};

