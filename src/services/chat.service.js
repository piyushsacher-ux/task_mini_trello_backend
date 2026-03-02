const { createError, ERROR_CODES } = require("../errors");
const Message = require("../models/message.model");
const Project = require("../models/project.model");

/**
 * Save a new message
 */
const createMessage = async ({ projectId, senderId, content }) => {
  // Optional: verify project exists
  const project = await Project.findById(projectId);
  if (!project) {
    throw createError(ERROR_CODES.PROJECT_NOT_FOUND);
  }

  // Optional: verify sender is member of project
  if (!project.members.includes(senderId)) {
    throw createError(ERROR_CODES.USER_IS_NOT_MEMBER);
  }

  const message = await Message.create({
    project: projectId,
    sender: senderId,
    content,
  });

  return message;
};

/**
 * Get messages of a project (with pagination)
 */
const getProjectMessages = async (projectId, limit = 50, skip = 0) => {
  return Message.find({ project: projectId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .populate("sender", "name email");
};

module.exports = {
  createMessage,
  getProjectMessages,
};