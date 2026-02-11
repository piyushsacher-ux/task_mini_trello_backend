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
 *     TaskListMeta:
 *       type: object
 *       properties:
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
 *     summary: Create a task inside a project
 *     description: |
 *       Creates a new task within a project.
 *       - Only the project owner or admins can create tasks
 *       - Assignees must be valid project members
 *       - Assignees must be verified users
 *       - Due date must be in the future
 *     tags:
 *       - Task
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
 *               - title
 *               - assignees
 *               - dueDate
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 200
 *                 example: Implement login functionality
 *               description:
 *                 type: string
 *                 example: Create JWT-based login system
 *               assignees:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: string
 *                 description: Array of user IDs (must be project members)
 *                 example:
 *                   - 60f7a3c2b4e9f12a34567891
 *               priority:
 *                 type: string
 *                 enum:
 *                   - low
 *                   - medium
 *                   - high
 *                 example: medium
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-03-01T10:00:00Z
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 *       400:
 *         description: Validation error or invalid assignees
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Not authorized (only owner/admin can create)
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /projects/{projectId}/tasks:
 *   get:
 *     summary: Get tasks for a project
 *     description: |
 *       Returns paginated tasks within a project.
 *       Only owner, admins, or members can access.
 *       Supports filtering, searching, date range filtering, and sorting.
 *     tags:
 *       - Task
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *           example: 60f7a3c2b4e9f12a34567890
 *         description: Project identifier
 *
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number (default 1)
 *
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Number of tasks per page (max 50)
 *
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum:
 *             - todo
 *             - in_progress
 *             - done
 *         description: Filter by task status
 *
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum:
 *             - low
 *             - medium
 *             - high
 *         description: Filter by task priority
 *
 *       - in: query
 *         name: assignedTo
 *         schema:
 *           type: string
 *         description: Filter tasks assigned to a specific user ID
 *
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search tasks by title (case-insensitive)
 *
 *       - in: query
 *         name: dueBefore
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter tasks due before a specific date
 *
 *       - in: query
 *         name: dueAfter
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter tasks due after a specific date
 *
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum:
 *             - dueDate
 *             - priority
 *             - createdAt
 *         description: Field to sort by (default createdAt)
 *
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum:
 *             - asc
 *             - desc
 *         description: Sort order (default desc)
 *
 *     responses:
 *       200:
 *         description: Paginated list of tasks
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
 *                     $ref: '#/components/schemas/Task'
 *                 meta:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 42
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Not authorized to access this project
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /tasks/{taskId}:
 *   patch:
 *     summary: Update allowed fields of a task
 *     description: |
 *       Updates selected fields of a task.
 *       Allowed users:
 *       - Project owner
 *       - Project admins
 *       - Task creator
 *
 *       Only specific fields can be modified.
 *     tags:
 *       - Task
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *           example: 60f7b4d5e1a2b34c567890ab
 *         description: Unique task identifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             minProperties: 1
 *             properties:
 *               title:
 *                 type: string
 *                 example: Update login logic
 *               description:
 *                 type: string
 *                 example: Modify authentication flow
 *               priority:
 *                 type: string
 *                 enum:
 *                   - low
 *                   - medium
 *                   - high
 *                 example: high
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-03-05T10:00:00Z
 *               status:
 *                 type: string
 *                 enum:
 *                   - todo
 *                   - in_progress
 *                   - done
 *                 example: in_progress
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Not authorized to update task
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */

 
/**
 * @swagger
 * /tasks/{taskId}:
 *   delete:
 *     summary: Soft-delete a task
 *     description: |
 *       Soft deletes a task by setting `isDeleted = true`.
 *       Allowed users:
 *       - Project owner
 *       - Project admins
 *       - Task creator
 *     tags:
 *       - Task
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *           example: 60f7b4d5e1a2b34c567890ab
 *         description: Unique task identifier
 *     responses:
 *       200:
 *         description: Task deleted successfully
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
 *                   example: Task deleted
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Not authorized to delete task
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /tasks/{taskId}/assignees:
 *   post:
 *     summary: Add assignees to a task
 *     description: |
 *       Adds one or more users as assignees to a task.
 *       Allowed users:
 *       - Project owner
 *       - Project admins
 *       - Task creator
 *
 *       Rules:
 *       - Assignees must be part of the project
 *       - Cannot assign yourself
 *       - Duplicate assignees are ignored
 *       - If task was completed, status is reset to in_progress
 *     tags:
 *       - Task
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *           example: 60f7b4d5e1a2b34c567890ab
 *         description: Unique task identifier
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
 *                 minItems: 1
 *                 items:
 *                   type: string
 *                 description: Array of user IDs to assign (must belong to project)
 *                 example:
 *                   - 60f7a3c2b4e9f12a34567891
 *                   - 60f7a3c2b4e9f12a34567892
 *     responses:
 *       200:
 *         description: Assignees added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 *       400:
 *         description: Validation error or invalid assignees
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Not authorized to modify task
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /tasks/{taskId}/assignees/{userId}:
 *   delete:
 *     summary: Remove an assignee from a task
 *     description: |
 *       Removes a specific user from the task's assignees.
 *       Allowed users:
 *       - Project owner
 *       - Project admins
 *       - Task creator
 *
 *       Rules:
 *       - Cannot remove the last remaining assignee
 *       - Task status is recalculated after removal
 *     tags:
 *       - Task
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *           example: 60f7b4d5e1a2b34c567890ab
 *         description: Unique task identifier
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           example: 60f7a3c2b4e9f12a34567891
 *         description: User ID of assignee to remove
 *     responses:
 *       200:
 *         description: Assignee removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 *       400:
 *         description: Cannot remove last assignee or invalid request
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Not authorized to modify task
 *       404:
 *         description: Task or assignee not found
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /tasks/{taskId}/self-complete:
 *   put:
 *     summary: Mark task as completed (self-complete)
 *     description: |
 *       Allows an assignee to mark their own assignment as done.
 *       - If the authenticated user is an assignee → only their status is updated
 *       - If the user is project owner or admin → all assignees are marked done
 *       - Task status is automatically recalculated
 *     tags:
 *       - Task
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *           example: 60f7b4d5e1a2b34c567890ab
 *         description: Unique task identifier
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 *       400:
 *         description: User not assigned or task already completed
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /tasks/my:
 *   get:
 *     summary: Get tasks assigned to authenticated user
 *     description: |
 *       Returns paginated tasks where the authenticated user is an assignee.
 *       Supports filtering, searching, and sorting.
 *     tags:
 *       - Task
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number (default 1)
 *
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Number of tasks per page (max 50)
 *
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum:
 *             - todo
 *             - in_progress
 *             - done
 *         description: Filter by task status
 *
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum:
 *             - low
 *             - medium
 *             - high
 *         description: Filter by task priority
 *
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search tasks by title
 *
 *       - in: query
 *         name: dueBefore
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter tasks due before a specific date
 *
 *       - in: query
 *         name: dueAfter
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter tasks due after a specific date
 *
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum:
 *             - dueDate
 *             - priority
 *             - createdAt
 *         description: Field to sort by
 *
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum:
 *             - asc
 *             - desc
 *         description: Sort order
 *
 *     responses:
 *       200:
 *         description: Paginated list of tasks assigned to user
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
 *                     $ref: '#/components/schemas/Task'
 *                 meta:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 42
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
 * /tasks/created:
 *   get:
 *     summary: Get tasks created by authenticated user
 *     description: |
 *       Returns paginated tasks created by the authenticated user.
 *       Supports filtering, searching, and sorting.
 *     tags:
 *       - Task
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number (default 1)
 *
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Number of tasks per page (max 50)
 *
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum:
 *             - todo
 *             - in_progress
 *             - done
 *         description: Filter by task status
 *
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum:
 *             - low
 *             - medium
 *             - high
 *         description: Filter by task priority
 *
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search tasks by title
 *
 *       - in: query
 *         name: dueBefore
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter tasks due before a specific date
 *
 *       - in: query
 *         name: dueAfter
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter tasks due after a specific date
 *
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum:
 *             - dueDate
 *             - priority
 *             - createdAt
 *         description: Field to sort by
 *
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum:
 *             - asc
 *             - desc
 *         description: Sort order
 *
 *     responses:
 *       200:
 *         description: Paginated list of tasks created by user
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
 *                     $ref: '#/components/schemas/Task'
 *                 meta:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 25
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
