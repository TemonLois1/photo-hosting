// backend/src/controllers/AuthController.js
// Контроллер для обработки аутентификации

const AuthService = require('../services/AuthService');

class AuthController {
  /**
   * POST /api/auth/register
   * Регистрация нового пользователя
   */
  static async register(req, res, next) {
    try {
      const { username, email, password, confirmPassword } = req.body;

      // Валидация
      if (!username || !email || !password) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Username, email and password are required'
          }
        });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Passwords do not match'
          }
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Password must be at least 6 characters'
          }
        });
      }

      // Регистрация
      const user = await AuthService.register({
        username,
        email,
        password
      });

      res.status(201).json({
        success: true,
        data: {
          user: user
        }
      });
    } catch (error) {
      if (error.message.includes('already exists')) {
        return res.status(409).json({
          success: false,
          error: {
            code: 'USER_EXISTS',
            message: error.message
          }
        });
      }
      next(error);
    }
  }

  /**
   * POST /api/auth/login
   * Вход пользователя
   */
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // Валидация
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Email and password are required'
          }
        });
      }

      // Вход
      const { user, tokens } = await AuthService.login(email, password);

      // Установить refresh token в secure cookie
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 дней
      });

      res.json({
        success: true,
        data: {
          user: user,
          tokens: {
            accessToken: tokens.accessToken
          }
        }
      });
    } catch (error) {
      if (error.message.includes('not found') || error.message.includes('Invalid password')) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'AUTH_FAILED',
            message: 'Invalid email or password'
          }
        });
      }
      next(error);
    }
  }

  /**
   * POST /api/auth/logout
   * Выход пользователя
   */
  static async logout(req, res) {
    // Очистить refresh token cookie
    res.clearCookie('refreshToken');

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  }

  /**
   * POST /api/auth/refresh
   * Обновить access token
   */
  static async refresh(req, res, next) {
    try {
      const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'NO_REFRESH_TOKEN',
            message: 'Refresh token is required'
          }
        });
      }

      const { accessToken } = AuthService.refreshToken(refreshToken);

      res.json({
        success: true,
        data: {
          accessToken: accessToken
        }
      });
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_REFRESH_TOKEN',
          message: 'Invalid refresh token'
        }
      });
    }
  }

  /**
   * GET /api/auth/me
   * Получить текущего пользователя
   */
  static async getCurrentUser(req, res, next) {
    try {
      const userId = req.user.id; // Из JWT middleware
      const user = await AuthService.getUserById(userId);

      res.json({
        success: true,
        data: {
          user: user
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/auth/profile/:userId
   * Получить профиль пользователя
   */
  static async getUserProfile(req, res, next) {
    try {
      const { userId } = req.params;
      const profile = await AuthService.getUserProfile(userId);

      res.json({
        success: true,
        data: {
          profile: profile
        }
      });
    } catch (error) {
      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User not found'
          }
        });
      }
      next(error);
    }
  }

  /**
   * PUT /api/auth/profile
   * Обновить профиль
   */
  static async updateProfile(req, res, next) {
    try {
      const userId = req.user.id; // Из JWT middleware
      const { bio, profileImage } = req.body;

      const updatedUser = await AuthService.updateProfile(userId, {
        bio,
        profileImage
      });

      res.json({
        success: true,
        data: {
          user: updatedUser
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/verify-email
   * Верифицировать email (заглушка для будущей реализации)
   */
  static async verifyEmail(req, res) {
    res.json({
      success: true,
      message: 'Email verification - coming soon'
    });
  }
}

module.exports = AuthController;
