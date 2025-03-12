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

/**
 * 장바구니 아이템 삭제 API
 * @route DELETE /cart/:id
 * @param {Object} req - 요청 객체 (params에 삭제할 item ID 포함)
 * @param {Object} res - 응답 객체 (삭제 후 장바구니 데이터 반환)
 * @returns {JSON} 삭제 성공 또는 실패 메시지
 */
cartController.deleteCartItem = async (req, res) => {
   try {
      const { id } = req.params;
      const { userId } = req;

      const updatedCart = await cartService.deleteCartItem(userId, id);

      return res.status(StatusCodes.OK).json({
         status: 'success',
         cartItemQty: updatedCart.items.length,
      });
   } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({
         status: 'fail',
         error: error.message,
      });
   }
};

/**
 * 장바구니 총 상품 수량 조회 API
 * @route GET /cart/qty
 * @param {Object} req - 요청 객체 (로그인된 사용자 정보 포함)
 * @param {Object} res - 응답 객체 (장바구니 내 상품 개수 반환)
 * @returns {JSON} 상품 개수 또는 오류 메시지 반환
 */
cartController.getCartQty = async (req, res) => {
   try {
      const { userId } = req;
      const qty = await cartService.getCartQuantity(userId);
      return res.status(StatusCodes.OK).json({ status: 'success', qty });
   } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({
         status: 'fail',
         error: error.message,
      });
   }
};

/**
 * 장바구니 아이템 수량 수정 API
 * @route PATCH /cart/:id
 * @param {Object} req - 요청 객체 (params에 수정할 상품 ID 포함, body에 qty 포함)
 * @param {Object} res - 응답 객체 (수정된 장바구니 데이터 반환)
 * @returns {JSON} 수정된 장바구니 데이터 또는 오류 메시지
 */
cartController.editCartItem = async (req, res) => {
   try {
      const { userId } = req;
      const { id } = req.params;
      const { qty } = req.body;

      const updatedItems = await cartService.updateCartItemQuantity(userId, id, qty);

      return res.status(StatusCodes.OK).json({
         status: 'success',
         data: updatedItems,
      });
   } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({
         status: 'fail',
         error: error.message,
      });
   }
};

module.exports = cartController;
