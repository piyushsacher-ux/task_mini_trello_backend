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
 *     description: |
 *           Creates a new project owned by the authenticated user.
 *           - Project name must be unique per owner
 *           - Owner is automatically excluded from admins/members arrays
 *           - Admins are automatically included as members
 *           - All provided users must exist and be verified
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
 *                 description: Array of user ids to set as admins
 *               members:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of user ids to add as members
 *     responses:
 *       201:
 *         description: Project created successfully
 *         content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                    example: true
 *                  data:
 *                    $ref: '#/components/schemas/Project'     
 *       400:
 *         description: Validation error (missing name or invalid users) or duplicate project name
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Not authorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Get projects for the current user
 *     description: |
 *       Returns paginated projects where the authenticated user is:
 *       - Owner
 *       - Admin
 *       - Member
 *       Supports pagination and name-based search.
 *     tags:
 *       - Project
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number (default is 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Number of projects per page (default is 10)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           example: website
 *         description: Search projects by name
 *     responses:
 *       200:
 *         description: Paginated list of projects
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
 *                     $ref: '#/components/schemas/Project'
 *                 meta:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 12
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /projects/{projectId}:
 *   get:
 *     summary: Get a project by ID
 *     description: |
 *       Returns full project details.
 *       Only the project owner, admins, or members can access it.
 *       Owner, admins, and members are populated with name and email.
 *     tags:
 *       - Project
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *           example: 60f7a3c2b4e9f12a34567890
 *         description: Unique project identifier
 *     responses:
 *       200:
 *         description: Project retrieved successfully
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
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     owner:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         email:
 *                           type: string
 *                     admins:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           email:
 *                             type: string
 *                     members:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           email:
 *                             type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Not authorized to view this project
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /projects/{projectId}:
 *   put:
 *     summary: Update project
 *     description: |
 *       Updates project details.
 *       Only the project owner or assigned admins can update the project.
 *       - Project name must remain unique per owner
 *       - Name is normalized and trimmed before saving
 *     tags:
 *       - Project
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *           example: 60f7a3c2b4e9f12a34567890
 *         description: Unique project identifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 30
 *                 example: Updated Website Redesign
 *               description:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 example: Updated project description
 *     responses:
 *       200:
 *         description: Project updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Project'
 *       400:
 *         description: Validation error or duplicate project name
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /projects/{projectId}:
 *   delete:
 *     summary: Soft delete a project (owner only)
 *     description: |
 *       Soft deletes a project by setting `isDeleted = true`.
 *       - Only the project owner can delete the project
 *       - All tasks under the project are also soft deleted
 *     tags:
 *       - Project
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *           example: 60f7a3c2b4e9f12a34567890
 *         description: Unique project identifier
 *     responses:
 *       200:
 *         description: Project deleted successfully
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
 *                   example: Project deleted successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Only project owner can delete
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /projects/{projectId}/members:
 *   post:
 *     summary: Add members to a project
 *     description: |
 *       Adds one or more members to a project.
 *       Only the project owner or admins can add members.
 *       - Duplicate member IDs are ignored
 *       - All users must exist and be verified
 *     tags:
 *       - Project
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *           example: 60f7a3c2b4e9f12a34567890
 *         description: Unique project identifier
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
 *                 minItems: 1
 *                 items:
 *                   type: string
 *                 description: Array of user IDs to add as members
 *                 example:
 *                   - 60f7a3c2b4e9f12a34567891
 *                   - 60f7a3c2b4e9f12a34567892
 *     responses:
 *       200:
 *         description: Members added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Project'
 *       400:
 *         description: Validation error or one or more users invalid
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Not authorized to add members
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /projects/{projectId}/members/{userId}:
 *   delete:
 *     summary: Remove a member from a project
 *     description: |
 *       Removes a member (and admin role if applicable) from a project.
 *       Only the project owner or admins can remove members.
 *       The project owner cannot be removed.
 *     tags:
 *       - Project
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *           example: 60f7a3c2b4e9f12a34567890
 *         description: Unique project identifier
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           example: 60f7a3c2b4e9f12a34567891
 *         description: User ID of member to remove
 *     responses:
 *       200:
 *         description: Member removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Project'
 *       400:
 *         description: Invalid operation (e.g., trying to remove owner)
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Not authorized to remove member
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /projects/{projectId}/admins:
 *   post:
 *     summary: Add admins to a project (owner only)
 *     description: |
 *       Promotes one or more users to admin role.
 *       - Only the project owner can add admins
 *       - Users must exist and be verified
 *       - Admins are automatically added as project members
 *       - Duplicate IDs are ignored
 *     tags:
 *       - Project
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *           example: 60f7a3c2b4e9f12a34567890
 *         description: Unique project identifier
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
 *                 minItems: 1
 *                 items:
 *                   type: string
 *                 description: Array of user IDs to promote as admins
 *                 example:
 *                   - 60f7a3c2b4e9f12a34567891
 *                   - 60f7a3c2b4e9f12a34567892
 *     responses:
 *       200:
 *         description: Admins added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Project'
 *       400:
 *         description: Validation error or one or more users invalid
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Only project owner can add admins
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /projects/{projectId}/admins/{userId}:
 *   delete:
 *     summary: Remove an admin from a project (owner only)
 *     description: |
 *       Removes a user from the admin role.
 *       - Only the project owner can remove admins
 *       - The owner cannot remove themselves
 *       - The user remains a project member unless removed separately
 *     tags:
 *       - Project
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *           example: 60f7a3c2b4e9f12a34567890
 *         description: Unique project identifier
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           example: 60f7a3c2b4e9f12a34567891
 *         description: User ID to remove from admin role
 *     responses:
 *       200:
 *         description: Admin removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Project'
 *       400:
 *         description: Invalid operation (e.g., attempting to remove owner)
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Only project owner can remove admins
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */

