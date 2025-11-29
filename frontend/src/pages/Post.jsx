// src/pages/Post.jsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './Post.modern.css';

function Post() {
  const { id } = useParams();
  const [comments, setComments] = useState([
    { id: 1, author: 'Иван', time: '2 часа назад', text: 'Красивая фотография!' },
    { id: 2, author: 'Мария', time: '1 час назад', text: 'Отличное качество снимка' },
  ]);
  const [newComment, setNewComment] = useState('');

  const mockPost = {
    id: id,
    title: 'Закат над морем',
    description: 'Прекрасный вид на закат с берега моря. Снято на закате солнца.',
    author: 'Иван Петров',
    views: 1523,
    likes: 342,
    comments: comments.length,
    date: '15 ноября 2025',
    tags: ['пейзаж', 'море', 'закат', 'природа'],
    image: 'https://picsum.photos/800/600?random=1',
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([...comments, {
        id: comments.length + 1,
        author: 'Вы',
        time: 'сейчас',
        text: newComment
      }]);
      setNewComment('');
    }
  };

  return (
    <div className="post-page">
      <div className="post-container">
        {/* Main Content */}
        <div className="post-main">
          {/* Image */}
          <div className="post-image-container">
            <img src={mockPost.image} alt={mockPost.title} className="post-image" />
          </div>

          {/* Toolbar */}
          <div className="post-toolbar">
            <button className="post-tool-btn">❤️ Нравится</button>
            <button className="post-tool-btn">💬 Комментировать</button>
            <button className="post-tool-btn">📤 Поделиться</button>
            <button className="post-tool-btn">⋮ Ещё</button>
          </div>

          {/* Post Header */}
          <div className="post-header">
            <div className="post-title-section">
              <h1 className="post-title">{mockPost.title}</h1>
              <p className="post-description">{mockPost.description}</p>
            </div>

            <div className="post-meta">
              <div className="meta-item">
                <div className="meta-label">Автор</div>
                <div className="meta-value">{mockPost.author}</div>
              </div>
              <div className="meta-item">
                <div className="meta-label">Дата</div>
                <div className="meta-value">{mockPost.date}</div>
              </div>
              <div className="meta-item">
                <div className="meta-label">Просмотры</div>
                <div className="meta-value">{mockPost.views}</div>
              </div>
              <div className="meta-item">
                <div className="meta-label">Нравится</div>
                <div className="meta-value">{mockPost.likes}</div>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="comments-section">
            <h2 className="comments-title">Комментарии ({comments.length})</h2>

            {/* Comment Form */}
            <div className="comment-form">
              <textarea
                className="comment-input"
                placeholder="Напишите комментарий..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button
                className="comment-submit"
                onClick={handleAddComment}
                disabled={!newComment.trim()}
              >
                Опубликовать
              </button>
            </div>

            {/* Comments List */}
            <div className="comments-list">
              {comments.map(comment => (
                <div key={comment.id} className="comment-item">
                  <div className="comment-header">
                    <div className="comment-author">{comment.author}</div>
                    <div className="comment-time">{comment.time}</div>
                  </div>
                  <div className="comment-text">{comment.text}</div>
                  <div className="comment-actions">
                    <button className="comment-action">👍 Нравится</button>
                    <button className="comment-action">💬 Ответить</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="post-sidebar">
          {/* Author Card */}
          <div className="sidebar-card author-card">
            <div className="author-avatar">👤</div>
            <h3 className="author-name">{mockPost.author}</h3>
            <p className="author-info">Фотограф и путешественник</p>
            <button className="author-btn">Подписаться</button>
          </div>

          {/* Stats */}
          <div className="sidebar-card">
            <div className="sidebar-card-title">📊 Статистика</div>
            <div className="stats-list">
              <div className="stat-item">
                <span className="stat-label">Просмотры</span>
                <span className="stat-value">{mockPost.views}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Нравится</span>
                <span className="stat-value">{mockPost.likes}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Комментарии</span>
                <span className="stat-value">{comments.length}</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="sidebar-card">
            <div className="sidebar-card-title">🏷️ Теги</div>
            <div className="tags-section">
              {mockPost.tags.map(tag => (
                <a key={tag} href={`/search?tag=${tag}`} className="tag-badge">
                  #{tag}
                </a>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Post;
