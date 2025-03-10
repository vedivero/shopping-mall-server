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

/**
 * 상품 목록을 조회하는 서비스 함수
 * @param {Object} queryParams - 페이지와 검색어를 포함한 쿼리 파라미터
 * @returns {Array} 상품 목록 배열
 */
const getProducts = async ({ page, name }) => {
   const cond = name ? { name: { $regex: name, $options: 'i' } } : {};
   let query = Product.find(cond);
   const productList = await query.exec();
   return productList;
};

module.exports = { createProduct, getProducts };
