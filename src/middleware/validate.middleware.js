const { ERROR_CODES, createError } = require("../errors");

const validate = (schema, property = "body") => {
  return (req, res, next) => {
    try {
      const { error, value } = schema.validate(req[property]);

      if (error) {
        throw {
          ...createError(ERROR_CODES.VALIDATION_ERROR),
          message: error.details[0].message
        };
      }

      // assign sanitized / defaulted values
      req[property] = value;

      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = validate;
