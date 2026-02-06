const { projectService } = require("../services");
const { StatusCodes } = require("http-status-codes");

const createProject = async (req, res, next) => {
  try {
    const project = await projectService.createProject(req.body, req.user._id);

    res.status(StatusCodes.CREATED).json({
      success: true,
      data: project
    });
  } catch (err) {
    next(err);
  }
};

const getMyProjects = async (req, res, next) => {
  try {
    const result = await projectService.getMyProjects(req.user._id, req.query);

    res.status(StatusCodes.OK).json({
      success: true,
      data: result.projects,
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit
      }
    });
  } catch (err) {
    next(err);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const project = await projectService.updateProject(
      req.params.projectId,
      req.user._id,
      req.body
    );

    res.status(StatusCodes.OK).json({
      success: true,
      data: project
    });
  } catch (err) {
    next(err);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    await projectService.deleteProject(
      req.params.projectId,
      req.user._id
    );

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Project deleted successfully"
    });
  } catch (err) {
    next(err);
  }
};

const addMembers = async (req, res, next) => {
  try {
    const project = await projectService.addMembers(
      req.params.projectId,
      req.user._id,
      req.body.members
    );

    res.status(StatusCodes.OK).json({
      success: true,
      data: project
    });
  } catch (err) {
    next(err);
  }
};

const removeMember = async (req, res, next) => {
  try {
    const project = await projectService.removeMember(
      req.params.projectId,
      req.user._id,
      req.params.userId
    );

    res.status(StatusCodes.OK).json({ success:true, data:project });
  }catch(err){
    next(err);
  }
};

const addAdmins = async (req, res, next) => {
  try {
    const project = await projectService.addAdmins(
      req.params.projectId,
      req.user._id,
      req.body.admins
    );

    res.status(StatusCodes.OK).json({
      success: true,
      data: project
    });
  } catch (err) {
    next(err);
  }
};

const removeAdmin = async (req, res, next) => {
  try {
    const project = await projectService.removeAdmin(
      req.params.projectId,
      req.user._id,
      req.params.userId
    );

    res.status(StatusCodes.OK).json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
};

const getProjectById = async (req, res, next) => {
  try {
    const project = await projectService.getProjectById(
      req.params.projectId,
      req.user._id
    );

    res.status(StatusCodes.OK).json({
      success: true,
      data: project
    });
  } catch (err) {
    next(err);
  }
};


module.exports = {
  createProject,
  getMyProjects,
  addMembers,
  updateProject,
  deleteProject,
  removeMember,
  addAdmins,
  removeAdmin,
  getProjectById
};

