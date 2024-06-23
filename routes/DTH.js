const express = require('express');
const router = express.Router();
const DTHcontroller = require('../controllers/DTHcontroller');

router.get('/data/:id',DTHcontroller.getTempData);

module.exports = router;