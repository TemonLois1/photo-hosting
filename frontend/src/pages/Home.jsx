// src/pages/Home.jsx - Домашняя страница / Лента

import React, { useState, useEffect, useCallback } from 'react';
import './Home.modern.css';
import { api } from '../utils/api';

const MOCK_IMAGES = [
  'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=800&q=80', // Nature
  'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=800&q=80', // Architecture
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80', // Tech
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80', // Portrait
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80', // Travel
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80', // Food
  'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=800&q=80', // Landscape
  'https://images.unsplash.com/photo-1517816168141-54196e32d136?auto=format&fit=crop&w=800&q=80', // Street
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80', // Beach
  'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?auto=format&fit=crop&w=800&q=80', // Breakfast
  'https://images.unsplash.com/photo-1501854140884-074cf2b2c3af?auto=format&fit=crop&w=800&q=80', // Nature 2
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80', // Fog
];

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
      // Backend returns { success: true, data: [...] }
      const postsData = response.data.data;
      setPosts(Array.isArray(postsData) ? postsData : []);
    } catch (err) {
      console.error('Ошибка при загрузке постов:', err);
      setError('Не удалось загрузить посты. Используются примеры данных.');
      // Используем mock данные если произойдёт ошибка
      setPosts(Array(12).fill(null).map((_, i) => ({
        id: i + 1,
        title: `Вдохновение #${i + 1}`,
        author: 'Фотограф',
        views: Math.floor(Math.random() * 10000),
        likes: Math.floor(Math.random() * 5000),
        image: MOCK_IMAGES[i % MOCK_IMAGES.length],
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
        <div className="hero-background-image" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80')` }}></div>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="hero-title-highlight">ImageHost</span>
            <br />
            Ваш мир в фокусе
          </h1>
          <p className="hero-subtitle">
            Загружайте, делитесь и находите вдохновение в миллионах фотографий со всего мира.
          </p>
          <div className="hero-actions">
            <a href="/upload" className="hero-cta-btn primary">
              Загрузить фото
            </a>
            <a href="/search" className="hero-cta-btn secondary">
              Найти вдохновение
            </a>
          </div>
        </div>
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
                    src={post.image || MOCK_IMAGES[post.id % MOCK_IMAGES.length]} 
                    alt={post.title}
                    className="card-image"
                    loading="lazy"
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
