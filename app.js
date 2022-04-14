const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

//+ Error handling files
const AppError = require('./utils/appError'); // custom error class
const globalErrorHandler = require('./controllers/errorController'); // custom error handler

//+ Routes files
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reactRouter = require('./routes/reactRoutes');
const reviewRouter = require('./routes/reviewRoutes');

// + Initialize express app
const app = express();

//+ Middlewares

//+ Set security HTTP headers
app.use(helmet());

//++ logging requests
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

//+ Rate limiting
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!',
});

app.use('/api', limiter);

//++ for parsing application/json
app.use(express.json({ limit: '10kb' }));

//+ Data sanitization against NoSQL query injection with express-mongo-sanitize
app.use(mongoSanitize());

//+ Data sanitization against XSS
app.use(xss());

//+ Enable CORS
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header(
//         'Access-Control-Allow-Headers',
//         'Origin, X-Requested-With, Content-Type, Accept, Authorization'
//     );
//     if (req.method === 'OPTIONS') {
//         res.header(
//             'Access-Control-Allow-Methods',
//             'GET, POST, PUT, PATCH, DELETE'
//         );
//         return res.status(200).json({});
//     }
//     next();
// });

//+ Prevent parameter pollution
app.use(
    hpp({
        whitelist: [
            'duration',
            'ratingsQuantity',
            'ratingsAverage',
            'maxGroupSize',
            'difficulty',
            'price',
        ],
    })
);

//+
//app.use(express.urlencoded({ extended: true, limit: '10kb' }));

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
app.use('/api/v1/reviews', reviewRouter);

//+ Route not found middleware
app.all('*', (req, res, next) => {
    next(new AppError(`Not found: ${req.originalUrl}`, 404));
});

//+ React app route middleware
app.use('/*', reactRouter);

//+ Error handling middleware
app.use(globalErrorHandler); // this is the last middleware

module.exports = app;
