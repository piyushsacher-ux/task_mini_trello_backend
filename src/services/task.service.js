const { Task, Project } = require("../models");

const createTask = async (projectId, userId, payload) => {
  const project = await Project.findOne({ _id: projectId, isDeleted: false });

  if (!project) throw new Error("Project not found");

  if (!project.owner.equals(userId) && !project.admins.includes(userId)) {
    throw new Error("Not authorized");
  }

  const uniqueAssignees = [...new Set(payload.assignees)];

  const invalid = uniqueAssignees.some((id) => !project.members.includes(id));

  if (invalid) throw new Error("User not part of project");

  const count = await User.countDocuments({
    _id: { $in: uniqueAssignees },
    isDeleted: false,
    isVerified: true,
  });

  if (count !== uniqueAssignees.length) throw new Error("Invalid assignees");

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

const getTasks = async (projectId, userId, { page, limit, status, search }) => {
  const skip = (page - 1) * limit;

  const project = await Project.findOne({
    _id: projectId,
    isDeleted: false,
  });

  if (!project) throw new Error("Project not found");

  const allowed =
    project.owner.equals(userId) ||
    project.admins.includes(userId) ||
    project.members.includes(userId);

  if (!allowed) throw new Error("Not authorized");

  const filter = {
    projectId,
    isDeleted: false,
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
    isDeleted: false
  });

  if (!task) throw new Error("Task not found");

  // find this user inside assignees
  const assignee = task.assignees.find(
    a => a.user.toString() === userId.toString()
  );

  if (!assignee) {
    throw new Error("You are not assigned to this task");
  }

  // already completed
  if (assignee.status === "done") {
    throw new Error("Already completed");
  }

  assignee.status = "done";
  assignee.completedAt = new Date();

  // recompute task status
  const allDone = task.assignees.every(a => a.status === "done");

  task.status = allDone ? "done" : "in_progress";

  await task.save();

  return task;
};

const deleteTask = async (taskId, userId) => {
  const task = await Task.findOne({
    _id: taskId,
    isDeleted: false
  }).populate("projectId");

  if (!task) throw new Error("Task not found");

  if (!task.projectId) throw new Error("Project not found");

  const project = task.projectId;

  const allowed =
    project.owner.equals(userId) ||
    project.admins.includes(userId) ||
    task.createdBy.equals(userId);

  if (!allowed) throw new Error("Not authorized");

  task.isDeleted = true;
  await task.save();

  return task;
};

const getMyTasks = async (userId, { page, limit, status, search }) => {
  const skip = (page - 1) * limit;

  const filter = {
    isDeleted: false,
    "assignees.user": userId
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

    Task.countDocuments(filter)
  ]);

  return {
    tasks,
    total,
    page,
    limit
  };
};



module.exports = {
  createTask,
  getTasks,
  getMyTasks,
  selfCompleteTask,
  deleteTask
};
