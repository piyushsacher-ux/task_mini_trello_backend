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
    isDeleted: false
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


module.exports = {
  createProject,
  getMyProjects,
  updateProject,
  deleteProject
};

