const express = require("express");
const router = express.Router();
const { authController } = require("../controllers");
const { authValidator } = require("../validators");
const { validate } = require("../middleware");

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 */

router.post(
  "/register",
  validate(authValidator.registerSchema),
  authController.register
);

module.exports = router;

