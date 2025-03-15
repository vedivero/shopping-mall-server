const { StatusCodes } = require('http-status-codes');
const orderService = require('../../services/order/orderService');

const orderController = {};

/**
 * 주문 생성 API
 * @route POST /order
 * @param {Object} req - 요청 객체 (주문 정보 포함)
 * @param {Object} res - 응답 객체
 */
orderController.createOrder = async (req, res) => {
   try {
      const { userId } = req;
      const createdOrder = await orderService.createOrder(req.body, userId);

      res.status(StatusCodes.OK).json({ status: 'success', orderNum: createdOrder.orderNum });
   } catch (error) {
      console.error('주문 생성 실패:', error);
      return res
         .status(StatusCodes.BAD_REQUEST)
         .json({ status: 'fail', error: '주문 처리 중 오류가 발생했습니다.', message: error.message });
   }
};

orderController.getOrder = async (req, res) => {
   try {
      const { userId } = req;
      const order = await orderService.getOrder(userId);
      res.status(StatusCodes.OK).json({ status: success, order });
   } catch (error) {
      return res
         .status(StatusCodes.BAD_REQUEST)
         .json({ status: 'fail', error: '주문 목록 조회 중 오류가 발생했습니다.', message: error.message });
   }
};
module.exports = orderController;
