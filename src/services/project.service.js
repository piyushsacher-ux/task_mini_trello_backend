const { Project, User } = require("../models");

const createProject = async (
  { name, description = "", admins = [], members = [] },
  ownerId,
) => {
  if (!name || !name.trim()) {
    throw new Error("Project name is required");
  }

  const normalizedName = name.trim().toLowerCase();

  //Prevent duplicate project for same owner
  const existing = await Project.findOne({
    owner: ownerId,
    nameLower: normalizedName,
    isDeleted: false,
  });

  if (existing) {
    throw new Error("Project with same name already exists");
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
      throw new Error("One or more users are invalid");
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
    Project.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),

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

  if (!project) throw new Error("Project not found");

  // Authorization
  if (!project.owner.equals(userId) && !project.admins.includes(userId)) {
    throw new Error("Not authorized");
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
      throw new Error("Project with same name already exists");
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

  if (!project) throw new Error("Project not found");

  // ONLY OWNER can delete
  if (!project.owner.equals(userId)) {
    throw new Error("Only owner can delete project");
  }

  project.isDeleted = true;
  await project.save();

  return;
};

const addMembers = async (projectId, actorId, members) => {
  const project = await Project.findOne({ _id: projectId, isDeleted: false });

  if (!project) throw new Error("Project not found");

  // owner or admin
  if (!project.owner.equals(actorId) && !project.admins.includes(actorId)) {
    throw new Error("Not authorized");
  }

  // validate users exist
  const count = await User.countDocuments({
    _id: { $in: members },
    isDeleted: false,
    isVerified: true,
  });

  if (count !== members.length) {
    throw new Error("One or more users invalid");
  }

  members.forEach((id) => {
    if (!project.members.includes(id)) {
      project.members.push(id);
    }
  });

  await project.save();

  return project;
};

const removeMember = async (projectId, actorId, memberId) => {
  const project = await Project.findOne({ _id: projectId, isDeleted: false });

  if (!project) throw new Error("Project not found");

  if (!project.owner.equals(actorId) && !project.admins.includes(actorId)) {
    throw new Error("Not authorized");
  }

  if (project.owner.equals(memberId)) {
    throw new Error("Cannot remove owner");
  }

  project.members = project.members.filter((id) => id.toString() !== memberId);
  project.admins = project.admins.filter((id) => id.toString() !== memberId);

  await project.save();
  return project;
};

const addAdmins = async (projectId, actorId, admins) => {
  const project = await Project.findOne({ _id: projectId, isDeleted: false });

  if (!project) throw new Error("Project not found");

  // ONLY OWNER
  if (!project.owner.equals(actorId)) {
    throw new Error("Only owner can add admins");
  }

  // validate users exist + verified
  const count = await User.countDocuments({
    _id: { $in: admins },
    isDeleted: false,
    isVerified: true,
  });

  if (count !== admins.length) {
    throw new Error("One or more users invalid");
  }

  admins.forEach((id) => {
    if (!project.admins.includes(id)) {
      project.admins.push(id);
    }

    // admin must also be member
    if (!project.members.includes(id)) {
      project.members.push(id);
    }
  });

  await project.save();
  return project;
};

const removeAdmin = async (projectId, actorId, adminId) => {
  const project = await Project.findOne({ _id: projectId, isDeleted: false });

  if (!project) throw new Error("Project not found");

  if (!project.owner.equals(actorId)) {
    throw new Error("Only owner can remove admin");
  }

  project.admins = project.admins.filter((id) => id.toString() !== adminId);

  await project.save();
  return project;
};

const getProjectById = async (projectId, userId) => {
  const project = await Project.findOne({
    _id: projectId,
    isDeleted: false
  })
    .populate("owner", "name email")
    .populate("admins", "name email")
    .populate("members", "name email");

  if (!project) throw new Error("Project not found");

  const isAllowed =
    project.owner._id.equals(userId) ||
    project.admins.some(a => a._id.equals(userId)) ||
    project.members.some(m => m._id.equals(userId));

  if (!isAllowed) throw new Error("Not authorized");

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
  getProjectById
};
