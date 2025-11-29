// src/pages/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="container" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
      <h1>404</h1>
      <h2>Страница не найдена</h2>
      <p>Извините, страница, которую вы ищете, не существует.</p>
      <Link to="/" className="btn btn-primary" style={{ marginTop: '2rem' }}>
        Вернуться на главную
      </Link>
    </div>
  );
}

export default NotFound;
