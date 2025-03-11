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

router.put(
   '/:id',
   authController.authenticate,
   authController.checkAdminPermission,
   productController.updateProduct,
);

module.exports = router;
