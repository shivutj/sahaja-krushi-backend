const { createUserSchema, updateUserSchema } = require('../validation/userValidation');
const AppError = require('../utills/app-error');

const validateCreateUser = (req, res, next) => {
  const { error } = createUserSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errorMessages = error.details.map(detail => detail.message);
    return next(new AppError(`Validation Error: ${errorMessages.join(', ')}`, 400));
  }
  
  next();
};

const validateUpdateUser = (req, res, next) => {
  const { error } = updateUserSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errorMessages = error.details.map(detail => detail.message);
    return next(new AppError(`Validation Error: ${errorMessages.join(', ')}`, 400));
  }
  
  next();
};

module.exports = {
  validateCreateUser,
  validateUpdateUser
};
