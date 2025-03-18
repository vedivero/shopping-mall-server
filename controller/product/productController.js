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
         message: error.message,
      });
   }
};

/**
 * [사용자 페이지] 상품 목록 조회 API
 * 카테고리 및 키워드 검색을 함께 적용
 * @route GET /product
 * @query {string} [category] - 카테고리 필터 (예: 'tops', 'jeans')
 * @query {string} [name] - 키워드 검색
 * @query {number} [page] - 페이지 번호
 * @returns {Object} JSON 응답 (상품 목록 포함)
 */
productController.getUserProducts = async (req, res) => {
   try {
      let { page = 1, category = null, name = null } = req.query;

      category = category && category.trim() !== '' ? category : null;
      name = name && name.trim() !== '' ? name : null;

      const response = await productService.getUserProducts({ page, category, name });

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
 * 특정 카테고리의 상품 목록을 조회하는 API (GET /product/category)
 * @route GET /product/category
 * @query {string} category - 조회할 카테고리명 (예: 'tops', 'jeans')
 * @returns {Object} JSON 응답 (상품 목록 포함)
 */
productController.getProductsByCategory = async (req, res) => {
   try {
      const { category } = req.query;
      const response = await productService.getProductsByCategory({ category });
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

/**
 * 관리자 페이지 - 상품 통계 데이터를 반환하는 컨트롤러
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 * @returns {JSON} 상품 통계 데이터 반환 또는 오류 메시지 반환
 * @description 서비스 레이어에서 상품 목록을 조회하고, 응답으로 전달
 */
productController.getAdminProductListForStats = async (req, res) => {
   try {
      const productList = await productService.getAdminProductListForStats();
      res.status(StatusCodes.OK).json({ status: 'success', data: productList });
   } catch (error) {
      console.error('[ERROR] 상품 조회회 실패:', error);
      return res
         .status(StatusCodes.BAD_REQUEST)
         .json({ status: 'fail', error: '상품 조회 중 오류가 발생했습니다.', message: error.message });
   }
};

module.exports = productController;
