const express = require('express');
const router = express.Router();
const { dashboard } = require('../controller/dashboard');

router.get('/', dashboard)

module.exports = router;