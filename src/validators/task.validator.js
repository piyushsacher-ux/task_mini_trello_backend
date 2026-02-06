const Joi = require("joi");

const createTaskSchema = Joi.object({
  title: Joi.string().min(2).max(200).required(),

  description: Joi.string().allow("").optional(),

  assignees: Joi.array()
    .items(Joi.string().hex().length(24))
    .min(1)
    .required()
});


const getTasksSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10),
  status: Joi.string().valid("todo", "in_progress", "done").optional(),
  assignedTo: Joi.string().hex().length(24).optional(),
  search: Joi.string().allow("").optional()
});

const taskIdParamSchema = Joi.object({
  taskId: Joi.string().hex().length(24).required()
});

const addAssigneesSchema = Joi.object({
  assignees: Joi.array()
    .items(Joi.string().hex().length(24))
    .min(1)
    .required()
});

const removeAssigneeSchema = Joi.object({
  taskId: Joi.string().hex().length(24).required(),
  userId: Joi.string().hex().length(24).required()
});

const updateTaskSchema = Joi.object({
  title: Joi.string().trim().optional(),
  description: Joi.string().trim().optional(),
  priority: Joi.string().valid("low", "medium", "high").optional(),
  dueDate: Joi.date().optional(),
  status: Joi.string().valid("todo", "in_progress", "done").optional()
}).min(1);

module.exports = {
  createTaskSchema,
  getTasksSchema,
  taskIdParamSchema,
  addAssigneesSchema,
  removeAssigneeSchema,
  updateTaskSchema
};
