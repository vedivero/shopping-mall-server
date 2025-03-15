const express = require('express');
const authController = require('../controller/auth/authController');
const orderController = require('../controller/order/orderController');
const router = express.Router();

router.post('/', authController.authenticate, orderController.createOrder);
router.get('/', authController.authenticate, orderController.getOrder);

module.exports = router;
