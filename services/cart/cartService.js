const Cart = require('../../models/cart.model');

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

module.exports = { addItemToCart };
