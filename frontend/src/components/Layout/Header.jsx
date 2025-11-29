// src/components/Layout/Header.jsx - Компонент Header

import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          🖼️ ImageHost
        </Link>
        
        <nav className="nav">
          <Link to="/">Главная</Link>
          <Link to="/upload">Загрузить</Link>
          <Link to="/search">Поиск</Link>
          <Link to="/collections">Коллекции</Link>
        </nav>

        <div className="header-actions">
          <Link to="/editor" className="btn btn-primary">
            Редактор
          </Link>
          <Link to="/user/profile" className="btn btn-secondary">
            Профиль
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
