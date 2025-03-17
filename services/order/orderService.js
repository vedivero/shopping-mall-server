const productController = require('../../controller/product/productController');
const Order = require('../../models/order.model');
const { randomStringGenerator } = require('../../utils/randomStringGenerator');

/**
 * 주문을 생성하는 서비스 함수
 * @param {Object} data - 주문 데이터 (orderList, totalPrice, shipTo, contact 포함)
 * @param {Array} data.orderList - 주문할 제품 목록
 * @param {number} data.totalPrice - 총 주문 금액
 * @param {Object} data.shipTo - 배송 정보
 * @param {string} data.contact - 연락처
 * @param {string} userId - 주문하는 사용자의 ID
 * @returns {Object} 생성된 주문 객체
 * @throws {Error} 재고가 부족한 경우 예외 발생
 */
const createOrder = async (data, userId) => {
   const insufficientStockItems = await productController.checkItemListStock(data.orderList);

   if (insufficientStockItems.length > 0) {
      const errorMessage = insufficientStockItems.map((item) => item.message).join(', ');
      throw new Error(`주문 실패: ${errorMessage}`);
   }

   const newOrder = new Order({
      userId,
      totalPrice: data.totalPrice,
      shipTo: data.shipTo,
      contact: data.contact,
      items: data.orderList,
      orderNum: randomStringGenerator(),
   });

   await newOrder.save();

   return newOrder;
};

/**
 * 특정 사용자의 주문 목록 조회 서비스 함수
 * @param {string} userId - 조회할 사용자의 ID
 * @returns {Array} 사용자의 주문 목록
 * @throws {Error} 사용자의 주문 내역이 없을 경우 예외 발생
 */
const getOrder = async (userId) => {
   const orderListByUser = await Order.find({ userId })
      .populate({
         path: 'items.productId',
         select: 'name image',
      })
      .sort({ createdAt: -1 });

   if (!orderListByUser || orderListByUser.length === 0) {
      throw new Error('해당 회원의 주문 내역이 존재하지 않습니다.');
   }

   return orderListByUser;
};

/**
 * 모든 주문을 최신순으로 조회하는 서비스 함수 (관리자용)
 * @returns {Array} 최신순으로 정렬된 전체 주문 목록
 * @throws {Error} 주문 내역이 없을 경우 예외 발생
 */
const getOrderByOrderNum = async ({ orderNum, page }) => {
   if (orderNum && orderNum.length !== 10) {
      const error = new Error('주문번호로 검색해 주세요.');
      error.status = 'fail';
      throw error;
   }

   const PAGE_SIZE = 5;
   const skip = (page - 1) * PAGE_SIZE;

   let query = {};
   if (orderNum) {
      query.orderNum = orderNum;
   }

   const orders = await Order.find(query)
      .populate({
         path: 'userId',
         select: 'name email',
      })
      .populate({
         path: 'items.productId',
         select: 'name image price',
      })
      .skip(skip)
      .limit(PAGE_SIZE)
      .sort({ createdAt: -1 });

   const totalOrders = await Order.countDocuments(query);
   const totalPages = Math.ceil(totalOrders / PAGE_SIZE);

   return {
      orders,
      pagination: {
         currentPage: page,
         totalPages,
         totalOrders,
         pageSize: PAGE_SIZE,
      },
   };
};

/**
 * 주문 상태를 업데이트하는 서비스 함수
 * @param {string} id - 업데이트할 주문의 ID
 * @param {string} status - 변경할 주문 상태 (예: "배송 중", "완료")
 * @returns {Object} 업데이트된 주문 객체
 * @throws {Error} 주문을 찾을 수 없는 경우 예외 발생
 */
const updateOrderStatus = async (id, status) => {
   const order = await Order.findById(id);
   if (!order) {
      throw new Error('해당 주문을 찾을 수 없습니다.');
   }

   order.status = status;
   await order.save();

   return order;
};

module.exports = { createOrder, getOrder, getOrderByOrderNum, updateOrderStatus };
