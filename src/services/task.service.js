const { Task, Project, User } = require("../models");
const { ERROR_CODES, createError } = require("../errors");

const createTask = async (projectId, userId, payload) => {
  const project = await Project.findOne({ _id: projectId, isDeleted: false });

  if (!project) throw createError(ERROR_CODES.PROJECT_NOT_FOUND);

  if (!project.owner.equals(userId) && !project.admins.includes(userId)) {
    throw createError(ERROR_CODES.NOT_AUTHORIZED);
  }

  const uniqueAssignees = [...new Set(payload.assignees)];

  const invalid = uniqueAssignees.some((id) => !project.members.includes(id));

  if (invalid) throw createError(ERROR_CODES.USER_NOT_ASSIGNED);

  const count = await User.countDocuments({
    _id: { $in: uniqueAssignees },
    isDeleted: false,
    isVerified: true,
  });

  if (count !== uniqueAssignees.length)
    throw createError(ERROR_CODES.INVALID_ASSIGNEES);

  const assignees = uniqueAssignees.map((id) => ({ user: id }));

  const task = await Task.create({
    title: payload.title,
    description: payload.description,
    projectId,
    assignees,
    createdBy: userId,
  });

  return task;
};

const getTasks = async (
  projectId,
  userId,
  {
    page,
    limit,
    status,
    search,
    assignedTo,
    priority,
    dueBefore,
    dueAfter,
    sortBy,
    order,
  },
) => {
  const skip = (page - 1) * limit;

  const project = await Project.findOne({
    _id: projectId,
    isDeleted: false,
  });

  if (!project) throw createError(ERROR_CODES.PROJECT_NOT_FOUND);

  const allowed =
    project.owner.equals(userId) ||
    project.admins.includes(userId) ||
    project.members.includes(userId);

  if (!allowed) throw createError(ERROR_CODES.NOT_AUTHORIZED);

  const filter = {
    projectId,
    isDeleted: false,
  };

  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (search) {
    filter.title = { $regex: search, $options: "i" };
  }
  if (assignedTo) {
    filter["assignees.user"] = assignedTo;
  }
  if (dueBefore || dueAfter) {
    filter.dueDate = {};
    if (dueBefore) filter.dueDate.$lte = dueBefore;
    if (dueAfter) filter.dueDate.$gte = dueAfter;
  }

  const sort = {
    [sortBy]: order === "asc" ? 1 : -1,
  };

  const [tasks, total] = await Promise.all([
    Task.find(filter)
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .populate("assignees.user", "name email"),

    Task.countDocuments(filter),
  ]);

  return {
    tasks,
    total,
    page,
    limit,
  };
};

const selfCompleteTask = async (taskId, userId) => {
  const task = await Task.findOne({
    _id: taskId,
    isDeleted: false,
  }).populate("projectId");

  if (!task) throw createError(ERROR_CODES.TASK_NOT_FOUND);

  const project = task.projectId;

  const isOwner = project.owner.equals(userId);
  const isAdmin = project.admins.includes(userId);

  // try to find assignee
  const assignee = task.assignees.find(
    (a) => a.user.toString() === userId.toString(),
  );

  // if not assignee and not admin/owner → forbidden
  if (!assignee && !isOwner && !isAdmin) {
    throw createError(ERROR_CODES.USER_NOT_ASSIGNED);
  }

  // if owner/admin but not assignee → force complete ALL
  if (!assignee && (isOwner || isAdmin)) {
    task.assignees.forEach((a) => {
      a.status = "done";
      a.completedAt = new Date();
    });

    task.status = "done";
    await task.save();
    return task;
  }

  // normal assignee flow
  if (assignee.status === "done") {
    throw createError(ERROR_CODES.ALREADY_COMPLETED);
  }

  assignee.status = "done";
  assignee.completedAt = new Date();

  const allDone = task.assignees.every((a) => a.status === "done");

  task.status = allDone ? "done" : "in_progress";

  await task.save();

  return task;
};

const deleteTask = async (taskId, userId) => {
  const task = await Task.findOne({
    _id: taskId,
    isDeleted: false,
  }).populate("projectId");

  if (!task) throw createError(ERROR_CODES.TASK_NOT_FOUND);

  if (!task.projectId) throw createError(ERROR_CODES.PROJECT_NOT_FOUND);

  const project = task.projectId;

  const allowed =
    project.owner.equals(userId) ||
    project.admins.includes(userId) ||
    task.createdBy.equals(userId);

  if (!allowed) throw createError(ERROR_CODES.NOT_AUTHORIZED);

  task.isDeleted = true;
  await task.save();

  return task;
};

