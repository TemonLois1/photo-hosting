// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Profile.modern.css';
import { api } from '../utils/api';

function Profile() {
  const { username } = useParams();
  const [activeTab, setActiveTab] = useState('gallery');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      setError('');
      try {
        if (!username) {
          setError('Пользователь не найден');
          setLoading(false);
          return;
        }
  
        const response = await api.getUserProfile(username);
        // Backend returns { success: true, data: { ... } }
        const userData = response.data.data;
        
        if (!userData) {
          throw new Error('Данные профиля отсутствуют');
        }
        
        setProfile(userData);
        
        // Проверяем, собственный ли это профиль
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser && JSON.parse(currentUser).username === username) {
          setIsOwnProfile(true);
        }
      } catch (err) {
        console.error('Ошибка при загрузке профиля:', err);
        setError('Не удалось загрузить профиль. Используются примеры данных.');
        // Mock данные для демонстрации
        setProfile({
          username: username || 'иван_петров',
          name: 'Иван Петров',
          bio: 'Фотограф и путешественник. Люблю снимать пейзажи и портреты.',
          followers: 1234,
          following: 567,
          photos: 89,
          avatar: '👤',
          createdAt: '2024-11-15',
          posts: Array(12).fill(null).map((_, i) => ({
            id: i + 1,
            title: `Фотография ${i + 1}`,
            image: `https://images.unsplash.com/photo-${[
              '1492691527719-9d1e07e534b4',
              '1500462918059-b1a0cb512f1d',
              '1506744038136-46273834b3fb',
              '1470071459604-3b5ec3a7fe05',
              '1441974231531-c6227db76b6e',
              '1472214103451-9374bd1c798e',
              '1469474968028-af50264f0d63',
              '1433086966358-54859d0ed716',
              '1470252649378-9c29740c9fa8',
              '1447752875204-b2f9a3e45199',
              '1475924156734-496f6cac6ec1',
              '1501854140884-074cf2b2b3b6'
            ][i % 12]}?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80`,
            views: Math.floor(Math.random() * 10000),
            likes: Math.floor(Math.random() * 5000),
          }))
        });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [username]);

  if (loading) {
    return (
      <div className="profile-page">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Загрузка профиля...</p>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="profile-page">
        <div className="error-message" style={{ padding: '40px', textAlign: 'center' }}>
          ⚠️ {error}
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-page">
        <div className="error-message" style={{ padding: '40px', textAlign: 'center' }}>
          Профиль не найден
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-header-content">
            <div className="profile-avatar">{profile.avatar || '👤'}</div>
            <div className="profile-info">
              <h1 className="profile-name">{profile.name}</h1>
              <p className="profile-bio">{profile.bio}</p>
              <div className="profile-stats">
                <div className="stat-badge">
                  <div className="stat-number">{profile.photos || 0}</div>
                  <div className="stat-label">Фото</div>
                </div>
                <div className="stat-badge">
                  <div className="stat-number">{profile.followers || 0}</div>
                  <div className="stat-label">Подписчиков</div>
                </div>
                <div className="stat-badge">
                  <div className="stat-number">{profile.following || 0}</div>
                  <div className="stat-label">Подписок</div>
                </div>
              </div>
            </div>
          </div>
          <div className="profile-actions">
            {isOwnProfile ? (
              <>
                <button className="profile-btn primary">⚙️ Настройки</button>
                <button className="profile-btn">📝 Редактировать</button>
              </>
            ) : (
              <>
                <button className="profile-btn primary">Подписаться</button>
                <button className="profile-btn">Сообщение</button>
              </>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="profile-tabs">
          <button
            className={`profile-tab ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => setActiveTab('gallery')}
          >
            🖼️ Галерея
          </button>
          <button
            className={`profile-tab ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            ℹ️ О профиле
          </button>
          <button
            className={`profile-tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            ⚙️ Настройки
          </button>
        </div>

        {/* Gallery Tab */}
        {activeTab === 'gallery' && (
          <div className="profile-content active">
            <div className="profile-gallery">
              {profile.posts && profile.posts.length > 0 ? (
                profile.posts.map(post => (
                  <article key={post.id} className="profile-post-card">
                    <img
                      src={post.image || `https://picsum.photos/300/300?random=${post.id}`}
                      alt={post.title}
                      className="profile-post-image"
                    />
                    <div className="profile-post-overlay">
                      <div className="overlay-stat">
                        <span className="overlay-stat-icon">👁️</span>
                        <span>{post.views || 0}</span>
                      </div>
                      <div className="overlay-stat">
                        <span className="overlay-stat-icon">❤️</span>
                        <span>{post.likes || 0}</span>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
                  <p style={{ color: '#999' }}>Нет фотографий</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* About Tab */}
        {activeTab === 'about' && (
          <div className="profile-content active">
            <div className="profile-details">
              <div className="detail-card">
                <div className="detail-card-title">📋 Информация</div>
                <div className="detail-item">
                  <span className="detail-label">Имя пользователя</span>
                  <span className="detail-value">@{profile.username}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Полное имя</span>
                  <span className="detail-value">{profile.name}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Биография</span>
                  <span className="detail-value">{profile.bio}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Присоединился</span>
                  <span className="detail-value">
                    {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('ru-RU') : 'Неизвестно'}
                  </span>
                </div>
              </div>

              <div className="detail-card">
                <div className="detail-card-title">📊 Статистика</div>
                <div className="detail-item">
                  <span className="detail-label">Всего фотографий</span>
                  <span className="detail-value">{profile.photos || 0}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Подписчиков</span>
                  <span className="detail-value">{profile.followers || 0}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Подписок</span>
                  <span className="detail-value">{profile.following || 0}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Средняя оценка</span>
                  <span className="detail-value">4.8 ⭐</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="profile-content active">
            <div className="profile-settings">
              <div className="settings-card">
                <div className="settings-card-title">🔒 Приватность</div>
                <div className="settings-group">
                  <div className="settings-item">
                    <div className="settings-label">
                      <div className="settings-label-text">Закрытый профиль</div>
                      <div className="settings-label-desc">Только подписчики могут видеть ваши фото</div>
                    </div>
                    <input type="checkbox" className="settings-toggle" />
                  </div>
                  <div className="settings-item">
                    <div className="settings-label">
                      <div className="settings-label-text">Разрешить комментарии</div>
                      <div className="settings-label-desc">Позволить пользователям комментировать</div>
                    </div>
                    <input type="checkbox" className="settings-toggle" defaultChecked />
                  </div>
                </div>
              </div>

              <div className="settings-card">
                <div className="settings-card-title">🔔 Уведомления</div>
                <div className="settings-group">
                  <div className="settings-item">
                    <div className="settings-label">
                      <div className="settings-label-text">Новые подписчики</div>
                      <div className="settings-label-desc">Уведомлять о новых подписчиках</div>
                    </div>
                    <input type="checkbox" className="settings-toggle" defaultChecked />
                  </div>
                  <div className="settings-item">
                    <div className="settings-label">
                      <div className="settings-label-text">Лайки и комментарии</div>
                      <div className="settings-label-desc">Уведомлять о лайках и комментариях</div>
                    </div>
                    <input type="checkbox" className="settings-toggle" defaultChecked />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
