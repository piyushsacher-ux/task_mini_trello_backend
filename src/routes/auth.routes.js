const express = require("express");
const router = express.Router();
const { authController } = require("../controllers");
const { authValidator } = require("../validators");
const { validate } = require("../middleware");
const { verifyToken } = require("../middleware");


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
/**
 * @swagger
 * /auth/verify-otp:
 *   post:
 *     summary: Verify registration OTP
 *     tags: [Auth]
 */


router.post(
  "/verify-otp",
  verifyToken,
  validate(authValidator.verifyOtpSchema),
  authController.verifyOtp
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 */
router.post(
  "/login",
  validate(authValidator.loginSchema),
  authController.login
);

router.post("/forgot-password",
 validate(authValidator.forgotSchema),
 authController.forgotPassword
);

router.post("/reset-password",
 validate(authValidator.resetSchema),
 authController.resetPassword
);


module.exports = router;

