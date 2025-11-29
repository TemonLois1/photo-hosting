// src/components/Layout/Header.jsx - Компонент Header

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.modern.css';

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('currentUser');
    setIsAuthenticated(!!token);
    if (user) {
      try {
        setCurrentUser(JSON.parse(user));
      } catch (e) {
        setCurrentUser(null);
      }
    }
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
    setIsAuthenticated(false);
    setCurrentUser(null);
    closeMobileMenu();
    navigate('/');
  };

  const handleLoginClick = () => {
    navigate('/login');
    closeMobileMenu();
  };

  const handleRegisterClick = () => {
    navigate('/register');
    closeMobileMenu();
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="header-logo" onClick={closeMobileMenu}>
          <span className="logo-icon">🖼️</span>
          <span className="logo-text">ImageHost</span>
        </Link>

        {/* Mobile Menu Button */}
        <button 
          className={`header-mobile-toggle ${mobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation */}
        <nav className={`header-nav ${mobileMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link" onClick={closeMobileMenu}>
            Главная
          </Link>
          {isAuthenticated && (
            <Link to="/upload" className="nav-link" onClick={closeMobileMenu}>
              Загрузить
            </Link>
          )}
          <Link to="/search" className="nav-link" onClick={closeMobileMenu}>
            Поиск
          </Link>
          <Link to="/collections" className="nav-link" onClick={closeMobileMenu}>
            Коллекции
          </Link>
        </nav>

        {/* Search Bar */}
        <div className="header-search">
          <input 
            type="text" 
            className="search-input" 
            placeholder="Поиск..." 
          />
          <button className="search-btn" aria-label="Search">
            🔍
          </button>
        </div>

        {/* Actions */}
        <div className="header-actions">
          {isAuthenticated && currentUser ? (
            <>
              <Link 
                to="/editor" 
                className="header-action-btn editor-btn"
                title="Редактор"
                onClick={closeMobileMenu}
              >
                ✏️
              </Link>
              <Link 
                to={`/user/${currentUser.username}`}
                className="header-action-btn profile-btn"
                title="Профиль"
                onClick={closeMobileMenu}
              >
                👤
              </Link>
              <button 
                className="auth-btn logout-btn"
                onClick={handleLogout}
              >
                Выход
              </button>
            </>
          ) : (
            <>
              <button 
                className="auth-btn signin-btn"
                onClick={handleLoginClick}
              >
                Вход
              </button>
              <button 
                className="auth-btn signup-btn"
                onClick={handleRegisterClick}
              >
                Регистрация
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
