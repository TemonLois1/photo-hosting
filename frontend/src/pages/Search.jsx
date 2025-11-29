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
  const [error, setError] = useState('');

  const filters = ['all', 'photos', 'users', 'tags', 'collections'];

  useEffect(() => {
    if (searchQuery.trim()) {
      performSearch();
    } else {
      setResults([]);
    }
  }, [searchQuery, activeFilter, sortBy]);

  const performSearch = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.search({
        query: searchQuery,
        type: activeFilter !== 'all' ? activeFilter : undefined,
        sort: sortBy,
        limit: 20
      });
      setResults(response.data || []);
    } catch (err) {
      console.error('Ошибка при поиске:', err);
      setError('Ошибка при поиске. Используются примеры результатов.');
      // Mock результаты при ошибке
      setResults(Array(20).fill(null).map((_, i) => ({
        id: i + 1,
        title: `Результат поиска: ${searchQuery} ${i + 1}`,
        description: 'Описание результата поиска',
        author: 'Автор',
        views: Math.floor(Math.random() * 10000),
        likes: Math.floor(Math.random() * 5000),
        image: `https://picsum.photos/300/300?random=${i}`,
        tags: ['природа', 'пейзаж', 'закат'],
      })));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClear = () => {
    setSearchQuery('');
  };

  return (
    <div className="search-page">
      <div className="search-container">
        {/* Search Header */}
        <div className="search-header">
          <h1 className="search-title">🔍 Поиск фотографий</h1>

          <div className="search-bar-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-bar"
              placeholder="Поиск по названиям, тегам, авторам..."
              value={searchQuery}
              onChange={handleSearch}
              autoFocus
            />
            {searchQuery && (
              <button className="search-clear" onClick={handleClear}>
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
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
            {/* Results Header */}
            <div className="search-results-header">
              <span className="results-count">
                Найдено результатов: {loading ? '...' : results.length}
              </span>
              <div className="results-sort">
                <label htmlFor="sort">Сортировать:</label>
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

            {/* Results Grid */}
            {loading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>Поиск...</p>
              </div>
            ) : error && results.length === 0 ? (
              <div className="error-message" style={{ padding: '40px', textAlign: 'center' }}>
                ⚠️ {error}
              </div>
            ) : results.length > 0 ? (
              <div className="search-results">
                {results.map(result => (
                  <article key={result.id} className="result-card">
                    <img
                      src={result.image || `https://picsum.photos/300/300?random=${result.id}`}
                      alt={result.title}
                      className="result-image"
                    />
                    <div className="result-content">
                      <h3 className="result-title">{result.title}</h3>
                      <div className="result-meta">
                        <div className="result-meta-item">
                          <span>👁️ {result.views || 0}</span>
                        </div>
                        <div className="result-meta-item">
                          <span>❤️ {result.likes || 0}</span>
                        </div>
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
                    </div>
                  </div>
                  <div className="result-tags">
                    {result.tags.map(tag => (
                      <span key={tag} className="result-tag">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="search-empty">
            <div className="empty-icon">🔍</div>
            <h3 className="empty-title">Нет результатов</h3>
            <p className="empty-text">
              Попробуйте поискать что-нибудь другое или измените фильтры
            </p>
          </div>
        )}

        {/* Pagination */}
        {mockResults.length > 0 && (
          <div className="pagination">
            <button className="pagination-btn" disabled>
              ← Предыдущая
            </button>
            <button className="pagination-btn active">1</button>
            <button className="pagination-btn">2</button>
            <button className="pagination-btn">3</button>
            <button className="pagination-btn">
              Следующая →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
