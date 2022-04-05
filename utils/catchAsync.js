// catchAsync: catch errors from async functions
module.exports = (fn) => (req, res, next) => {
    fn(req, res, next).catch(next);
};
