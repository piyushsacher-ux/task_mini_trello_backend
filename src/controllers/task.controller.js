const { taskService } = require("../services");
const { StatusCodes } = require("http-status-codes");


const createTask = async (req, res, next) => {
  try {
    const task = await taskService.createTask(
      req.params.projectId,
      req.user._id,
      req.body
    );

    res.status(StatusCodes.CREATED).json({
      success: true,
      data: task
    });
  } catch (err) {
    next(err);
  }
};

const getTasks = async (req, res, next) => {
  try {
    const result = await taskService.getTasks(
      req.params.projectId,
      req.user._id,
      req.query
    );

    res.status(StatusCodes.OK).json({
      success: true,
      data: result.tasks,
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

const selfCompleteTask = async (req, res, next) => {
  try {
    const task = await taskService.selfCompleteTask(
      req.params.taskId,
      req.user._id
    );

    res.status(StatusCodes.OK).json({
      success: true,
      data: task
    });
  } catch (err) {
    next(err);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    await taskService.deleteTask(
      req.params.taskId,
      req.user._id
    );

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Task deleted"
    });
  } catch (err) {
    next(err);
  }
};

const getMyTasks = async (req, res, next) => {
  try {
    const result = await taskService.getMyTasks(
      req.user._id,
      req.query
    );

    res.status(StatusCodes.OK).json({
      success: true,
      data: result.tasks,
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

const getTasksCreatedByMe = async (req, res, next) => {
  try {
    const result = await taskService.getTasksCreatedByMe(
      req.user._id,
      req.query
    );

    res.status(StatusCodes.OK).json({
      success: true,
      data: result.tasks,
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

const addAssignees = async (req, res, next) => {
  try {
    const task = await taskService.addAssigneesToTask(
      req.params.taskId,
      req.user._id,
      req.body.assignees
    );

    res.status(StatusCodes.OK).json({
      success: true,
      data: task
    });
  } catch (err) {
    next(err);
  }
};

const removeAssignee = async (req, res, next) => {
  try {
    const task = await taskService.removeAssigneeFromTask(
      req.params.taskId,
      req.user._id,
      req.params.userId
    );

    res.status(StatusCodes.OK).json({
      success: true,
      data: task
    });
  } catch (err) {
    next(err);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await taskService.updateTask(
      req.params.taskId,
      req.user._id,
      req.body
    );

    res.status(StatusCodes.OK).json({
      success: true,
      data: task
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createTask,
  getTasks,
  getMyTasks,
  selfCompleteTask,
  deleteTask,
  getTasksCreatedByMe,
  addAssignees,
  removeAssignee,
  updateTask
};
