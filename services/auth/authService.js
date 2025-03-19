const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/user.model');
const dotenv = require('dotenv');
dotenv.config();
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const { OAuth2Client } = require('google-auth-library');

/**
 * 이메일과 비밀번호로 로그인하는 서비스 함수
 * @param {String} email - 사용자의 이메일
 * @param {String} password - 사용자의 비밀번호
 * @returns {Object} 로그인된 사용자 정보 및 토큰
 * @throws {Error} 로그인 정보가 일치하지 않을 때
 */

const loginWithEmail = async (email, password) => {
   try {
      const user = await User.findOne({ email });
      if (!user) return { status: 400, message: '로그인 정보가 일치하지 않습니다.' };

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return { status: 400, message: '로그인 정보가 일치하지 않습니다.' };

      if (!user.verify) return { status: 401, message: '이메일 인증이 완료되지 않았습니다. ' };
      const token = await user.generateToken();

      return { status: 200, user, token };
   } catch (error) {
      console.error('이메일 로그인 서비스 오류:', error);
      throw error;
   }
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

   const sessionToken = user.generateToken();
   return { user, sessionToken };
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

/**
 * 이메일 인증 처리 서비스
 * @param {string} token - 이메일 인증 토큰
 * @returns {object} - 인증 완료 메시지
 * @throws {Error} - 인증 실패 시 예외 발생
 */
const verifyEmail = async (token) => {
   if (!token) throw new Error('인증 토큰이 없습니다.');

   // ✅ `jwt.verify` 실행 가능하도록 수정
   const decoded = jwt.verify(token, JWT_SECRET_KEY);
   const { email } = decoded;

   const user = await User.findOne({ email });
   if (!user) throw new Error('유효하지 않은 사용자입니다.');

   if (user.verify) throw new Error('이미 인증된 이메일입니다.');

   user.verify = true;
   await user.save();

   return { message: '이메일 인증이 완료되었습니다.', verified: true };
};

module.exports = { loginWithEmail, googleLogin, verifyAdminPermission, verifyEmail };
