// This middleware runs when `next(error)` is called

const errorHandler = (err, req, res, next) => {
  // Log the error for debugging purposes
  console.error(err.stack);

  // Determine the status code. If the error has a specific status, use it.
  // Otherwise, default to 500 (Internal Server Error).
  const statusCode = err.statusCode || 500;

  // Send a structured error response
  res.status(statusCode).json({
    status: 'error',
    statusCode: statusCode,
    message: err.message || 'An unexpected error occurred on the server.',
  });
};

module.exports = errorHandler;