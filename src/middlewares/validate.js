const AppError = require('../errors/AppError');

/** Validates request params, query or body with a Joi schema. */
module.exports = (schema, source = 'body') => (req, res, next) => {
  const { error, value } = schema.validate(req[source], { abortEarly: false, stripUnknown: true });
  if (error) throw new AppError(error.details.map((item) => item.message).join('; '), 400, 'VALIDATION_ERROR');
  req[source] = value;
  next();
};
