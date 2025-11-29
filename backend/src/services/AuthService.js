// backend/src/services/AuthService.js
// Сервис аутентификации с использованием моделей БД

const { User } = require('../models');
const jwt = require('jsonwebtoken');

class AuthService {
  /**
   * Регистрация нового пользователя
   */
  static async register(userData) {
    try {
      // Проверить, существует ли уже пользователь
      const existingUser = await User.findOne({
        where: {
          [require('sequelize').Op.or]: [
            { email: userData.email },
            { username: userData.username }
          ]
        }
      });

      if (existingUser) {
        throw new Error('User with this email or username already exists');
      }

      // Создать нового пользователя
      // (Пароль автоматически будет захеширован благодаря beforeCreate хуку)
      const user = await User.create({
        username: userData.username,
        email: userData.email,
        password: userData.password
      });

      // Вернуть пользователя без пароля
      return this._formatUserResponse(user);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Вход пользователя
   */
  static async login(email, password) {
    try {
      // Найти пользователя по email
      const user = await User.findOne({ where: { email } });

      if (!user) {
        throw new Error('User not found');
      }

      // Проверить пароль (используется метод модели)
      const isPasswordValid = await user.validatePassword(password);

      if (!isPasswordValid) {
        throw new Error('Invalid password');
      }

      // Генерировать JWT токены
      const tokens = this._generateTokens(user);

      return {
        user: this._formatUserResponse(user),
        tokens: tokens
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Получить пользователя по ID
   */
  static async getUserById(userId) {
    try {
      const user = await User.findByPk(userId, {
        attributes: { exclude: ['password'] }
      });

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Получить профиль пользователя с его постами и подписками
   */
  static async getUserProfile(userId) {
    try {
      const user = await User.findByPk(userId, {
        attributes: { exclude: ['password'] },
        include: [
          { association: 'posts', attributes: ['id', 'title', 'imageUrl', 'thumbnail'] },
          { association: 'followers', attributes: ['id'] },
          { association: 'following', attributes: ['id'] }
        ]
      });

      if (!user) {
        throw new Error('User not found');
      }

      return {
        ...user.toJSON(),
        postCount: user.posts.length,
        followerCount: user.followers.length,
        followingCount: user.following.length
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Обновить профиль пользователя
   */
  static async updateProfile(userId, updateData) {
    try {
      const user = await User.findByPk(userId);

      if (!user) {
        throw new Error('User not found');
      }

      // Обновить безопасные поля
      const allowedFields = ['bio', 'profileImage'];
      const safeUpdateData = {};

      allowedFields.forEach(field => {
        if (updateData[field] !== undefined) {
          safeUpdateData[field] = updateData[field];
        }
      });

      await user.update(safeUpdateData);

      return this._formatUserResponse(user);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Верифицировать JWT токен
   */
  static verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  /**
   * Обновить токен
   */
  static refreshToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      
      // Генерировать новый accessToken
      const newAccessToken = jwt.sign(
        { id: decoded.id, email: decoded.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
      );

      return { accessToken: newAccessToken };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  /**
   * HELPER: Генерировать JWT токены
   */
  static _generateTokens(user) {
    const payload = { id: user.id, email: user.email };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || '24h'
    });

    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d'
    });

    return { accessToken, refreshToken };
  }

  /**
   * HELPER: Форматировать ответ пользователя
   */
  static _formatUserResponse(user) {
    const userData = user.toJSON();
    delete userData.password;
    return userData;
  }
}

module.exports = AuthService;
