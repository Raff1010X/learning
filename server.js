//+ Uncaught exception handler
process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

//+ Load environment variables from .env file
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

//+ Log environment variables
if (process.env.NODE_ENV === 'development') {
    //console.log(app.get('env'));
    //console.log(process.env);
}

//+ Connect to MongoDB
const mongoose = require('mongoose');

const port = process.env.PORT || 3000;
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.PASSWORD);
const DB_OPTIONS = {
    useNewUrlParser: true,
    //useCreateIndex: true,
    //useFindAndModify: false,
    useUnifiedTopology: true,
};
mongoose
    .connect(DB, DB_OPTIONS)
    .then(() => console.log('DB connection successful'));
//.catch(() => console.log('Problem with database connection'));

//+ Start server
const app = require('./app');

const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

//+ Unhandled promise rejection
process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
