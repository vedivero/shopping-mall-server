const { StatusCodes } = require('http-status-codes');
const cartService = require('../../services/cart/cartService');

const cartController = {};

/**
 * 장바구니에 상품 추가 API
 * @route POST /cart/
 * @param {Object} req - 요청 객체 (body에 userId, productId, size, qty 포함)
 * @param {Object} res - 응답 객체 (업데이트된 장바구니 데이터 반환)
 * @returns {JSON} 장바구니 추가 성공 또는 실패 메시지
 */
cartController.addItemToCart = async (req, res) => {
   try {
      const data = { ...req.body, userId: req.userId };
      const cart = await cartService.addItemToCart(data);

      return res.status(StatusCodes.OK).json({
         status: 'success',
         data: cart,
         cartItemCount: cart.items.reduce((acc, item) => acc + item.qty, 0),
      });
   } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
         status: 'fail',
         error: error.message,
      });
   }
};

/**
 * 장바구니 조회 API
 * @route GET /cart
 * @param {Object} req - 요청 객체 (로그인된 사용자 정보 포함)
 * @param {Object} res - 응답 객체 (장바구니 데이터 반환)
 * @returns {JSON} 장바구니 조회 성공 또는 실패 메시지
 */
cartController.getCart = async (req, res) => {
   try {
      const { userId } = req;
      const items = await cartService.getCartByUserId(userId);

      res.status(StatusCodes.OK).json({ status: 'success', data: items });
   } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: 'error', message: error.message });
   }
};

module.exports = cartController;
