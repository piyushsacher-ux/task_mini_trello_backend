const express = require("express");
const router = express.Router();

const { taskController } = require("../../controllers");
const { authMiddleware, validate } = require("../../middleware");
const { taskValidator, projectValidator } = require("../../validators");

router.post(
  "/projects/:projectId/tasks",
  authMiddleware,
  validate(projectValidator.projectIdParamSchema, "params"),
  validate(taskValidator.createTaskSchema),
  taskController.createTask
);

router.get(
  "/projects/:projectId/tasks",
  authMiddleware,
  validate(projectValidator.projectIdParamSchema, "params"),
  validate(taskValidator.getTasksSchema, "query"),
  taskController.getTasks
);

router.get(
  "/projects/:projectId/tasks/:taskId",
  authMiddleware,
  validate(taskValidator.getTaskByIdParamSchema, "params"),
  taskController.getTaskById
);

router.put(
  "/tasks/:taskId/self-complete",
  authMiddleware,
  validate(taskValidator.taskIdParamSchema, "params"),
  taskController.selfCompleteTask
);

router.delete(
  "/tasks/:taskId",
  authMiddleware,
  validate(taskValidator.taskIdParamSchema, "params"),
  taskController.deleteTask
);

router.get(
  "/tasks/my",
  authMiddleware,
  validate(taskValidator.getTasksSchema, "query"),
  taskController.getMyTasks
);

router.get(
  "/tasks/created",
  authMiddleware,
  validate(taskValidator.getTasksSchema, "query"),
  taskController.getTasksCreatedByMe
);

router.post(
  "/tasks/:taskId/assignees",
  authMiddleware,
  validate(taskValidator.taskIdParamSchema, "params"),
  validate(taskValidator.addAssigneesSchema),
  taskController.addAssignees
);

router.delete(
  "/tasks/:taskId/assignees/:userId",
  authMiddleware,
  validate(taskValidator.removeAssigneeSchema, "params"),
  taskController.removeAssignee
);

router.patch(
  "/tasks/:taskId",
  authMiddleware,
  validate(taskValidator.taskIdParamSchema, "params"),
  validate(taskValidator.updateTaskSchema),
  taskController.updateTask
);


module.exports = router;
