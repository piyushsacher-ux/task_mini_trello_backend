const { StatusCodes } = require("http-status-codes");

module.exports = {
  PROJECT_NOT_FOUND: {
    message: "Project not found",
    statusCode: StatusCodes.NOT_FOUND
  },

  INVALID_TOKEN: {
    message: "Invalid token",
    statusCode: StatusCodes.UNAUTHORIZED
  },

  NO_TOKEN_PROVIDED: {
    message: "No token provided",
    statusCode: StatusCodes.UNAUTHORIZED
  },

  INVALID_CREDENTIALS: {
    message: "Invalid credentials",
    statusCode: StatusCodes.UNAUTHORIZED
  },

  TASK_NOT_FOUND: {
    message: "Task not found",
    statusCode: StatusCodes.NOT_FOUND
  },

  NOT_AUTHORIZED: {
    message: "Not authorized",
    statusCode: StatusCodes.FORBIDDEN
  },

  INVALID_ASSIGNEES: {
    message: "Invalid assignees",
    statusCode: StatusCodes.BAD_REQUEST
  },

  USER_ALREADY_EXISTS: {
    message: "User already exists",
    statusCode: StatusCodes.BAD_REQUEST
  },

  USER_NOT_FOUND: {
    message: "User not found",
    statusCode: StatusCodes.NOT_FOUND
  },

  OTP_EXPIRED: {
    message: "OTP expired",
    statusCode: StatusCodes.BAD_REQUEST
  },

  INVALID_OTP: {
    message: "Invalid OTP",
    statusCode: StatusCodes.BAD_REQUEST
  },

  USER_NOT_ASSIGNED: {
    message: "You are not assigned to this task",
    statusCode: StatusCodes.FORBIDDEN
  },

  VERIFY_ACCOUNT: {
    message: "Please verify your account",
    statusCode: StatusCodes.BAD_REQUEST
  },

  INTERNAL_ERROR: {
    message: "Internal server error",
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR
  },

  PROJECT_NAME_EXISTS: {
    message: "Project name already exists",
    statusCode: StatusCodes.BAD_REQUEST
  },

  PROJECT_NAME_REQUIRED: {
    message: "Project name is required",
    statusCode: StatusCodes.BAD_REQUEST
  },

  ONE_OR_MORE_USER_INVALID: {
    message: "One or more users are invalid",
    statusCode: StatusCodes.BAD_REQUEST
  }

};
