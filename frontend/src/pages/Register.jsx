// src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';
import { api } from '../utils/api';

function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    if (!username || !email || !password || !confirmPassword) {
      setError('Заполните все поля');
      return false;
    }
    if (username.length < 3) {
      setError('Имя пользователя должно быть не менее 3 символов');
      return false;
    }
    if (password.length < 6) {
      setError('Пароль должен быть не менее 6 символов');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await api.register({
        username,
        email,
        password,
        confirmPassword
      });

      // Extract tokens and user from response
      const { accessToken, refreshToken } = response.data.data.tokens;
      const { user } = response.data.data;

      // Сохраняем токен
      localStorage.setItem('authToken', accessToken);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
      localStorage.setItem('currentUser', JSON.stringify(user));

      // Перенаправляем на главную
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">🚀 Регистрация</h1>
            <p className="auth-subtitle">Присоединяйтесь к ImageHost</p>
          </div>

          {error && (
            <div className="auth-error">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="username" className="form-label">Имя пользователя</label>
              <input
                id="username"
                type="text"
                className="form-input"
                placeholder="your_username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                required
              />
              {username && username.length < 3 && (
                <p className="form-hint">Минимум 3 символа</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">Электронная почта</label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Пароль</label>
              <div className="password-wrapper">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {password && password.length < 6 && (
                <p className="form-hint">Минимум 6 символов</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">Подтвердите пароль</label>
              <div className="password-wrapper">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="form-hint">Пароли не совпадают</p>
              )}
            </div>

            <button
              type="submit"
              className="auth-btn primary"
              disabled={loading}
            >
              {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Уже есть аккаунт? <Link to="/login" className="auth-link">Войдите</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
