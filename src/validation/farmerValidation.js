const Joi = require('joi');

const farmerRegistrationSchema = Joi.object({
  // Only mandatory fields
  contactNumber: Joi.string().pattern(/^[6-9]\d{9}$/).required().messages({
    'string.pattern.base': 'Please enter a valid 10-digit mobile number'
  }),
  dateOfBirth: Joi.date().max('now').required().messages({
    'date.base': 'Please enter a valid date',
    'date.max': 'Date of birth cannot be in the future'
  }),

  // All other fields optional/nullable (allow empty string)
  fullName: Joi.string().min(2).max(100).allow('', null).optional(),
  gender: Joi.string().valid('Male', 'Female', 'Other').allow('', null).optional(),
  aadharNumber: Joi.string().allow('', null).optional(),
  alternateContactNumber: Joi.string().pattern(/^[6-9]\d{9}$/).allow('', null).optional(),
  email: Joi.string().email().allow('', null).optional(),
  address: Joi.string().allow('', null).optional(),
  state: Joi.string().allow('', null).optional(),
  district: Joi.string().allow('', null).optional(),
  village: Joi.string().allow('', null).optional(),
  pinCode: Joi.string().allow('', null).optional(),
  landSize: Joi.alternatives().try(Joi.number(), Joi.string()).allow('', null).optional(),
  cropsGrown: Joi.array().items(Joi.string()).allow(null).optional(),
  farmingType: Joi.string().allow('', null).optional(),
  waterSource: Joi.string().allow('', null).optional(),
  equipmentOwned: Joi.array().items(Joi.string()).allow(null).optional(),
  experienceYears: Joi.alternatives().try(Joi.number(), Joi.string()).allow('', null).optional(),
  bankName: Joi.string().allow('', null).optional(),
  accountNumber: Joi.string().allow('', null).optional(),
  ifscCode: Joi.string().allow('', null).optional(),
  accountHolderName: Joi.string().allow('', null).optional(),
  isKycDone: Joi.boolean().default(false),
  insuranceScheme: Joi.string().allow('', null).optional()
});

const farmerLoginSchema = Joi.object({
  contactNumber: Joi.string().pattern(/^[6-9]\d{9}$/).required().messages({
    'string.pattern.base': 'Please enter a valid 10-digit mobile number'
  }),
  dateOfBirth: Joi.date().max('now').required().messages({
    'date.base': 'Please enter a valid date',
    'date.max': 'Date of birth cannot be in the future'
  })
});

const sendOtpSchema = Joi.object({
  contactNumber: Joi.string().pattern(/^[6-9]\d{9}$/).required().messages({
    'string.pattern.base': 'Please enter a valid 10-digit mobile number'
  })
});

module.exports = {
  farmerRegistrationSchema,
  farmerLoginSchema,
  sendOtpSchema
};
