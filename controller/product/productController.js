const { StatusCodes } = require('http-status-codes');
const productService = require('../../services/product/productService');

const productController = {};

/**
 * 상품 등록 API
 * @route POST /product/regist
 */
productController.createProduct = async (req, res) => {
   try {
      const product = await productService.createProduct(req.body);
      res.status(StatusCodes.OK).json({ status: 'success', product });
   } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({
         status: 'fail',
         error: '상품 생성 중 오류가 발생했습니다.',
         message: error.message,
      });
   }
};

/**
 * [랜딩 페이지(사용자)]상품 목록 조회 API
 * @route GET /product
 */
productController.getUserProducts = async (req, res) => {
   try {
      const { page, name } = req.query;
      let response = { status: 'success' };
      response = await productService.getUserProducts({ page, name, response });
      res.status(StatusCodes.OK).json(response);
   } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({
         status: 'fail',
         error: '상품 목록 호출 중 오류가 발생했습니다.',
         message: error.message,
      });
   }
};

/**
 * [관리자 페이지]상품 목록 조회 API
 * @route GET /product
 */
productController.getAdminProducts = async (req, res) => {
   try {
      const { page, name } = req.query;
      let response = { status: 'success' };
      response = await productService.getAdminProducts({ page, name, response });
      res.status(StatusCodes.OK).json(response);
   } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({
         status: 'fail',
         error: '상품 목록 호출 중 오류가 발생했습니다.',
         message: error.message,
      });
   }
};

/**
 * 상품 정보 업데이트 API
 * @route PUT /product/:id
 */
productController.updateProduct = async (req, res) => {
   try {
      const productId = req.params.id;
      const updatedData = req.body;

      const updatedProduct = await productService.updateProduct(productId, updatedData);
      res.status(StatusCodes.OK).json({ status: 'success', data: updatedProduct });
   } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({
         status: 'fail',
         error: '상품 수정 중 오류가 발생했습니다.',
         message: error.message,
      });
   }
};

/**
 * 상품 상세 조회 API (ID 기준)
 * @route GET /product/:id
 */
productController.getProductById = async (req, res) => {
   try {
      const { id } = req.params;
      const product = await productService.getProductById(id);
      res.status(StatusCodes.OK).json({ status: 'success', data: product });
   } catch (error) {
      console.error('상품 상세 조회 실패:', error);
      return res.status(StatusCodes.BAD_REQUEST).json({
         status: 'fail',
         error: '상품 정보를 불러오는 중 오류가 발생했습니다.',
         message: error.message,
      });
   }
};

/**
 * 상품 삭제 API (isDeleted 값 변경)
 * @route DELETE /product/:id
 */
productController.deleteProduct = async (req, res) => {
   try {
      const { id } = req.params;
      const deletedProduct = await productService.deleteProduct(id);
      res.status(StatusCodes.OK).json({ status: 'success', data: deletedProduct });
   } catch (error) {
      console.error('[ERROR] 상품 삭제 실패:', error);
      return res
         .status(StatusCodes.BAD_REQUEST)
         .json({ status: 'fail', error: '상품 삭제 중 오류가 발생했습니다.', message: error.message });
   }
};

/**
 * 개별 상품 재고 확인 API
 * @param {Object} item - { productId, size, qty }
 * @returns {Object} { isVerify: boolean, message?: string }
 */
productController.checkStock = async (item) => {
   return await productService.checkStock(item);
};

/**
 * 주문 리스트의 모든 상품 재고 확인 API
 * @param {Array} orderList - [{ productId, size, qty }]
 * @returns {Array} 부족한 재고 목록
 */
productController.checkItemListStock = async (orderList) => {
   return await productService.checkItemListStock(orderList);
};

module.exports = productController;
