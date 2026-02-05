const { taskService } = require("../services");

const createTask = async (req, res) => {
  try {
    const task = await taskService.createTask(
      req.params.projectId,
      req.user._id,
      req.body
    );

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

const getTasks = async (req, res) => {
  try {
    const result = await taskService.getTasks(
      req.params.projectId,
      req.user._id,
      req.query
    );

    res.json({
      success: true,
      data: result.tasks,
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

const selfCompleteTask = async (req, res) => {
  try {
    const task = await taskService.selfCompleteTask(
      req.params.taskId,
      req.user._id
    );

    res.json({
      success: true,
      data: task
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    await taskService.deleteTask(
      req.params.taskId,
      req.user._id
    );

    res.json({
      success: true,
      message: "Task deleted"
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

const getMyTasks = async (req, res) => {
  try {
    const result = await taskService.getMyTasks(
      req.user._id,
      req.query
    );

    res.json({
      success: true,
      data: result.tasks,
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
  createTask,
  getTasks,
  getMyTasks,
  selfCompleteTask,
  deleteTask
};
