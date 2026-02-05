const Joi = require("joi");

const createProjectSchema = Joi.object({
  name: Joi.string().min(2).required(),

  description: Joi.string().allow("").optional(),

  admins: Joi.array()
    .items(Joi.string().hex().length(24))
    .optional(),

  members: Joi.array()
    .items(Joi.string().hex().length(24))
    .optional()
});

const getProjectsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),

  limit: Joi.number().integer().min(1).max(50).default(10),

  search: Joi.string().allow("").optional()
});


module.exports = {
  createProjectSchema,
  getProjectsSchema
};

