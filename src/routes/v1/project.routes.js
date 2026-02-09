const express = require("express");
const router = express.Router();

const { projectController } = require("../../controllers");
const { authMiddleware, validate } = require("../../middleware");
const { projectValidator } = require("../../validators");

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

router.post(
  "/:projectId/members",
  authMiddleware,
  validate(projectValidator.projectIdParamSchema, "params"),
  validate(projectValidator.addMembersSchema),
  projectController.addMembers
);

router.delete(
  "/:projectId/members/:userId",
  authMiddleware,
  validate(projectValidator.removeMemberParamSchema,"params"),
  projectController.removeMember
);


router.post(
  "/:projectId/admins",
  authMiddleware,
  validate(projectValidator.projectIdParamSchema, "params"),
  validate(projectValidator.addAdminsSchema),
  projectController.addAdmins
);

router.delete(
  "/:projectId/admins/:userId",
  authMiddleware,
  validate(projectValidator.removeMemberParamSchema, "params"),
  projectController.removeAdmin
);

router.get(
  "/:projectId",
  authMiddleware,
  validate(projectValidator.projectIdParamSchema, "params"),
  projectController.getProjectById
);


module.exports = router;
