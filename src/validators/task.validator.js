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
  search: Joi.string().allow("").optional()
});

const taskIdParamSchema = Joi.object({
  taskId: Joi.string().hex().length(24).required()
});



module.exports = {
  createTaskSchema,
  getTasksSchema,
  taskIdParamSchema
};
