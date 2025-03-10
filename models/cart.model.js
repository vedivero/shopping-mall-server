const mongoose = require('mongoose');
const Product = require('./product.model');
const User = require('./user.model');
const Schema = mongoose.Schema;
const CartSchema = Schema(
   {
      userId: { type: mongoose.ObjectId, ref: User },
      items: [
         {
            productId: { type: mongoose.ObjectId, ref: Product },
            size: { type: String, required: true },
            qty: { type: Number, default: 1 },
         },
      ],
      isDeleted: { type: Boolean, default: false },
   },
   { timestamp: true },
);

CartSchema.method.toJSON = () => {
   const obj = this._doc;
   delete obj.__v;
   delete obj.updateAt;
   return obj;
};

const Cart = mongoose.model('Cart', CartSchema);
module.exports = Cart;
