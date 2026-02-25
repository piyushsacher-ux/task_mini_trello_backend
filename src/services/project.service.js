const { Project, User, Task } = require("../models");
const { ERROR_CODES, createError } = require("../errors");

const createProject = async (
  { name, description = "", admins = [], members = [] },
  ownerId,
) => {
  if (!name || !name.trim()) {
    throw createError(ERROR_CODES.PROJECT_NAME_REQUIRED);
  }

  const normalizedName = name.trim().toLowerCase();

  //Prevent duplicate project for same owner
  const existing = await Project.findOne({
    owner: ownerId,
    nameLower: normalizedName,
    isDeleted: false,
  });

  if (existing) {
    throw createError(ERROR_CODES.PROJECT_NAME_EXISTS);
  }

  // Remove owner from admins/members
  admins = admins.filter((id) => id.toString() !== ownerId.toString());
  members = members.filter((id) => id.toString() !== ownerId.toString());

  // Deduplicate ids
  admins = [...new Set(admins.map(String))];
  members = [...new Set(members.map(String))];

  // Collect all users
  const allUserIds = [...new Set([...admins, ...members])];

  // Validate users exist + active + verified
  if (allUserIds.length) {
    const count = await User.countDocuments({
      _id: { $in: allUserIds },
      isDeleted: false,
      isVerified: true,
    });

    if (count !== allUserIds.length) {
      throw createError(ERROR_CODES.ONE_OR_MORE_USER_INVALID);
    }
  }

  // Ensure admins are also members
  admins.forEach((a) => {
    if (!members.includes(a)) members.push(a);
  });

  // Create project
  const project = await Project.create({
    name: name.trim(),
    nameLower: normalizedName,
    description,
    owner: ownerId,
    admins,
    members,
  });

  return project;
};

const getMyProjects = async (userId, { page, limit, search }) => {
  const skip = (page - 1) * limit;

  const filter = {
    isDeleted: false,
    $or: [{ owner: userId }, { admins: userId }, { members: userId }],
  };

  if (search) {
    filter.nameLower = { $regex: search.toLowerCase(), $options: "i" };
  }

  const [projects, total] = await Promise.all([
    Project.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 })
    .populate("owner", "name email")
    .populate("admins", "name email")
    .populate("members", "name email"),

    Project.countDocuments(filter),
  ]);

  return {
    projects,
    total,
    page,
    limit,
  };
};

const updateProject = async (projectId, userId, payload) => {
  const project = await Project.findOne({
    _id: projectId,
    isDeleted: false,
  });

  if (!project) throw createError(ERROR_CODES.PROJECT_NOT_FOUND);

  // Authorization
  if (!project.owner.equals(userId) && !project.admins.includes(userId)) {
    throw createError(ERROR_CODES.NOT_AUTHORIZED);
  }

  if (payload.name) {
    const normalized = payload.name.trim().toLowerCase();

    const duplicate = await Project.findOne({
      owner: project.owner,
      nameLower: normalized,
      isDeleted: false,
      _id: { $ne: projectId },
    });

    if (duplicate) {
      throw createError(ERROR_CODES.PROJECT_NAME_EXISTS);
    }

    payload.name = payload.name.trim();
    payload.nameLower = normalized;
  }

  return Project.findByIdAndUpdate(projectId, payload, { new: true });
};

const deleteProject = async (projectId, userId) => {
  const project = await Project.findOne({
    _id: projectId,
    isDeleted: false,
  });

  if (!project) {
    throw createError(ERROR_CODES.PROJECT_NOT_FOUND);
  }

  // only owner can delete project
  if (!project.owner.equals(userId)) {
    throw createError(ERROR_CODES.NOT_AUTHORIZED);
  }

  // soft delete project
  project.isDeleted = true;
  await project.save();

  //soft delete all tasks under this project
  await Task.updateMany({ projectId }, { $set: { isDeleted: true } });

  return true;
};

