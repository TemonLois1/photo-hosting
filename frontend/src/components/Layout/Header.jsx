// src/components/Layout/Header.jsx - Компонент Header

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.modern.css';

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
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
          <Link to="/upload" className="nav-link" onClick={closeMobileMenu}>
            Загрузить
          </Link>
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
          <Link 
            to="/editor" 
            className="header-action-btn editor-btn"
            title="Редактор"
            onClick={closeMobileMenu}
          >
            ✏️
          </Link>
          <Link 
            to="/user/profile" 
            className="header-action-btn profile-btn"
            title="Профиль"
            onClick={closeMobileMenu}
          >
            👤
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
