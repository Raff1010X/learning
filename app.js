const express = require('express');
const morgan = require('morgan');

//+ Error handling files
const AppError = require('./utils/appError'); // custom error class
const globalErrorHandler = require('./controllers/errorController'); // custom error handler

//+ Routes files
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reactRouter = require('./routes/reactRoutes');

// + Initialize express app
const app = express();

//+ Middlewares
//++ logging requests
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

//++ for parsing application/json
app.use(express.json());

//++ static files
app.use(express.static(`${__dirname}/views/build/`));

//++ adding a new property to the request object
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

//+ Routes middleware
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//+ Route not found middleware
app.all('*', (req, res, next) => {
    next(new AppError(`Not found: ${req.originalUrl}`, 404));
});

//+ React app route middleware
app.use('/*', reactRouter);

//+ Error handling middleware
app.use(globalErrorHandler); // this is the last middleware

module.exports = app;
