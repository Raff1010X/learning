//+ React routes
const express = require('express');
const serveReactApp = require('../controllers/reactController');

const router = express.Router();

router.route('/*').get(serveReactApp);

module.exports = router;
