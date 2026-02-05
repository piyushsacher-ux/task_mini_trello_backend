const express = require("express");
const router = express.Router();

const { projectController } = require("../controllers");
const { authMiddleware, validate } = require("../middleware");
const { projectValidator } = require("../validators");

router.post(
  "/",
  authMiddleware,
  validate(projectValidator.createProjectSchema),
  projectController.createProject,
);

router.get(
  "/",
  authMiddleware,
  validate(projectValidator.getProjectsSchema, "query"),
  projectController.getMyProjects,
);

router.put(
  "/:projectId",
  authMiddleware,
  validate(projectValidator.projectIdParamSchema, "params"),
  validate(projectValidator.updateProjectSchema),
  projectController.updateProject
);


router.delete(
  "/:projectId",
  authMiddleware,
  validate(projectValidator.deleteProjectSchema, "params"),
  projectController.deleteProject,
);

module.exports = router;
