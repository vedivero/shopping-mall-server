const bcrypt = require('bcryptjs');
const User = require('../../models/user.model');
const dotenv = require('dotenv');
dotenv.config();
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const { OAuth2Client } = require('google-auth-library');

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

   const token = await user.generateToken();

   return { user, token };
};

/**
 * 구글 로그인 처리 서비스
 * @param {string} token - 클라이언트에서 전달한 구글 ID 토큰
 * @returns {string} sessionToken - 생성된 사용자 세션 토큰
 * @throws {Error} 인증 실패 또는 서버 오류 발생 시 예외 발생
 */
const googleLogin = async (token) => {
   const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);
   const ticket = await googleClient.verifyIdToken({ idToken: token, audience: GOOGLE_CLIENT_ID });
   const { email, name } = ticket.getPayload();

   let user = await User.findOne({ email });

   if (!user) {
      const randomPassword = Math.floor(Math.random() * 100000).toString();
      const salt = await bcrypt.genSalt(10);
      const newPassword = await bcrypt.hash(randomPassword, salt);

      user = await User.create({ email, name, password: newPassword });
   }

   return user.generateToken();
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

module.exports = { loginWithEmail, googleLogin, verifyAdminPermission };
