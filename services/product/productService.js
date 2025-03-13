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
   const existingProduct = await Product.findById(productId);
   if (!existingProduct) throw new Error('해당 상품이 존재하지 않습니다.');

   if (updatedData.category) {
      const mergedCategories = [...existingProduct.category, ...updatedData.category];
      updatedData.category = [...new Set(mergedCategories)];
   }

   const updatedProduct = await Product.findByIdAndUpdate({ _id: productId }, updatedData, { new: true });

   if (!updatedProduct) throw new Error('상품 업데이트에 실패했습니다.');
   return updatedProduct;
};

/**
 * 상품 상세 조회 서비스 함수
 * @param {string} productId - 조회할 상품 ID
 * @returns {Object} 상품 객체
 */
const getProductById = async (productId) => {
   const product = await Product.findById(productId);
   if (!product) throw new Error('해당 상품을 찾을 수 없습니다.');
   return product;
};

/**
 * 상품 삭제 서비스 함수 (isDeleted 값 변경)
 * @param {string} productId - 삭제할 상품 ID
 * @throws {Error} 상품이 존재하지 않을 경우 오류 발생
 */
const deleteProduct = async (productId) => {
   const product = await Product.findByIdAndUpdate(productId, { isDeleted: false }, { new: true });
   if (!product) throw new Error('해당 상품을 찾을 수 없습니다.');
   return product;
};

/**
 * 개별 상품 재고 확인 서비스 함수
 * @param {Object} item - { productId, size, qty }
 * @returns {Object} { isVerify: boolean, message?: string }
 */
const checkStock = async (item) => {
   const product = await Product.findById(item.productId);
   if (!product) {
      return { isVerify: false, message: '상품을 찾을 수 없습니다.' };
   }

   if (product.stock[item.size] < item.qty) {
      return { isVerify: false, message: `${product.name}의 ${item.size} 사이즈 재고가 부족합니다.` };
   }

   // 재고 업데이트
   const newStock = { ...product.stock };
   newStock[item.size] -= item.qty;
   product.stock = newStock;
   await product.save();

   return { isVerify: true };
};

/**
 * 주문 리스트의 모든 상품 재고 확인 서비스 함수
 * @param {Array} orderList - [{ productId, size, qty }]
 * @returns {Array} 부족한 재고 목록
 */
const checkItemListStock = async (orderList) => {
   const insufficientStockItems = [];

   await Promise.all(
      orderList.map(async (item) => {
         const stockCheck = await checkStock(item);
         if (!stockCheck.isVerify) {
            insufficientStockItems.push({ item, message: stockCheck.message });
         }
      }),
   );

   return insufficientStockItems;
};
module.exports = {
   createProduct,
   getProducts,
   updateProduct,
   getProductById,
   deleteProduct,
   checkItemListStock,
};
