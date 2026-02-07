/**
 * @swagger
 * tags:
 *   - name: Task
 *     description: Task management endpoints
 *
 * components:
 *   schemas:
 *     Assignee:
 *       type: object
 *       properties:
 *         user:
 *           type: string
 *           description: User id
 *           example: "60f7a3c2b4e9f12a34567890"
 *         status:
 *           type: string
 *           enum: [pending, in_progress, done]
 *           example: "pending"
 *
 *     Task:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "60f7b4d5e1a2b34c567890ab"
 *         title:
 *           type: string
 *           example: "Implement login"
 *         description:
 *           type: string
 *           example: "Add JWT auth and login endpoint"
 *         projectId:
 *           type: string
 *           example: "60f7a3c2b4e9f12a34567890"
 *         assignees:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Assignee'
 *         createdBy:
 *           type: string
 *           example: "60f7a3c2b4e9f12a34567890"
 *         priority:
 *           type: string
 *           enum: [low, medium, high]
 *           example: "medium"
 *         status:
 *           type: string
 *           enum: [todo, in_progress, done]
 *           example: "in_progress"
 *         dueDate:
 *           type: string
 *           format: date-time
 *           example: "2026-02-28T12:00:00.000Z"
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
 *     TaskListResponse:
 *       type: object
 *       properties:
 *         tasks:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Task'
 *         total:
 *           type: integer
 *           example: 42
 *         page:
 *           type: integer
 *           example: 1
 *         limit:
 *           type: integer
 *           example: 10
 */

/**
 * @swagger
 * /projects/{projectId}/tasks:
 *   post:
 *     summary: Create a task inside a project (owner/admin)
 *     tags: [Task]
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
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Implement login"
 *               description:
 *                 type: string
 *               assignees:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of user ids (must be project members)
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Task created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Validation error or invalid assignees
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Not authorized (only owner/admin can create)
 *       404:
 *         description: Project not found
 *
 *   get:
 *     summary: List tasks for a project (owner/admin/member)
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           description: Filter by task status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           description: Search in title
 *     responses:
 *       200:
 *         description: Paginated tasks
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskListResponse'
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Project not found
 */

/**
 * @swagger
 * /tasks/{taskId}:
 *   get:
 *     summary: Get a task by id (project members)
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Not authorized to view this task
 *       404:
 *         description: Task not found
 *
 *   patch:
 *     summary: Update allowed fields of a task (owner/admin/creator)
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *                 enum: [todo, in_progress, done]
 *     responses:
 *       200:
 *         description: Updated task
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Task not found
 *
 *   delete:
 *     summary: Soft-delete a task
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Task deleted"
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Task not found
 */

/**
 * @swagger
 * /tasks/{taskId}/assignees:
 *   post:
 *     summary: Add assignees to a task (owner/admin)
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - assignees
 *             properties:
 *               assignees:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of user ids to add (must be project members)
 *     responses:
 *       200:
 *         description: Task updated with new assignees
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Validation error or invalid assignees
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Task not found
 *
 * /tasks/{taskId}/assignees/{assigneeUserId}:
 *   delete:
 *     summary: Remove an assignee from a task (owner/admin/creator)
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: assigneeUserId
 *         required: true
 *         schema:
 *           type: string
 *         description: user id of assignee to remove
 *     responses:
 *       200:
 *         description: Assignee removed and task returned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Cannot remove last assignee or invalid request
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Task or assignee not found
 */

/**
 * @swagger
 * /tasks/{taskId}/self-complete:
 *   post:
 *     summary: Mark authenticated user's assignee entry as done (self-complete)
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Assignee marked done; task status recalculated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: User not assigned or invalid request
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Task not found
 */

/**
 * @swagger
 * /tasks/my:
 *   get:
 *     summary: Get tasks assigned to authenticated user (paginated)
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Paginated tasks assigned to user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskListResponse'
 *       401:
 *         description: Authentication required
 */

/**
 * @swagger
 * /tasks/created-by-me:
 *   get:
 *     summary: Get tasks created by authenticated user (paginated)
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Paginated tasks created by user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskListResponse'
 *       401:
 *         description: Authentication required
 */