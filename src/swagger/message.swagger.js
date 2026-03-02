/**
 * @swagger
 * /api/v1/messages/{projectId}:
 *   get:
 *     summary: Get project messages
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Number of messages to fetch
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Pagination offset
 *     responses:
 *       200:
 *         description: List of messages
 *       500:
 *         description: Server error
 */