const Product = require('../../models/product.model');

/**
 * 새로운 상품을 생성하는 서비스 함수
 * @param {Object} productData - 생성할 상품 데이터
 * @returns {Object} 생성된 상품 객체
 */
const createProduct = async (productData) => {
   const { sku, name, size, image, category, description, price, stock, status } = productData;
   const product = new Product({ sku, name, size, image, category, description, price, stock, status });
   await product.save();
   return product;
};

module.exports = { createProduct };
