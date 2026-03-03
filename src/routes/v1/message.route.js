const express = require("express");
const router = express.Router();
const {messageController} = require("../../controllers");

// GET project messages
router.get("/:projectId", messageController.getProjectMessages);

module.exports = router;