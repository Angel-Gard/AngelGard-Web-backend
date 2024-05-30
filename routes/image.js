const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imagecontroller');
const authenticateJWT = require('../middlewares/authmiddleware');



router.post('/upload/:id',authenticateJWT ,imageController.uploadImage);
router.post('/porfile/:id',authenticateJWT,imageController.getImageById);

module.exports = router;