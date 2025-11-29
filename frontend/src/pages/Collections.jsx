// src/pages/Collections.jsx
import React, { useState } from 'react';
import './Collections.modern.css';

function Collections() {
  const [collections, setCollections] = useState([
    {
      id: 1,
      name: 'Летние путешествия',
      description: 'Фотографии из летних путешествий по странам',
      itemsCount: 45,
      views: 1234,
      likes: 567,
      images: [
        'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        'https://images.unsplash.com/photo-1437719417032-8595fd9e9dc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
      ],
    },
    {
      id: 2,
      name: 'Портреты',
      description: 'Сборка красивых портретов',
      itemsCount: 32,
      views: 892,
      likes: 423,
      images: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
      ],
    },
    {
      id: 3,
      name: 'Архитектура',
      description: 'Красивые здания и сооружения',
      itemsCount: 28,
      views: 756,
      likes: 312,
      images: [
        'https://images.unsplash.com/photo-1486325212027-8081e485255e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        'https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        'https://images.unsplash.com/photo-1448630360428-65456885c650?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
      ],
    },
  ]);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('recent');
  const [showModal, setShowModal] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');

  const handleCreateCollection = () => {
    if (newCollectionName.trim()) {
      setCollections([...collections, {
        id: collections.length + 1,
        name: newCollectionName,
        description: '',
        itemsCount: 0,
        views: 0,
        likes: 0,
        images: [],
      }]);
      setNewCollectionName('');
      setShowModal(false);
    }
  };

  return (
    <div className="collections-page">
      <div className="collections-container">
        {/* Header */}
        <div className="collections-header">
          <h1 className="collections-title">📚 Коллекции</h1>
          <div className="collections-actions">
            <button
              className="create-collection-btn"
              onClick={() => setShowModal(true)}
            >
              ➕ Новая коллекция
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="collections-controls">
          <div className="view-options">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid view"
            >
              ⊞
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List view"
            >
              ≡
            </button>
          </div>

          <div className="sort-section">
            <label htmlFor="sort">Сортировка:</label>
            <select
              id="sort"
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="recent">Новые</option>
              <option value="popular">Популярные</option>
              <option value="name">По названию</option>
            </select>
          </div>
        </div>

        {/* Collections Grid */}
        {collections.length > 0 ? (
          <div className="collections-grid">
            {collections.map(collection => (
              <div key={collection.id} className="collection-card">
                <div className="collection-cover">
                  <div className="collection-cover-images">
                    {collection.images.slice(0, 4).map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt="cover"
                        className="cover-image"
                      />
                    ))}
                  </div>
                  <div className="collection-cover-overlay">
                    {collection.images.length > 4 && `+${collection.images.length - 4}`}
                  </div>
                </div>

                <div className="collection-content">
                  <h3 className="collection-name">{collection.name}</h3>
                  <p className="collection-description">{collection.description}</p>

                  <div className="collection-stats">
                    <div className="stat-box">
                      <div className="stat-number">{collection.itemsCount}</div>
                      <div className="stat-label">Фото</div>
                    </div>
                    <div className="stat-box">
                      <div className="stat-number">{collection.views}</div>
                      <div className="stat-label">Просмотры</div>
                    </div>
                    <div className="stat-box">
                      <div className="stat-number">{collection.likes}</div>
                      <div className="stat-label">Лайки</div>
                    </div>
                  </div>
                </div>

                <div className="collection-actions">
                  <button className="collection-action-btn">
                    Открыть
                  </button>
                  <button className="collection-action-btn primary">
                    Редактировать
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="collections-empty">
            <div className="empty-icon">📚</div>
            <h3 className="empty-title">Нет коллекций</h3>
            <p className="empty-text">Создайте первую коллекцию для организации фотографий</p>
            <button
              className="empty-action-btn"
              onClick={() => setShowModal(true)}
            >
              Создать коллекцию
            </button>
          </div>
        )}
      </div>

      {/* Create Collection Modal */}
      <div className={`collection-modal ${showModal ? 'active' : ''}`}>
        <div className="collection-modal-content">
          <div className="modal-header">
            <h2>Новая коллекция</h2>
            <button
              className="modal-close"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>
          </div>

          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Название</label>
              <input
                type="text"
                className="form-input"
                placeholder="Введите название коллекции"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Описание</label>
              <textarea
                className="form-textarea"
                placeholder="Описание коллекции (опционально)"
                rows="4"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              className="modal-btn secondary"
              onClick={() => setShowModal(false)}
            >
              Отмена
            </button>
            <button
              className="modal-btn primary"
              onClick={handleCreateCollection}
              disabled={!newCollectionName.trim()}
            >
              Создать
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Collections;