const getMyTasks = async (userId, { page, limit, status, search }) => {
  const skip = (page - 1) * limit;

  const filter = {
    isDeleted: false,
    "assignees.user": userId,
  };

  if (status) filter.status = status;

  if (search) {
    filter.title = { $regex: search, $options: "i" };
  }

  const [tasks, total] = await Promise.all([
    Task.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("assignees.user", "name email")
      .populate("projectId", "name"),

    Task.countDocuments(filter),
  ]);

  return {
    tasks,
    total,
    page,
    limit,
  };
};

const getTasksCreatedByMe = async (
  userId,
  { page = 1, limit = 10, status, search },
) => {
  const skip = (page - 1) * limit;

  const filter = {
    isDeleted: false,
    createdBy: userId,
  };

  if (status) filter.status = status;

  if (search) {
    filter.title = { $regex: search, $options: "i" };
  }

  const [tasks, total] = await Promise.all([
    Task.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("assignees.user", "name email")
      .populate("projectId", "name"),

    Task.countDocuments(filter),
  ]);

  return {
    tasks,
    total,
    page,
    limit,
  };
};

const addAssigneesToTask = async (taskId, userId, assignees) => {
  const task = await Task.findOne({
    _id: taskId,
    isDeleted: false,
  }).populate("projectId");

  if (!task) throw createError(ERROR_CODES.TASK_NOT_FOUND);

  const project = task.projectId;

  const isOwner = project.owner.equals(userId);
  const isAdmin = project.admins.includes(userId);
  const isCreator = task.createdBy.equals(userId);

  if (!isOwner && !isAdmin && !isCreator) {
    throw createError(ERROR_CODES.NOT_AUTHORIZED);
  }

  // Only allow users who are part of the project (members/admins/owner)
  const allowedUsers = new Set([
    project.owner.toString(),
    ...project.admins.map((id) => id.toString()),
    ...project.members.map((id) => id.toString()),
  ]);

  const invalid = assignees.find((id) => !allowedUsers.has(id.toString()));
  if (invalid) {
    throw createError(ERROR_CODES.INVALID_ASSIGNEES);
  }

  if (assignees.some((id) => id.toString() === userId.toString())) {
    throw createError(ERROR_CODES.CANNOT_ASSIGN_SELF);
  }

  // Existing assignees
  const existing = new Set(task.assignees.map((a) => a.user.toString()));

  // Add only new ones
  const toAdd = assignees
    .filter((id) => !existing.has(id.toString()))
    .map((id) => ({
      user: id,
      status: "todo",
      assignedAt: new Date(),
      completedAt: null,
    }));

  if (!toAdd.length) return task;

  task.assignees.push(...toAdd);

  if (task.status === "done") {
    task.status = "in_progress";
  }

  await task.save();
  return task;
};

const removeAssigneeFromTask = async (taskId, removerId, assigneeUserId) => {
  const task = await Task.findOne({
    _id: taskId,
    isDeleted: false,
  }).populate("projectId");

  if (!task) throw createError(ERROR_CODES.TASK_NOT_FOUND);

  const project = task.projectId;

  const isOwner = project.owner.equals(removerId);
  const isAdmin = project.admins.includes(removerId);
  const isCreator = task.createdBy.equals(removerId);

  if (!isOwner && !isAdmin && !isCreator) {
    throw createError(ERROR_CODES.NOT_AUTHORIZED);
  }

  // check assignee exists
  const index = task.assignees.findIndex(
    (a) => a.user.toString() === assigneeUserId.toString(),
  );

  if (index === -1) {
    throw createError(ERROR_CODES.USER_NOT_ASSIGNED);
  }

  // we are not removing last assignee
  if (task.assignees.length === 1) {
    throw createError(ERROR_CODES.CANNOT_REMOVE_LAST_ASSIGNEE);
  }

  // remove assignee
  task.assignees.splice(index, 1);

  // recompute status
  const allDone = task.assignees.every((a) => a.status === "done");
  task.status = allDone ? "done" : "in_progress";

  await task.save();
  return task;
};

const updateTask = async (taskId, userId, payload) => {
  const task = await Task.findOne({
    _id: taskId,
    isDeleted: false,
  }).populate("projectId");

  if (!task) throw createError(ERROR_CODES.TASK_NOT_FOUND);

  const project = task.projectId;

  const allowed =
    project.owner.equals(userId) ||
    project.admins.includes(userId) ||
    task.createdBy.equals(userId);

  if (!allowed) {
    throw createError(ERROR_CODES.NOT_AUTHORIZED);
  }

  // Only allow safe fields
  const allowedFields = [
    "title",
    "description",
    "priority",
    "dueDate",
    "status",
  ];

  allowedFields.forEach((field) => {
    if (payload[field] !== undefined) {
      task[field] = payload[field];
    }
  });

  await task.save();
  return task;
};

module.exports = {
  createTask,
  getTasks,
  getMyTasks,
  selfCompleteTask,
  getTasksCreatedByMe,
  deleteTask,
  addAssigneesToTask,
  removeAssigneeFromTask,
  updateTask,
};
