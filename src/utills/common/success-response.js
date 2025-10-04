// success-response.js
const successResponse = (message, data = {}) => {
  return {
    success: true,
    message: message || "Operation completed successfully",
    data
  };
};

module.exports = successResponse;
