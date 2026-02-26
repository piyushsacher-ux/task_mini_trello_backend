const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const verifyOtpSchema = Joi.object({
  otp: Joi.string().length(6).required(),
  type: Joi.string().valid("register", "forgot").required()
});


const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const forgotSchema = Joi.object({
  email: Joi.string().email().required()
});

const resetSchema = Joi.object({
  userId: Joi.string().required(),
  otp: Joi.string().length(6).required(),
  newPassword: Joi.string().min(6).required()
});

const searchUsersSchema = Joi.object({
  q: Joi.string().trim().min(1).optional(),

  page: Joi.number()
    .integer()
    .min(1)
    .default(1),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(50)
    .default(10)
});

const resetPasswordSchema = Joi.object({
  password: Joi.string().min(6).required()
});


const updateProfileSchema = Joi.object({
  name: Joi.string().trim().min(2).max(25).optional(),
}).min(1); 

module.exports = {
  registerSchema,
  verifyOtpSchema,
  loginSchema,
  forgotSchema,
  resetSchema,
  searchUsersSchema,
  resetPasswordSchema,
  updateProfileSchema
};
