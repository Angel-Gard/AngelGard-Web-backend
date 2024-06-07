const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imagecontroller');
const authenticateJWT = require('../middlewares/authmiddleware');



router.post('/upload/:user_login_id',authenticateJWT ,imageController.uploadImage);
router.post('/porfile/:user_login_id',authenticateJWT,imageController.getImageById);

module.exports = router;