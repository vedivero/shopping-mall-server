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
      const { user, token } = await authService.loginWithEmail(email, password);
      res.status(StatusCodes.OK).json({ user, token });
   } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
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
      res.status(StatusCodes.OK).json({ status: 'success', user, sessionToken });
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

module.exports = authController;
