// src/components/Layout/Footer.jsx - Компонент Footer

import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4>О сервисе</h4>
          <ul>
            <li><a href="/">Главная</a></li>
            <li><a href="/about">О нас</a></li>
            <li><a href="/contact">Контакты</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Справка</h4>
          <ul>
            <li><a href="/help">Помощь</a></li>
            <li><a href="/faq">FAQ</a></li>
            <li><a href="/blog">Блог</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Правовая информация</h4>
          <ul>
            <li><a href="/privacy">Политика приватности</a></li>
            <li><a href="/terms">Условия использования</a></li>
            <li><a href="/cookies">Cookies</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Социальные сети</h4>
          <ul>
            <li><a href="#">Twitter</a></li>
            <li><a href="#">Discord</a></li>
            <li><a href="#">GitHub</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 ImageHost. Все права защищены.</p>
      </div>
    </footer>
  );
}

export default Footer;
