const express = require('express');
const router = express.Router();
const cartController = require('../controller/cart/cartController');
const authController = require('../controller/auth/authController');

router.post('/', authController.authenticate, cartController.addItemToCart);

module.exports = router;
