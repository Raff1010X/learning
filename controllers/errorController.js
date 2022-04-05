const AppError = require('../utils/appError');

//+ Error response in development
const sendErrorDev = (err, req, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        isOperational: err.isOperational,
        message: err.message,
        stack: err.stack,
    });
};

//+ Error response in production
const sendErrorProd = (err, req, res) => {
    if (err.isOperational) {
        //++ operational error response
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    } else {
        //++ programming error response
        console.error('ERROR 🔥🔥🔥');
        console.log(err);
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong',
        });
    }
};

//+ Handling different types of errors
const handleCastErrorDB = (err) => {
    const message = `Invalid id: ${err.value}`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
    const message = `Duplicate field value: ${
        err.keyValue[Object.keys(err.keyValue)]
    }. Please use another value!`;
    return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};

const handleJWTError = () =>
    new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
    new AppError('Your token has expired! Please log in again.', 401);

//+ Error handling main function
module.exports = (err, req, res, next) => {
    //console.log(err.stack);

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };

        error.message = err.message;

        if (error.kind === 'ObjectId') error = handleCastErrorDB(error);
        else if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        else if (error.errors) error = handleValidationErrorDB(error);
        else if (error.name === 'JsonWebTokenError') error = handleJWTError();
        else if (error.name === 'TokenExpiredError')
            error = handleJWTExpiredError();

        sendErrorProd(error, req, res);
    }
};
