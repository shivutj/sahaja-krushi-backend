const { farmerRegistrationSchema, farmerLoginSchema, sendOtpSchema } = require('../validation/farmerValidation');
const { AppError } = require('../utills/app-error');
const { StatusCodes } = require('http-status-codes');

const validateFarmerRegistration = (req, res, next) => {
  try {
    const { error, value } = farmerRegistrationSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    });
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      throw new AppError(errorMessage, StatusCodes.BAD_REQUEST, error.details);
    }
    // Normalize fields
    if (value && value.dateOfBirth) {
      try {
        const d = value.dateOfBirth instanceof Date ? value.dateOfBirth : new Date(value.dateOfBirth);
        // For Sequelize DATEONLY, ensure YYYY-MM-DD
        value.dateOfBirth = d.toISOString().slice(0, 10);
      } catch (_) {
        // If parsing fails, keep original; Joi would have errored earlier
      }
    }
    // Convert empty strings to null for optional fields to avoid Sequelize type errors
    const optionalStringFields = [
      'fullName', 'gender', 'aadharNumber', 'alternateContactNumber', 'email', 'address', 'state', 'district', 'village', 'pinCode',
      'landSize', 'farmingType', 'waterSource', 'experienceYears', 'bankName', 'accountNumber', 'ifscCode', 'accountHolderName', 'insuranceScheme'
    ];
    optionalStringFields.forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        if (value[key] === '') {
          value[key] = null;
        }
      }
    });
    // Ensure arrays are either arrays or null
    ['cropsGrown', 'equipmentOwned'].forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        if (value[key] == null) return; // keep null/undefined as is
        if (!Array.isArray(value[key])) {
          value[key] = null;
        }
      }
    });
    // Use the sanitized/converted value
    req.body = value;
    next();
  } catch (error) {
    next(error);
  }
};

const validateFarmerLogin = (req, res, next) => {
  try {
    const { error, value } = farmerLoginSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    });
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      throw new AppError(errorMessage, StatusCodes.BAD_REQUEST, error.details);
    }
    // Normalize dateOfBirth to YYYY-MM-DD if present
    if (value && value.dateOfBirth) {
      try {
        const d = value.dateOfBirth instanceof Date ? value.dateOfBirth : new Date(value.dateOfBirth);
        value.dateOfBirth = d.toISOString().slice(0, 10);
      } catch (_) {
        // ignore, Joi would have validated
      }
    }
    req.body = value;
    next();
  } catch (error) {
    next(error);
  }
};

const validateSendOtp = (req, res, next) => {
  try {
    const { error, value } = sendOtpSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    });
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      throw new AppError(errorMessage, StatusCodes.BAD_REQUEST, error.details);
    }
    req.body = value;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  validateFarmerRegistration,
  validateFarmerLogin,
  validateSendOtp
};
