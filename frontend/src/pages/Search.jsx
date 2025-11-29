// src/pages/Search.jsx
import React, { useState, useEffect } from 'react';
import './Search.modern.css';
import { api } from '../utils/api';

function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('relevant');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const filters = ['all', 'photos', 'users', 'tags', 'collections'];

  const performSearch = async () => {
    setLoading(true);
    try {
      const response = await api.search({
        query: searchQuery,
        type: activeFilter !== 'all' ? activeFilter : undefined,
        sort: sortBy,
        limit: 20
      });
      // Backend returns { success: true, data: { posts: [], users: [], tags: [] } }
      // We need to extract the array based on the filter or just combine them
      const searchData = response.data.data;
      const resultsList = Array.isArray(searchData) ? searchData : (searchData.posts || []);
      setResults(resultsList);
    } catch (err) {
      console.error('Ошибка при поиске:', err);
      setResults(Array(6).fill(null).map((_, i) => ({
        id: i + 1,
        title: `Результат: ${searchQuery} ${i + 1}`,
        description: 'Описание результата',
        author: 'Автор',
        views: Math.floor(Math.random() * 10000),
        likes: Math.floor(Math.random() * 5000),
        image: `https://images.unsplash.com/photo-${[
          '1492691527719-9d1e07e534b4',
          '1500462918059-b1a0cb512f1d',
          '1506744038136-46273834b3fb',
          '1470071459604-3b5ec3a7fe05',
          '1441974231531-c6227db76b6e',
          '1472214103451-9374bd1c798e'
        ][i % 6]}?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80`,
        tags: ['природа', 'пейзаж', 'закат'],
      })));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery.trim()) {
      performSearch();
    } else {
      setResults([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, activeFilter, sortBy]);

  return (
    <div className="search-page">
      <div className="search-container">
        <div className="search-header">
          <h1 className="search-title">🔍 Поиск фотографий</h1>
          <div className="search-bar-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-bar"
              placeholder="Поиск по названиям, тегам, авторам..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            {searchQuery && (
              <button className="search-clear" onClick={() => setSearchQuery('')}>
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="search-filters">
          {filters.map(filter => (
            <button
              key={filter}
              className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter === 'all' && '✓ Все'}
              {filter === 'photos' && '📷 Фото'}
              {filter === 'users' && '👤 Пользователи'}
              {filter === 'tags' && '🏷️ Теги'}
              {filter === 'collections' && '📚 Коллекции'}
            </button>
          ))}
        </div>

        {searchQuery ? (
          <>
            <div className="search-results-header">
              <span className="results-count">
                Найдено: {loading ? '...' : results.length}
              </span>
              <div className="results-sort">
                <label htmlFor="sort">Сортировка:</label>
                <select
                  id="sort"
                  className="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="relevant">По релевантности</option>
                  <option value="popular">По популярности</option>
                  <option value="recent">По дате</option>
                  <option value="trending">Трендовые</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>Поиск...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="search-results">
                {results.map(result => (
                  <article key={result.id} className="result-card">
                    <img
                      src={result.image}
                      alt={result.title}
                      className="result-image"
                    />
                    <div className="result-content">
                      <h3 className="result-title">{result.title}</h3>
                      <div className="result-meta">
                        <span>👁️ {result.views || 0}</span>
                        <span>❤️ {result.likes || 0}</span>
                      </div>
                      {result.tags && result.tags.length > 0 && (
                        <div className="result-tags">
                          {result.tags.map(tag => (
                            <span key={tag} className="result-tag">{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="search-empty">
                <div className="empty-icon">🔍</div>
                <h3 className="empty-title">Результаты не найдены</h3>
                <p className="empty-subtitle">Попробуйте другой поисковый запрос</p>
              </div>
            )}
          </>
        ) : (
          <div className="search-empty">
            <div className="empty-icon">🔍</div>
            <h3 className="empty-title">Начните поиск</h3>
            <p className="empty-subtitle">Введите название фотографии, тег или имя пользователя</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
