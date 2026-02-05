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

const projectIdParamSchema = Joi.object({
  projectId: Joi.string().hex().length(24).required()
});


const updateProjectSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  description: Joi.string().allow("").optional()
});

const deleteProjectSchema = Joi.object({
  projectId: Joi.string().hex().length(24).required()
});


const addMembersSchema = Joi.object({
  members: Joi.array()
    .items(Joi.string().hex().length(24))
    .min(1)
    .required()
});


const removeMemberParamSchema = Joi.object({
  projectId: Joi.string().hex().length(24).required(),
  userId: Joi.string().hex().length(24).required()
});


const addAdminsSchema = Joi.object({
  admins: Joi.array()
    .items(Joi.string().hex().length(24))
    .min(1)
    .required()
});


module.exports = {
  createProjectSchema,
  getProjectsSchema,
  projectIdParamSchema,
  updateProjectSchema,
  deleteProjectSchema,
  addMembersSchema,
  removeMemberParamSchema,
  addAdminsSchema
};

