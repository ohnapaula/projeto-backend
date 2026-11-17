const jwt = require('jsonwebtoken');
const AppError = require('../errors/AppError');

/** Validates a Bearer JWT and exposes the authenticated subject. */
module.exports = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    throw new AppError('Authorization token is required', 400, 'UNAUTHORIZED');
  }
  try {
    req.user = jwt.verify(header.slice(7), process.env.JWT_SECRET);
    return next();
  } catch (error) {
    throw new AppError('Invalid or expired authorization token', 401, 'UNAUTHORIZED');
  }
};
