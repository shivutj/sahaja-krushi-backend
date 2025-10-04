class AppError extends Error {
    constructor(message, statusCode, details = undefined) {
        super(message);
        this.statusCode = statusCode;
        this.explanation = message;
        this.isOperational = true; // Indicates if the error is operational or programming error
        if (details) {
            this.details = details;
        }
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = { AppError };