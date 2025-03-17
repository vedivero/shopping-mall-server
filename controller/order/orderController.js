const { StatusCodes } = require('http-status-codes');
const orderService = require('../../services/order/orderService');

const orderController = {};

/**
 * 주문 생성 API
 * 사용자가 새로운 주문을 생성할 때 호출됩니다.
 * @route POST /order
 * @param {Object} req.userId - 요청을 보낸 사용자의 ID
 * @returns {Object} 주문 생성 결과 (성공 시 주문 번호 반환)
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

/**
 * 특정 사용자의 주문 목록 조회 API
 * 로그인한 사용자의 주문 목록을 반환합니다.
 * @route GET /order
 * @param {Object} req.userId - 요청을 보낸 사용자의 ID
 * @returns {Object} 주문 목록 (배열 형태)
 */
orderController.getOrder = async (req, res) => {
   try {
      const { userId } = req;
      const orderList = await orderService.getOrder(userId);
      res.status(StatusCodes.OK).json({ status: 'success', orderList });
   } catch (error) {
      return res
         .status(StatusCodes.BAD_REQUEST)
         .json({ status: 'fail', error: '주문 목록 조회 중 오류가 발생했습니다.', message: error.message });
   }
};

/**
 * 전체 주문 목록 조회 API (관리자용)
 * 관리자가 사용자의 주문 목록을 조회합니다.
 * @route GET /order/list
 * @returns {Object} 전체 주문 목록 (배열 형태)
 */
orderController.getOrderByOrderNum = async (req, res) => {
   try {
      const { page, orderNum } = req.query;
      console.log(orderNum);
      console.log(page);
      const order = await orderService.getOrderByOrderNum({ orderNum, page: Number(page) });

      return res.status(StatusCodes.OK).json({
         status: 'success',
         data: order,
      });
   } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({
         status: error.status || 'fail',
         error: '주문 조회 중 오류가 발생했습니다.',
         message: error.message,
      });
   }
};

/**
 * 주문 상태 업데이트 API
 * 특정 주문의 상태를 변경합니다.
 * @route PATCH /order/:id
 * @param {Object} req.params.id - 변경할 주문의 ID
 * @param {Object} req.body.status - 변경할 주문 상태
 * @returns {Object} 상태 변경 결과 (성공 시 업데이트된 주문 반환)
 */
orderController.updateOrderStatus = async (req, res) => {
   try {
      const { id } = req.params;
      const { status } = req.body;

      console.log('🔹 업데이트할 주문 ID:', id);
      console.log('🔹 변경할 상태:', status);

      const order = await orderService.updateOrderStatus(id, status);
      res.status(StatusCodes.OK).json({
         status: 'success',
         message: '주문 상태가 업데이트되었습니다.',
         order,
      });
   } catch (error) {
      console.error('🔹 주문 상태 업데이트 실패:', error);
      return res.status(StatusCodes.BAD_REQUEST).json({
         status: 'fail',
         error: '주문 상태 변경 중 오류가 발생했습니다.',
         message: error.message,
      });
   }
};

module.exports = orderController;
