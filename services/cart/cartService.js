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
   console.log(cart);
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
         console.log('장바구니 데이터 없음:', userId);
         return null;
      }

      return cart;
   } catch (error) {
      throw new Error('장바구니 조회 실패: ' + error.message);
   }
};

module.exports = { addItemToCart, getCartByUserId };
