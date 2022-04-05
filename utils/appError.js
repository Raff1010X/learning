class AppError extends Error {
    constructor(message, statusCode) {
        super(message);

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true; // not a bug error

        Error.captureStackTrace(this, this.constructor); // this is to be able to catch the error in the catch block
    }
}

module.exports = AppError;
