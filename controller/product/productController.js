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
      console.log(object);
      res.status(StatusCodes.OK).json({ status: 'success', product });
   } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ status: 'fail', error: error.message });
   }
};

/**
 * 상품 목록 조회 API
 * @route GET /product
 */
productController.getProducts = async (req, res) => {
   try {
      const { page, name } = req.query;
      let response = { status: 'success' };
      response = await productService.getProducts({ page, name, response });
      res.status(StatusCodes.OK).json(response);
   } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ status: 'fail', error: error.message });
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
      res.status(StatusCodes.BAD_REQUEST).json({ status: 'fail', error: error.message });
   }
};

module.exports = productController;