const addMembers = async (projectId, actorId, members) => {
  const project = await Project.findOne({ _id: projectId, isDeleted: false });

  if (!project) throw createError(ERROR_CODES.PROJECT_NOT_FOUND);

  // owner or admin
  if (!project.owner.equals(actorId) && !project.admins.includes(actorId)) {
    throw createError(ERROR_CODES.NOT_AUTHORIZED);
  }

  members = [...new Set(members.map((id) => id.toString()))];

  // validate users exist
  const count = await User.countDocuments({
    _id: { $in: members },
    isDeleted: false,
    isVerified: true,
  });

  if (count !== members.length) {
    throw createError(ERROR_CODES.ONE_OR_MORE_USER_INVALID);
  }

  members.forEach((id) => {
    const exists = project.members.some((m) => m.toString() === id.toString());

    if (!exists) {
      project.members.push(id);
    }
  });

  await project.save();

  return project;
};

const removeMember = async (projectId, actorId, memberId) => {
  const project = await Project.findOne({ _id: projectId, isDeleted: false });

  if (!project) throw createError(ERROR_CODES.PROJECT_NOT_FOUND);

  if (!project.owner.equals(actorId) && !project.admins.includes(actorId)) {
    throw createError(ERROR_CODES.NOT_AUTHORIZED);
  }

  if (project.owner.equals(memberId)) {
    throw createError(ERROR_CODES.USER_NOT_ASSIGNED);
  }

  project.members = project.members.filter((id) => id.toString() !== memberId);
  project.admins = project.admins.filter((id) => id.toString() !== memberId);

  await project.save();
  return project;
};

const addAdmins = async (projectId, actorId, admins) => {
  const project = await Project.findOne({ _id: projectId, isDeleted: false });

  if (!project) throw createError(ERROR_CODES.PROJECT_NOT_FOUND);

  // ONLY OWNER
  if (!project.owner.equals(actorId)) {
    throw createError(ERROR_CODES.NOT_AUTHORIZED);
  }

  admins = [...new Set(admins.map((id) => id.toString()))];

  // validate users exist + verified
  const count = await User.countDocuments({
    _id: { $in: admins },
    isDeleted: false,
    isVerified: true,
  });

  if (count !== admins.length) {
    throw createError(ERROR_CODES.ONE_OR_MORE_USER_INVALID);
  }

  admins.forEach((id) => {
    const isAdmin = project.admins.some((a) => a.toString() === id);

    if (!isAdmin) {
      project.admins.push(id);
    }

    //admin must also be member
    const isMember = project.members.some((m) => m.toString() === id);

    if (!isMember) {
      project.members.push(id);
    }
  });

  await project.save();
  return project;
};

const removeAdmin = async (projectId, actorId, adminId) => {
  const project = await Project.findOne({ _id: projectId, isDeleted: false });

  if (!project) throw createError(ERROR_CODES.PROJECT_NOT_FOUND);

  if (!project.owner.equals(actorId)) {
    throw createError(ERROR_CODES.NOT_AUTHORIZED);
  }

  project.admins = project.admins.filter((id) => id.toString() !== adminId);

  await project.save();
  return project;
};

const getProjectById = async (projectId, userId) => {
  const project = await Project.findOne({
    _id: projectId,
    isDeleted: false,
  })
    .populate("owner", "name email")
    .populate("admins", "name email")
    .populate("members", "name email");

  if (!project) throw createError(ERROR_CODES.PROJECT_NOT_FOUND);

  const isAllowed =
    project.owner._id.equals(userId) ||
    project.admins.some((a) => a._id.equals(userId)) ||
    project.members.some((m) => m._id.equals(userId));

  if (!isAllowed) throw createError(ERROR_CODES.NOT_AUTHORIZED);

  return project;
};

module.exports = {
  createProject,
  getMyProjects,
  addAdmins,
  updateProject,
  deleteProject,
  addMembers,
  removeMember,
  removeAdmin,
  getProjectById,
};
