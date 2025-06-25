import { body, param, query, validationResult } from 'express-validator';

// Handle validation errors
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: errors.array()
    });
  }
  next();
};

// User validation rules
export const validateUserRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  handleValidationErrors
];

export const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

// Project validation rules
export const validateProjectCreation = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Project name is required and must be less than 255 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  handleValidationErrors
];

export const validateProjectUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Project name must be less than 255 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  body('settings')
    .optional()
    .isObject()
    .withMessage('Settings must be an object'),
  handleValidationErrors
];

// Table validation rules
export const validateTableCreation = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 255 })
    .matches(/^[a-zA-Z][a-zA-Z0-9_]*$/)
    .withMessage('Table name must start with a letter and contain only letters, numbers, and underscores'),
  body('fields')
    .isArray({ min: 1 })
    .withMessage('At least one field is required'),
  body('fields.*.name')
    .trim()
    .isLength({ min: 1, max: 255 })
    .matches(/^[a-zA-Z][a-zA-Z0-9_]*$/)
    .withMessage('Field name must start with a letter and contain only letters, numbers, and underscores'),
  body('fields.*.type')
    .isIn(['string', 'number', 'boolean', 'date', 'object', 'array', 'relation', 'currency', 'weight'])
    .withMessage('Invalid field type'),
  body('fields.*.required')
    .isBoolean()
    .withMessage('Required must be a boolean'),
  handleValidationErrors
];

// API Key validation rules
export const validateApiKeyCreation = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('API key name is required'),
  body('permissions')
    .isArray({ min: 1 })
    .withMessage('At least one permission is required'),
  body('permissions.*')
    .isIn(['read', 'write', 'delete', 'admin'])
    .withMessage('Invalid permission'),
  body('expiresAt')
    .optional()
    .isISO8601()
    .withMessage('Invalid expiration date'),
  handleValidationErrors
];

// Parameter validation
export const validateUUID = (paramName) => [
  param(paramName)
    .isUUID()
    .withMessage(`${paramName} must be a valid UUID`),
  handleValidationErrors
];

// Query validation
export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  handleValidationErrors
];