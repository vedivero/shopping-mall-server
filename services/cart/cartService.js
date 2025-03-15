const Cart = require('../../models/cart.model');
const mongoose = require('mongoose');
/**
 * 장바구니에 상품 추가
 * @route POST /cart/
 * @param {Object} data - 사용자 ID, 상품 ID, 사이즈, 수량 정보
 * @returns {Object} 업데이트된 장바구니 데이터
 */
const addItemToCart = async (data) => {
   const { userId, productId, size, qty = 1 } = data;

   let cart = await Cart.findOne({ userId });

   if (!cart) {
      cart = new Cart({ userId, items: [] });
   }

   const existItem = cart.items.find((item) => item.productId.equals(productId) && item.size === size);

   if (existItem) {
      existItem.qty += qty;
   } else {
      cart.items.push({ productId, size, qty });
   }

   await cart.save();
   return cart;
};

/**
 * 장바구니 조회 서비스
 * @param {Object} userId - 사용자의 고유 ID
 * @returns {Object} 장바구니 정보 (cart)
 */
const getCartByUserId = async (userId) => {
   try {
      const objectId = new mongoose.Types.ObjectId(userId);
      const cart = await Cart.findOne({ userId: objectId }).populate({
         path: 'items',
         populate: {
            path: 'productId',
            model: 'Product',
         },
      });

      if (!cart) {
         return null;
      }

      return cart;
   } catch (error) {
      throw new Error('장바구니 조회 실패: ' + error.message);
   }
};

/**
 * 장바구니에서 특정 아이템 삭제
 * @param {String} userId - 사용자 ID
 * @param {String} itemId - 삭제할 상품 ID
 * @returns {Object} 업데이트된 장바구니 객체
 */
const deleteCartItem = async (userId, itemId) => {
   const cart = await Cart.findOne({ userId });
   if (!cart) {
      throw new Error('장바구니를 찾을 수 없습니다.');
   }
   cart.items = cart.items.filter((item) => !item._id.equals(itemId));
   await cart.save();

   return cart;
};

/**
 * 사용자의 장바구니에 있는 총 상품 수량 조회
 * @param {String} userId - 사용자 ID
 * @returns {Number} 장바구니 내 총 상품 개수
 */
const getCartQuantity = async (userId) => {
   const cart = await Cart.findOne({ userId });
   if (!cart) return 0;
   return cart.items.length;
};

/**
 * 장바구니 아이템 수량 변경
 * @param {String} userId - 사용자 ID
 * @param {String} itemId - 변경할 상품 ID
 * @param {Number} qty - 변경할 수량
 * @returns {Array} 업데이트된 장바구니 아이템 목록
 */
const updateCartItemQuantity = async (userId, itemId, qty) => {
   const cart = await Cart.findOne({ userId }).populate({
      path: 'items',
      populate: { path: 'productId', model: 'Product' },
   });

   if (!cart) {
      throw new Error('There is no cart for this user');
   }

   const index = cart.items.findIndex((item) => item._id.equals(itemId));
   if (index === -1) {
      throw new Error('Cannot find item in the cart');
   }

   cart.items[index].qty = qty;

   await cart.save();

   return cart.items;
};

module.exports = { addItemToCart, getCartByUserId, deleteCartItem, getCartQuantity, updateCartItemQuantity };
