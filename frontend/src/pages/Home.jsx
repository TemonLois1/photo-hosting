// src/pages/Home.jsx - Домашняя страница / Лента

import React, { useState, useEffect } from 'react';
import './Home.css';

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // TODO: Загружать посты с API
    console.log('Загрузка постов...');
  }, []);

  return (
    <div className="home-container">
      <div className="hero">
        <h1>🖼️ ImageHost</h1>
        <p>Поделитесь вашими лучшими фотографиями с миром</p>
      </div>

      <div className="filters">
        <button className="filter-btn active">Популярные</button>
        <button className="filter-btn">Свежие</button>
        <button className="filter-btn">Случайные</button>
      </div>

      <div className="gallery">
        {loading ? (
          <p>Загрузка...</p>
        ) : posts.length === 0 ? (
          <p className="no-posts">Постов не найдено. Будьте первым!</p>
        ) : (
          <div className="image-grid">
            {/* Будут загружаться посты */}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
