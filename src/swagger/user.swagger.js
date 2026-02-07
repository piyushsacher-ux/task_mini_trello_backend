
/**
 * @swagger
 * /users/search:
 *   get:
 *     summary: Search users by name or email
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: false
 *         schema:
 *           type: string
 *         description: Search query string (matches name or email, case-insensitive). If omitted returns no users or a controlled result depending on implementation.
 *     responses:
 *       200:
 *         description: List of matched users (excluding the current authenticated user)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "60f7a3c2b4e9f12a34567890"
 *                       name:
 *                         type: string
 *                         example: "Jane Doe"
 *                       email:
 *                         type: string
 *                         format: email
 *                         example: "jane@example.com"
 *       400:
 *         description: Validation error (e.g., invalid query parameter)
 *       401:
 *         description: Missing or invalid authentication token
 *       500:
 */