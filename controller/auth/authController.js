const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const authService = require('../../services/auth/authService');
const dotenv = require('dotenv');
dotenv.config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const authController = {};

/**
 * 이메일 로그인 API
 * @route POST /auth/login
 */
authController.loginWithEmail = async (req, res) => {
   try {
      const { email, password } = req.body;
      const result = await authService.loginWithEmail(email, password);

      if (result.status === 401) {
         return res.status(StatusCodes.UNAUTHORIZED).json({ status: result.status, message: result.message });
      }
      if (result.status === 400) {
         return res.status(StatusCodes.BAD_REQUEST).json({ status: result.status, message: result.message });
      }

      res.status(StatusCodes.OK).json({ status: result.status, user: result.user, token: result.token });
   } catch (error) {
      console.error('❌ 서버 오류:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: '서버 오류가 발생했습니다.' });
   }
};

/**
 * 구글 로그인 API
 * @route POST /auth/google
 */
authController.loginWithGoogle = async (req, res) => {
   try {
      const { token } = req.body;
      const { user, sessionToken } = await authService.googleLogin(token);
      res.status(StatusCodes.OK).json({ status: 'success', user, token: sessionToken });
   } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
   }
};

/**
 * 토큰 검증 API
 * @route GET /auth/me
 */
authController.authenticate = async (req, res, next) => {
   try {
      const tokenString = req.headers.authorization;
      if (!tokenString) throw new Error('토큰을 찾을 수 없습니다.');
      const token = tokenString.replace('Bearer ', '');
      jwt.verify(token, JWT_SECRET_KEY, (error, payload) => {
         if (error) throw new Error('토큰이 유효하지 않습니다.');
         req.userId = payload._id;
      });
      next();
   } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ status: 'fail', message: error.message });
   }
};

/**
 * 사용자 권한 체크 함수
 *
 */
authController.checkAdminPermission = async (req, res, next) => {
   try {
      await authService.verifyAdminPermission(req.userId);
      next();
   } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ status: 'fail', message: error.message });
   }
};

/**
 * 이메일 인증 API
 * @route GET /auth/verify/email
 */
authController.verifyEmail = async (req, res) => {
   try {
      const token = req.query.token || req.body.token;
      if (!token) throw new Error('인증 토큰이 없습니다.');

      const result = await authService.verifyEmail(token);

      res.send(`
         <h2>이메일 인증 완료</h2>
         <p>${result.message}</p>
         <a href="http://localhost:3000/login">로그인 페이지로 이동</a>
      `);
   } catch (error) {
      res.status(400).send(`
         <h2>이메일 인증 실패</h2>
         <p>${error.message}</p>
      `);
   }
};

module.exports = authController;
