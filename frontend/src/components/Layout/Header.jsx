// src/components/Layout/Header.jsx - Компонент Header

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.modern.css';

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
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

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="header-logo" onClick={closeMobileMenu}>
          <div className="logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
          </div>
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
          <Link to="/search" className="nav-link" onClick={closeMobileMenu}>
            Поиск
          </Link>
          <Link to="/collections" className="nav-link" onClick={closeMobileMenu}>
            Коллекции
          </Link>
          
          {/* Search Bar (Desktop) */}
          <div className="header-search">
            <button className="search-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </button>
            <input 
              type="text" 
              className="search-input" 
              placeholder="Поиск..." 
            />
          </div>

          {/* Auth / User Menu */}
          <div className="auth-buttons">
            {isAuthenticated && currentUser ? (
              <>
                <Link to="/upload" className="btn-register" onClick={closeMobileMenu} style={{ marginRight: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                  Загрузить
                </Link>
                
                <Link to={`/user/${currentUser.username}`} className="user-menu-btn" onClick={closeMobileMenu}>
                  <div className="user-avatar">
                    {currentUser.avatar ? (
                      <img src={currentUser.avatar} alt={currentUser.username} />
                    ) : (
                      <span>{currentUser.username[0].toUpperCase()}</span>
                    )}
                  </div>
                  <span className="user-name">{currentUser.username}</span>
                </Link>
                
                <button className="btn-login" onClick={handleLogout} title="Выход" style={{ padding: '8px', minWidth: 'auto' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                </button>
              </>
            ) : (
              <>
                <button className="btn-login" onClick={handleLoginClick}>
                  Вход
                </button>
                <button className="btn-register" onClick={handleRegisterClick}>
                  Регистрация
                </button>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
