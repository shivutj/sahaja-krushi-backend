// error-response.js
const errorResponse = (message, data = {}, error = {}) => {
  return {
    success: false,
    message: message || "Operation is not successful",
    data,
    error
  };
};

module.exports = errorResponse;
