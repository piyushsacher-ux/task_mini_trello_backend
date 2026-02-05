const { projectService } = require("../services");

const createProject = async (req, res) => {
  try {
    const project = await projectService.createProject(req.body, req.user._id);

    res.status(201).json({
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

    res.json({
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
module.exports = {
  createProject,
  getMyProjects
};
