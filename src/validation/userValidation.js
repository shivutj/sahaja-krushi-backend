const Joi = require('joi');

const createUserSchema = Joi.object({
  username: Joi.string()
    .min(3)
    .max(50)
    .required()
    .messages({
      'string.min': 'Username must be at least 3 characters long',
      'string.max': 'Username cannot exceed 50 characters',
      'any.required': 'Username is required'
    }),
  
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'Password is required'
    }),
  
  role: Joi.string()
    .valid('SUPER_ADMIN', 'ADMIN')
    .default('ADMIN'),
  
  firstName: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.min': 'First name must be at least 2 characters long',
      'string.max': 'First name cannot exceed 50 characters',
      'any.required': 'First name is required'
    }),
  
  lastName: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.min': 'Last name must be at least 2 characters long',
      'string.max': 'Last name cannot exceed 50 characters',
      'any.required': 'Last name is required'
    }),
  
  phone: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .required()
    .messages({
      'string.pattern.base': 'Please provide a valid 10-digit Indian mobile number',
      'any.required': 'Phone number is required'
    }),
  
  address: Joi.string()
    .min(10)
    .max(500)
    .required()
    .messages({
      'string.min': 'Please provide a complete address',
      'string.max': 'Address cannot exceed 500 characters',
      'any.required': 'Address is required'
    }),
  
  district: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'District name must be at least 2 characters long',
      'string.max': 'District name cannot exceed 100 characters',
      'any.required': 'District is required'
    }),
  
  state: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'State name must be at least 2 characters long',
      'string.max': 'State name cannot exceed 100 characters',
      'any.required': 'State is required'
    }),
  
  postalCode: Joi.string()
    .pattern(/^[1-9][0-9]{5}$/)
    .required()
    .messages({
      'string.pattern.base': 'Please provide a valid 6-digit postal code',
      'any.required': 'Postal code is required'
    }),
  
  country: Joi.string()
    .min(2)
    .max(100)
    .default('India')
    .messages({
      'string.min': 'Country name must be at least 2 characters long',
      'string.max': 'Country name cannot exceed 100 characters'
    }),
  
  dateOfBirth: Joi.date()
    .max('now')
    .optional()
    .messages({
      'date.max': 'Date of birth cannot be in the future'
    }),
  
  gender: Joi.string()
    .valid('MALE', 'FEMALE', 'OTHER')
    .optional(),
  
  profileImage: Joi.string()
    .uri()
    .optional()
    .messages({
      'string.uri': 'Please provide a valid image URL'
    })
});

const updateUserSchema = Joi.object({
  username: Joi.string()
    .min(3)
    .max(50)
    .optional(),
  
  email: Joi.string()
    .email()
    .optional(),
  
  password: Joi.string()
    .min(6)
    .optional(),
  
  firstName: Joi.string()
    .min(2)
    .max(50)
    .optional(),
  
  lastName: Joi.string()
    .min(2)
    .max(50)
    .optional(),
  
  phone: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .optional(),
  
  address: Joi.string()
    .min(10)
    .max(500)
    .optional(),
  
  district: Joi.string()
    .min(2)
    .max(100)
    .optional(),
  
  state: Joi.string()
    .min(2)
    .max(100)
    .optional(),
  
  postalCode: Joi.string()
    .pattern(/^[1-9][0-9]{5}$/)
    .optional(),
  
  country: Joi.string()
    .min(2)
    .max(100)
    .optional(),
  
  dateOfBirth: Joi.date()
    .max('now')
    .optional(),
  
  gender: Joi.string()
    .valid('MALE', 'FEMALE', 'OTHER')
    .optional(),
  
  profileImage: Joi.string()
    .uri()
    .optional(),
  
  isActive: Joi.boolean()
    .optional()
});

module.exports = {
  createUserSchema,
  updateUserSchema
};
