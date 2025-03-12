const express = require('express');
const router = express.Router();
const cartController = require('../controller/cart/cartController');
const authController = require('../controller/auth/authController');

router.post('/', authController.authenticate, cartController.addItemToCart);
router.get('/', authController.authenticate, cartController.getCart);
router.delete('/:id', authController.authenticate, cartController.deleteCartItem);
router.put('/:id', authController.authenticate, cartController.editCartItem);
router.get('/qty', authController.authenticate, cartController.getCartQty);

module.exports = router;
