const express = require("express");
const router = express.Router();
const { userController } = require("../../controllers");
const { authMiddleware, validate } = require("../../middleware");
const { searchUsersSchema } = require("../../validators/auth.validator");

router.get("/search", authMiddleware, validate(searchUsersSchema), userController.searchUsers);

module.exports = router;
