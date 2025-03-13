const productController = require('../../controller/product/productController');
const Order = require('../../models/order.model');
const { randomStringGenerator } = require('../../utils/randomStringGenerator');

/**
 * 주문을 생성하는 서비스 함수
 * @param {Object} data - 주문 데이터 (orderList, totalPrice, shipTo, contact 포함)
 * @returns {Object} 생성된 주문 객체
 * @throws {Error} 재고가 부족한 경우 예외 발생
 */
const createOrder = async (data, userId) => {
   console.log(userId);
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

module.exports = { createOrder };
