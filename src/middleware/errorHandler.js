export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error
  let error = {
    message: err.message || 'Internal Server Error',
    status: err.status || 500,
    code: err.code || 'INTERNAL_ERROR'
  };

  // PostgreSQL errors
  if (err.code) {
    switch (err.code) {
      case '23505': // Unique violation
        error = {
          message: 'Resource already exists',
          status: 409,
          code: 'DUPLICATE_RESOURCE'
        };
        break;
      case '23503': // Foreign key violation
        error = {
          message: 'Referenced resource not found',
          status: 400,
          code: 'INVALID_REFERENCE'
        };
        break;
      case '23502': // Not null violation
        error = {
          message: 'Required field missing',
          status: 400,
          code: 'MISSING_REQUIRED_FIELD'
        };
        break;
      case '42P01': // Table does not exist
        error = {
          message: 'Table not found',
          status: 404,
          code: 'TABLE_NOT_FOUND'
        };
        break;
    }
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    error = {
      message: 'Validation failed',
      status: 400,
      code: 'VALIDATION_ERROR',
      details: err.details
    };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = {
      message: 'Invalid token',
      status: 401,
      code: 'INVALID_TOKEN'
    };
  }

  if (err.name === 'TokenExpiredError') {
    error = {
      message: 'Token expired',
      status: 401,
      code: 'TOKEN_EXPIRED'
    };
  }

  // Send error response
  res.status(error.status).json({
    error: error.message,
    code: error.code,
    ...(error.details && { details: error.details }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};