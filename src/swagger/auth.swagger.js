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
 *         description: OTP sent to user's email
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
 *        
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /auth/verify-otp:
 *   post:
 *     summary: Verify OTP for registration or password reset
 *     description: Verifies a 6-digit OTP sent to the user's email and validates it before updating user status.
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
 *               - type
 *             properties:
 *               otp:
 *                 type: string
 *                 description: numeric OTP sent via email
 *                 example: "123456"
 *               type:
 *                 type: string
 *                 description: purpose of OTP (register | forgot)
 *                 enum: [register, forgot]
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
 *       404:
 *         description: OTP not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     description: |
 *           Authenticates a verified user using email and password.
 *           Returns a JWT token valid for 1 day.
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
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *                   description: JWT to be used as Bearer token
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
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
 *     description: |
 *           Generates a 6-digit OTP for password reset.
 *           - Deletes previous forgot OTPs
 *           - Stores hashed OTP in database
 *           - Sends OTP to user's email
 *           - Returns short-lived verification token (5 minutes)
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
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     verificationToken:
 *                       type: string
 *                       description: Short-lived token used to verify OTP
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Validation error
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password using verification token (sent during forgot-password flow)
 *     description: |
 *           Resets user password after successful OTP verification.
 *           - Requires short-lived verification token (from forgot-password flow)
 *           - Requires OTP to be verified first
 *           - Hashes new password before storing
 *           - Clears forgotOtpVerified flag after reset
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
 *                 minLength: 6
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
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Password reset successful"
 *       400:
 *         description: Validation error or invalid/expired token
 *       401:
 *         description: Missing or invalid verification token
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current logged-in user
 *     description: |
 *       Returns the profile information of the currently authenticated user.
 *       Requires a valid Bearer access token.
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Current user retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 698374fb238fcf93ddba647b
 *                     name:
 *                       type: string
 *                       example: Ustaad1
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: ustaad1@test.com
 *                     isDeleted:
 *                       type: boolean
 *                       example: false
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2026-02-04T16:34:03.049Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2026-02-06T10:36:29.919Z
 *       401:
 *         description: Authentication required or invalid token
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user (blacklist current JWT)
 *     description: |
 *         Logs out the authenticated user by blacklisting the current JWT token.
 *         The token remains invalid until its natural expiration time.
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
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Logged out successfully"
 *       401:
 *         description: Missing or invalid token
 *       500:
 *         description: Internal server error
 */