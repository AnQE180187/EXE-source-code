/**
 * API Response Helper Functions
 */

// Success response
exports.successResponse = (res, message, data, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

// Error response
exports.errorResponse = (res, message, error = null, statusCode = 500) => {
  const response = {
    success: false,
    message,
  };

  if (error && process.env.NODE_ENV === 'development') {
    response.error = error.message;
  }

  return res.status(statusCode).json(response);
};

// Not found response
exports.notFoundResponse = (res, message = 'Resource not found') => {
  return res.status(404).json({
    success: false,
    message,
  });
};

// Unauthorized response
exports.unauthorizedResponse = (res, message = 'Unauthorized access') => {
  return res.status(401).json({
    success: false,
    message,
  });
};

// Forbidden response
exports.forbiddenResponse = (res, message = 'Forbidden access') => {
  return res.status(403).json({
    success: false,
    message,
  });
};
