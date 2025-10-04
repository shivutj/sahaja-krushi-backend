const { verifyToken } = require('../utils/jwt');
const { AppError } = require('../utills/app-error');

const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new AppError('Access denied. No token provided.', 401);
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    next(new AppError('Invalid token.', 401));
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Access denied. User not authenticated.', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('Access denied. Insufficient permissions.', 403));
    }

    next();
  };
};

module.exports = {
  authenticate,
  authorize
};
