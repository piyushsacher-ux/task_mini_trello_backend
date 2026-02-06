const { projectService } = require("../services");
const { StatusCodes } = require("http-status-codes");

const createProject = async (req, res) => {
  try {
    const project = await projectService.createProject(req.body, req.user._id);

    res.status(StatusCodes.CREATED).json({
      success: true,
      data: project
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

const getMyProjects = async (req, res) => {
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
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

const updateProject = async (req, res) => {
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
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

const deleteProject = async (req, res) => {
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
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

const addMembers = async (req, res) => {
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
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

const removeMember = async (req,res)=>{
  try{
    const project = await projectService.removeMember(
      req.params.projectId,
      req.user._id,
      req.params.userId
    );

    res.status(StatusCodes.OK).json({ success:true, data:project });
  }catch(err){
    res.status(400).json({ success:false, message:err.message });
  }
};

const addAdmins = async (req, res) => {
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
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

const removeAdmin = async (req, res) => {
  try {
    const project = await projectService.removeAdmin(
      req.params.projectId,
      req.user._id,
      req.params.userId
    );

    res.status(StatusCodes.OK).json({ success: true, data: project });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const getProjectById = async (req, res) => {
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
    res.status(400).json({
      success: false,
      message: err.message
    });
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

