const express = require("express");
const router = express.Router();

const { projectController } = require("../controllers");
const { authMiddleware, validate } = require("../middleware");
const { projectValidator } = require("../validators");

router.post(
  "/",
  authMiddleware,
  validate(projectValidator.createProjectSchema),
  projectController.createProject
);

router.get(
  "/",
  authMiddleware,
  validate(projectValidator.getProjectsSchema, "query"),
  projectController.getMyProjects
);


module.exports = router;
