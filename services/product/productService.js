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
 * @returns {Object} 응답 객체 (상품 목록 및 페이지 정보 포함)
 */
const getProducts = async ({ page, name, response }) => {
   const PAGE_SIZE = 5;
   const cond = name ? { name: { $regex: name, $options: 'i' } } : {};
   let query = Product.find(cond);

   if (page) {
      query.skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE);

      // 총 아이템 개수와 총 페이지 수 계산
      const totalItemNum = await Product.countDocuments(cond);
      const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);

      response.totalItemNum = totalItemNum;
      response.totalPageNum = totalPageNum;
   }

   const productList = await query.exec();
   response.productList = productList;

   return response;
};

/**
 * 상품 정보 업데이트 서비스 함수
 * @param {String} productId - 업데이트할 상품 ID
 * @param {Object} updatedData - 변경할 상품 데이터
 * @returns {Object} 업데이트된 상품 객체
 * @throws {Error} 상품이 존재하지 않으면 예외 발생
 */
const updateProduct = async (productId, updatedData) => {
   const product = await Product.findByIdAndUpdate({ _id: productId }, updatedData, { new: true });
   console.log(product);
   if (!product) throw new Error('해당 상품이 존재하지 않습니다.');
   return product;
};

module.exports = { createProduct, getProducts, updateProduct };
