const { createError, ERROR_CODES } = require("../errors");
const Message = require("../models/message.model");
const Project = require("../models/project.model");

/**
 * Save a new message
 */
const createMessage = async ({ projectId, senderId, content }) => {
  const project = await Project.findById(projectId)
    .select("members owner createdBy");

  if (!project) {
    throw createError(ERROR_CODES.PROJECT_NOT_FOUND);
  }

  const senderIdStr = senderId.toString();

  const isMember =
    project.members?.some(
      (memberId) => memberId.toString() === senderIdStr
    ) || false;

  const isOwner =
    project.owner?.toString() === senderIdStr;

  const isCreator =
    project.createdBy?.toString() === senderIdStr;

  if (!isMember && !isOwner && !isCreator) {
    throw createError(ERROR_CODES.USER_IS_NOT_MEMBER);
  }

  const message = await Message.create({
    project: projectId,
    sender: senderId,
    content,
  });

  await message.populate("sender", "name email");

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