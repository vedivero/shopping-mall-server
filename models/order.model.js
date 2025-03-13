const mongoose = require('mongoose');
const User = require('./user.model');
const Product = require('./product.model');
const Cart = require('./cart.model');
const Schema = mongoose.Schema;
const orderSchema = Schema(
   {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      status: { type: String, default: 'preparing' },
      totalPrice: { type: Number, required: true, default: 0 },
      shipTo: { type: Object, required: true },
      contact: { type: Object, required: true },
      orderNum: { type: String },
      items: [
         {
            productId: { type: mongoose.ObjectId, ref: Product, required: true },
            price: { type: Number, required: true },
            qty: { type: Number, required: true, default: 1 },
            size: { type: String, required: true },
         },
      ],
   },
   { timestamps: true },
);
orderSchema.methods.toJSON = function () {
   const obj = this._doc;
   delete obj.__v;
   delete obj.updatedAt;
   return obj;
};

orderSchema.post('save', async function () {
   const cart = await Cart.findOne({ userId: this.userId });
   cart.items = [];
   await cart.save();
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
