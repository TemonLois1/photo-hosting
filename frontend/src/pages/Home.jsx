// src/pages/Home.jsx - Домашняя страница / Лента

import React, { useState, useEffect, useCallback } from 'react';
import './Home.modern.css';
import { api } from '../utils/api';

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('popular');
  const [error, setError] = useState('');

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.getPosts({
        sort: activeFilter,
        limit: 12,
        offset: 0
      });
      setPosts(response.data || []);
    } catch (err) {
      console.error('Ошибка при загрузке постов:', err);
      setError('Не удалось загрузить посты. Используются примеры данных.');
      // Используем mock данные если произойдёт ошибка
      setPosts(Array(12).fill(null).map((_, i) => ({
        id: i + 1,
        title: `Фотография ${i + 1}`,
        author: 'Автор',
        views: Math.floor(Math.random() * 10000),
        likes: Math.floor(Math.random() * 5000),
        image: `https://picsum.photos/300/300?random=${i}`,
      })));
    } finally {
      setLoading(false);
    }
  }, [activeFilter]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">🖼️ ImageHost</h1>
          <p className="hero-subtitle">
            Поделитесь вашими лучшими фотографиями с миром
          </p>
          <a href="/upload" className="hero-cta-btn">
            Загрузить фото
          </a>
        </div>
        <div className="hero-background"></div>
      </section>

      {/* Gallery Section */}
      <div className="gallery-header-wrapper">
        <div className="gallery-header">
          <h2 className="gallery-title">Популярные фотографии</h2>
          
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${activeFilter === 'popular' ? 'active' : ''}`}
              onClick={() => setActiveFilter('popular')}
            >
              ⭐ Популярные
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'recent' ? 'active' : ''}`}
              onClick={() => setActiveFilter('recent')}
            >
              🆕 Свежие
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'trending' ? 'active' : ''}`}
              onClick={() => setActiveFilter('trending')}
            >
              🔥 Трендовые
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'random' ? 'active' : ''}`}
              onClick={() => setActiveFilter('random')}
            >
              🎲 Случайные
            </button>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="gallery-section">
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Загрузка фотографий...</p>
          </div>
        ) : error && posts.length === 0 ? (
          <div className="empty-gallery">
            <div className="empty-icon">⚠️</div>
            <h3>{error}</h3>
            <p>Попробуйте перезагрузить страницу</p>
            <button 
              className="empty-cta-btn"
              onClick={() => loadPosts()}
            >
              Повторить
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="empty-gallery">
            <div className="empty-icon">🖼️</div>
            <h3>Нет фотографий</h3>
            <p>Будьте первым, кто загрузит фотографию!</p>
            <a href="/upload" className="empty-cta-btn">
              Загрузить фото
            </a>
          </div>
        ) : (
          <div className="gallery-grid">
            {posts.map((post) => (
              <article key={post.id} className="gallery-card">
                <div className="card-image-container">
                  <img 
                    src={post.image || `https://picsum.photos/300/300?random=${post.id}`} 
                    alt={post.title}
                    className="card-image"
                  />
                  <div className="card-overlay">
                    <div className="overlay-stats">
                      <div className="stat">
                        <span className="stat-icon">👁️</span>
                        <span className="stat-value">{(post.views || 0).toLocaleString()}</span>
                      </div>
                      <div className="stat">
                        <span className="stat-icon">❤️</span>
                        <span className="stat-value">{(post.likes || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-content">
                  <h3 className="card-title">{post.title}</h3>
                  <p className="card-author">Автор: {post.author}</p>
                  <a href={`/post/${post.id}`} className="card-link">
                    Смотреть →
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Готовы поделиться своей фотографией?</h2>
        <p>Загрузите свою первую фото прямо сейчас</p>
        <a href="/upload" className="cta-button">
          Начать загрузку
        </a>
      </section>
    </div>
  );
}

export default Home;
