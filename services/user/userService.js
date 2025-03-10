const User = require('../../models/user.model');
const bcrypt = require('bcryptjs');

/**
 * 새로운 사용자를 생성하는 서비스 함수
 * @param {Object} userData 사용자 데이터 (email, password, name)
 * @returns {Object} 생성된 사용자 객체
 * @throws {Error} 이메일 중복 시 오류 발생
 */
const createUser = async (userData) => {
   const { email, password, name, level } = userData;

   const existingUser = await User.findOne({ email });
   if (existingUser) {
      throw new Error('이미 존재하는 이메일입니다.');
   }

   const salt = await bcrypt.genSaltSync(10);
   const hashedPassword = await bcrypt.hash(password, salt);

   const newUser = new User({
      email,
      password: hashedPassword,
      name,
      level: level ? level : 'customer',
   });
   await newUser.save();
};

module.exports = { createUser };
