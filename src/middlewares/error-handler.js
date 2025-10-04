const { StatusCodes } = require('http-status-codes');
const { AppError } = require('../utills/app-error');

// Centralized error handler to ensure JSON responses
function errorHandler(err, req, res, _next) {
  // Determine status code
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;

  // Prepare base payload
  const payload = {
    success: false,
    message: err.message || 'Something went wrong',
    data: null,
  };

  // Include validation details if present
  if (err.details && Array.isArray(err.details)) {
    payload.errors = err.details.map(d => ({ message: d.message, path: d.path }));
  }

  // Include stack only in development for debugging
  if (process.env.NODE_ENV !== 'production' && err.stack) {
    payload.stack = err.stack;
  }

  // Known AppError: return as-is; Unknown errors: generic message in production
  if (!(err instanceof AppError) && process.env.NODE_ENV === 'production') {
    payload.message = 'Internal server error';
  }

  // Ensure JSON Content-Type and send response
  res.status(statusCode).json(payload);
}

module.exports = { errorHandler };
