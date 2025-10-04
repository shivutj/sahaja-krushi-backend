// validations/newsValidation.js
const Joi = require("joi");

const newsValidationSchema = Joi.object({
  title: Joi.string().min(3).max(255).required(),
  content: Joi.string().min(10).required(),
  documentUrl: Joi.string().uri().optional(),
  documentName: Joi.string().max(255).optional()
});

module.exports = newsValidationSchema;
