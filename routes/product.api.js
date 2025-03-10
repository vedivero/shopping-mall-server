const express = require('express');
const router = express.Router();
const productController = require('../controller/product/productController');
const authController = require('../controller/auth/authController');

router.post(
   '/regist',
   authController.authenticate,
   authController.checkAdminPermission,
   productController.createProduct,
);

router.get('/', productController.getProducts);
module.exports = router;
