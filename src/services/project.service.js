const { Project, User } = require("../models");

const createProject = async ({ name, description = "", admins = [], members = [] }, ownerId) => {
  if (!name || !name.trim()) {
    throw new Error("Project name is required");
  }

  const normalizedName = name.trim().toLowerCase();

  //Prevent duplicate project for same owner
  const existing = await Project.findOne({
    owner: ownerId,
    nameLower: normalizedName,
    isDeleted: false
  });

  if (existing) {
    throw new Error("Project with same name already exists");
  }

  // Remove owner from admins/members
  admins = admins.filter(id => id.toString() !== ownerId.toString());
  members = members.filter(id => id.toString() !== ownerId.toString());

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
      isVerified: true
    });

    if (count !== allUserIds.length) {
      throw new Error("One or more users are invalid");
    }
  }

  // Ensure admins are also members
  admins.forEach(a => {
    if (!members.includes(a)) members.push(a);
  });

  // Create project
  const project = await Project.create({
    name: name.trim(),
    nameLower: normalizedName,
    description,
    owner: ownerId,
    admins,
    members
  });

  return project;
};

const getMyProjects = async (userId, { page, limit, search }) => {
  const skip = (page - 1) * limit;

  const filter = {
    isDeleted: false,
    $or: [
      { owner: userId },
      { admins: userId },
      { members: userId }
    ]
  };

  if (search) {
    filter.nameLower = { $regex: search.toLowerCase(), $options: "i" };
  }

  const [projects, total] = await Promise.all([
    Project.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),

    Project.countDocuments(filter)
  ]);

  return {
    projects,
    total,
    page,
    limit
  };
};

module.exports = {
  createProject,
  getMyProjects
};
