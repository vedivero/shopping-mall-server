const { StatusCodes } = require('http-status-codes');
const authService = require('../../services/auth/authService');

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

module.exports = authController;
