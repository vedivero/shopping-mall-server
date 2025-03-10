const bcrypt = require('bcryptjs');
const User = require('../../models/user.model');

/**
 * 이메일과 비밀번호로 로그인하는 서비스 함수
 * @param {String} email - 사용자의 이메일
 * @param {String} password - 사용자의 비밀번호
 * @returns {Object} 로그인된 사용자 정보 및 토큰
 * @throws {Error} 로그인 정보가 일치하지 않을 때
 */

const loginWithEmail = async (email, password) => {
   const user = await User.findOne({ email });
   if (!user) {
      throw new Error('로그인 정보가 일치하지 않습니다.');
   }

   const isMatch = await bcrypt.compare(password, user.password);
   if (!isMatch) {
      throw new Error('로그인 정보가 일치하지 않습니다.');
   }

   // generateToken 메서드 호출
   const token = await user.generateToken();

   return { user, token };
};

/**
 * 관리자 권한 검증 서비스 함수
 * @param {String} userId 사용자 ID
 * @throws {Error} 사용자가 관리자가 아닌 경우
 */
const verifyAdminPermission = async (userId) => {
   const user = await User.findById(userId);
   if (!user || user.level !== 'admin') {
      throw new Error('관리자 권한이 필요합니다.');
   }
};

module.exports = { loginWithEmail, verifyAdminPermission };
