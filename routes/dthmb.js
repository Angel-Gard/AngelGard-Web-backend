const express = require('express');
const router = express.Router();
const DTHcontroller = require('../controllers/dthmbcontroller');

router.get('/data/:id',DTHcontroller.getTempData);
router.post('/test/:user_login_id',DTHcontroller.testcontroller);

module.exports = router;