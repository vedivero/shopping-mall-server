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
      const productList = await productService.getProducts({ page, name });
      res.status(StatusCodes.OK).json({ status: 'success', productList });
   } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ status: 'fail', error: error.message });
   }
};

module.exports = productController;
