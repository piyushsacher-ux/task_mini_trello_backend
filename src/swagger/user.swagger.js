/**
 * @swagger
 * /users/search:
 *   get:
 *     summary: Search users by name or email
 *     description: |
 *       Searches verified users by name or email (case-insensitive).
 *       - Excludes the currently authenticated user
 *       - Only returns verified and non-deleted users
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: false
 *         schema:
 *           type: string
 *           example: jane
 *         description: Search query (matches name or email)
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number (default 1)
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Number of users per page (max 50)
 *     responses:
 *       200:
 *         description: List of matched users
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
 *                         example: 60f7a3c2b4e9f12a34567890
 *                       name:
 *                         type: string
 *                         example: Jane Doe
 *                       email:
 *                         type: string
 *                         format: email
 *                         example: jane@example.com
 *       400:
 *         description: Validation error (invalid query parameters)
 *       401:
 *         description: Missing or invalid authentication token
 *       500:
 *         description: Internal server error
 *
 * /users/stats:
 *   get:
 *     summary: Get statistics for the current user
 *     description: |
 *       Returns project and task counts for the authenticated user.
 *       - **totalProjects**: Projects where user is owner, admin, or member.
 *       - **totalTasks**: Total tasks assigned to the user.
 *       - **todo**: User's status is 'todo' and overall task is 'todo'.
 *       - **inProgress**: User's status is 'todo' but overall task is 'in_progress'.
 *       - **done**: User's status is 'done'.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User statistics retrieved successfully
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
 *                     totalProjects:
 *                       type: integer
 *                       example: 5
 *                     totalTasks:
 *                       type: integer
 *                       example: 10
 *                     todo:
 *                       type: integer
 *                       example: 3
 *                     inProgress:
 *                       type: integer
 *                       example: 2
 *                     done:
 *                       type: integer
 *                       example: 5
 *       401:
 *         description: Missing or invalid authentication token
 *       500:
 *         description: Internal server error
 */

