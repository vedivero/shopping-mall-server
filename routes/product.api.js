const express = require('express');
const router = express.Router();
const productController = require('../controller/product/productController');
const authController = require('../controller/auth/authController');

// 상품 등록
router.post(
   '/regist',
   authController.authenticate,
   authController.checkAdminPermission,
   productController.createProduct,
);

// 랜딩 페이지(사용자) - 전체 상품 조회
router.get('/', productController.getUserProducts);

// 관리자 페이지 - 전체 상품 조회
router.get(
   '/admin',
   authController.authenticate,
   authController.checkAdminPermission,
   productController.getAdminProducts,
);

// 상품 정보 수정
router.put(
   '/:id',
   authController.authenticate,
   authController.checkAdminPermission,
   productController.updateProduct,
);

// 상품 삭제
router.delete(
   '/:id',
   authController.authenticate,
   authController.checkAdminPermission,
   productController.deleteProduct,
);

// 상품 상세정보 조회
router.get('/:id', productController.getProductById);

module.exports = router;
