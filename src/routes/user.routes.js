const express = require("express");
const router = express.Router();
const { userController } = require("../controllers");
const { authMiddleware } = require("../middleware");

router.get("/search", authMiddleware, userController.searchUsers);

module.exports = router;
