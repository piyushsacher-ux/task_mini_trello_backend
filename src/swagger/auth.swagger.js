/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication and user account endpoints
 */

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
 *                 example: "Jane Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "jane@example.com"
 *               password:
 *                 type: string
 *                 example: "S3cureP@ssw0rd"
 *     responses:
 *       201:
 *         description: User registered successfully (verification token returned)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 verificationToken:
 *                   type: string
 *                   description: short-lived token used to verify OTP
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Validation error or user already exists
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /auth/verify-otp:
 *   post:
 *     summary: Verify OTP for registration or password reset
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - otp
 *             properties:
 *               otp:
 *                 type: string
 *                 description: numeric OTP sent via email
 *                 example: "123456"
 *               type:
 *                 type: string
 *                 description: purpose of OTP (register | forgot)
 *                 example: "register"
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "OTP verified"
 *       400:
 *         description: Invalid OTP or expired
 *       401:
 *         description: Missing or invalid verification token
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "jane@example.com"
 *               password:
 *                 type: string
 *                 example: "S3cureP@ssw0rd"
 *     responses:
 *       200:
 *         description: Login success - returns auth token and user info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT to be used as Bearer token
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60f7a3c2b4e9f12a34567890"
 *                     name:
 *                       type: string
 *                       example: "Jane Doe"
 *                     email:
 *                       type: string
 *                       example: "jane@example.com"
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid credentials or user not verified
 */

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Send forgot-password OTP to user's email (if account exists)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "jane@example.com"
 *     responses:
 *       200:
 *         description: OTP sent (response does not reveal whether account exists)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "If an account exists, an OTP has been sent to the email"
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password using verification token (sent during forgot-password flow)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 description: New password
 *                 example: "NewS3cureP@ss"
 *     responses:
 *       200:
 *         description: Password reset successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password has been reset"
 *       400:
 *         description: Validation error or invalid/expired token
 *       401:
 *         description: Missing or invalid verification token
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user (blacklist current token)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Logged out"
 *       401:
 *         description: Missing or invalid token
 */