const AppError = require('../errors/AppError');

/** Converts application and framework errors into a standard JSON response. */
module.exports = (err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message, code: err.code });
  }
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({ error: 'Duplicate value', code: 'CONFLICT' });
  }
  if (err.name === 'SequelizeValidationError') {
    return res.status(422).json({ error: err.errors.map((item) => item.message), code: 'VALIDATION_ERROR' });
  }
  console.error(err);
  return res.status(500).json({ error: 'Internal server error', code: 'INTERNAL_ERROR' });
};
