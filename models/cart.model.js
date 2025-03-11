const mongoose = require('mongoose');
const Product = require('./product.model');
const User = require('./user.model');
const Schema = mongoose.Schema;
const CartSchema = Schema(
   {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      items: [
         {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            size: { type: String, required: true },
            qty: { type: Number, default: 1 },
         },
      ],
      isDeleted: { type: Boolean, default: false },
   },
   { timestamps: true },
);

CartSchema.method.toJSON = function () {
   const obj = this._doc;
   delete obj.__v;
   delete obj.updateAt;
   return obj;
};

const Cart = mongoose.model('Cart', CartSchema);
module.exports = Cart;
