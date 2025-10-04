const { StatusCodes } = require('http-status-codes');

const NewsValidate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Validation error',
        details: error.details.map((d) => d.message),
      });
    }
    next();
  };
};

module.exports = NewsValidate;
