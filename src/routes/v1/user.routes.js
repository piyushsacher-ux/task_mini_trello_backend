const express = require("express");
const router = express.Router();
const { userController } = require("../../controllers");
const { authMiddleware, validate } = require("../../middleware");
const { searchUsersSchema } = require("../../validators/auth.validator");

router.get("/search", authMiddleware, validate(searchUsersSchema,"query"), userController.searchUsers);
router.get("/stats", authMiddleware, userController.getUserStats);

module.exports = router;

