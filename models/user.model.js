const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const userSchema = Schema(
   {
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      name: { type: String, required: true },
      level: { type: String, default: 'customer' }, //user level=admin,customer
      verify: { type: Boolean, default: false },
   },
   { timestamp: true },
);

userSchema.methods.generateToken = function () {
   const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
   const token = jwt.sign({ _id: this._id }, JWT_SECRET_KEY, { expiresIn: '1d' });
   return token;
};

userSchema.methods.toJSON = function () {
   const obj = this._doc;
   delete obj.password;
   delete obj.__v;
   delete obj.updateAt;
   return obj;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
