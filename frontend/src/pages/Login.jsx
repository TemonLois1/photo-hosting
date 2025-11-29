// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';
import { api } from '../utils/api';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Заполните все поля');
      setLoading(false);
      return;
    }

    try {
      const response = await api.login({
        email,
        password
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
      setError(err.response?.data?.message || 'Ошибка при входе. Проверьте учетные данные.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">🔐 Вход</h1>
            <p className="auth-subtitle">Добро пожаловать обратно в ImageHost</p>
          </div>

          {error && (
            <div className="auth-error">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
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
            </div>

            <button
              type="submit"
              className="auth-btn primary"
              disabled={loading}
            >
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Нет аккаунта? <Link to="/register" className="auth-link">Зарегистрируйтесь</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
