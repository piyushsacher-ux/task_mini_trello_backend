/**
 * @swagger
 * tags:
 *   - name: Project
 *     description: Project management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "60f7a3c2b4e9f12a34567890"
 *         name:
 *           type: string
 *           example: "Website Redesign"
 *         nameLower:
 *           type: string
 *           example: "website redesign"
 *         description:
 *           type: string
 *           example: "Redesign company website"
 *         owner:
 *           type: string
 *           example: "60f7a3c2b4e9f12a34567890"
 *         admins:
 *           type: array
 *           items:
 *             type: string
 *           example: ["60f7a3...","60f7a4..."]
 *         members:
 *           type: array
 *           items:
 *             type: string
 *           example: ["60f7a5...","60f7a6..."]
 *         isDeleted:
 *           type: boolean
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     ProjectListResponse:
 *       type: object
 *       properties:
 *         projects:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Project'
 *         total:
 *           type: integer
 *           example: 12
 *         page:
 *           type: integer
 *           example: 1
 *         limit:
 *           type: integer
 *           example: 10
 */

/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Create a new project
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Website Redesign"
 *               description:
 *                 type: string
 *                 example: "Redesign company website"
 *               admins:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of user ids to set as admins (owner will be excluded automatically)
 *               members:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of user ids to add as members
 *     responses:
 *       201:
 *         description: Project created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       400:
 *         description: Validation error (missing name or invalid users)
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Not authorized
 */

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Get projects for the current user (owner/admin/member)
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number (default 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Page size (default 10)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search projects by name
 *     responses:
 *       200:
 *         description: Paginated list of projects
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectListResponse'
 *       401:
 *         description: Authentication required
 */

/**
 * @swagger
 * /projects/{projectId}:
 *   get:
 *     summary: Get a project by id (owner/admin/member)
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: Project id
 *     responses:
 *       200:
 *         description: Project object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Not authorized to view this project
 *       404:
 *         description: Project not found
 */

/**
 * @swagger
 * /projects/{projectId}:
 *   put:
 *     summary: Update project (owner or admins may be allowed depending on rules)
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: Project id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated project
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Project not found
 */

/**
 * @swagger
 * /projects/{projectId}:
 *   delete:
 *     summary: Delete (soft) a project — only owner
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: Project id
 *     responses:
 *       200:
 *         description: Project deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Project deleted"
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Only owner can delete project
 *       404:
 *         description: Project not found
 */

/**
 * @swagger
 * /projects/{projectId}/members:
 *   post:
 *     summary: Add members to a project (owner/admin)
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: Project id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - members
 *             properties:
 *               members:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of user ids to add as members
 *     responses:
 *       200:
 *         description: Project updated with new members
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       400:
 *         description: Validation error or one or more users invalid
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Not authorized to add members
 *       404:
 *         description: Project not found
 *
 * /projects/{projectId}/members/{memberId}:
 *   delete:
 *     summary: Remove a member from a project
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: Project id
 *       - in: path
 *         name: memberId
 *         required: true
 *         schema:
 *           type: string
 *         description: Member user id to remove
 *     responses:
 *       200:
 *         description: Member removed and project returned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       400:
 *         description: Cannot remove last member or owner
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Not authorized to remove member
 *       404:
 *         description: Project or member not found
 */

/**
 * @swagger
 * /projects/{projectId}/admins:
 *   post:
 *     summary: Add admins to a project (only owner)
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: Project id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - admins
 *             properties:
 *               admins:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of user ids to set as admins
 *     responses:
 *       200:
 *         description: Project updated with new admins
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       400:
 *         description: Validation error or one or more users invalid
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Only owner can add admins
 *       404:
 *         description: Project not found
 *
 * /projects/{projectId}/admins/{adminId}:
 *   delete:
 *     summary: Remove an admin (only owner)
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: Project id
 *       - in: path
 *         name: adminId
 *         required: true
 *         schema:
 *           type: string
 *         description: Admin user id to remove
 *     responses:
 *       200:
 *         description: Admin removed and project returned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       400:
 *         description: Cannot remove owner or last admin if business rule prevents it
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Only owner can remove admins
 *       404:
 *         description: Project or admin not found
 */
