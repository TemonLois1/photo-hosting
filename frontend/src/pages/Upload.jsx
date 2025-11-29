// src/pages/Upload.jsx
import React, { useState, useRef } from 'react';
import './Upload.modern.css';

function Upload() {
  const [files, setFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadStage, setUploadStage] = useState('select'); // select, details, uploading
  const fileInputRef = useRef(null);
  
  const [details, setDetails] = useState({
    title: '',
    description: '',
    tags: [],
    isPublic: true,
  });
  const [newTag, setNewTag] = useState('');

  // Drag and Drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  };

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files);
    processFiles(selectedFiles);
  };

  const processFiles = (fileList) => {
    const imageFiles = fileList.filter(file => file.type.startsWith('image/'));
    
    imageFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFiles(prev => [...prev, {
          id: Date.now() + Math.random(),
          file,
          preview: e.target.result,
          status: 'ready',
          progress: 0
        }]);
      };
      reader.readAsDataURL(file);
    });

    setUploadStage('details');
  };

  const removeFile = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    if (files.length <= 1) {
      setUploadStage('select');
      setDetails({ title: '', description: '', tags: [], isPublic: true });
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !details.tags.includes(newTag.trim())) {
      setDetails(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag) => {
    setDetails(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const simulateUpload = () => {
    setUploadStage('uploading');
    
    files.forEach(file => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress > 100) progress = 100;
        
        setUploadProgress(prev => ({
          ...prev,
          [file.id]: progress
        }));

        if (progress >= 100) {
          clearInterval(interval);
          setFiles(prev => prev.map(f => 
            f.id === file.id ? { ...f, status: 'success' } : f
          ));
        }
      }, 500);
    });

    setTimeout(() => {
      setUploadStage('success');
    }, 3000);
  };

  const resetUpload = () => {
    setFiles([]);
    setUploadProgress({});
    setUploadStage('select');
    setDetails({ title: '', description: '', tags: [], isPublic: true });
    setNewTag('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="upload-page">
      {/* Stage 1: Select Files */}
      {uploadStage === 'select' && (
        <div className="upload-container upload-select-stage">
          <div className="upload-hero">
            <div className="upload-hero-content">
              <h1 className="upload-title">Делитесь вашими лучшими моментами</h1>
              <p className="upload-subtitle">
                Загружайте фотографии и делитесь ими со всем миром мгновенно
              </p>
            </div>
          </div>

          <div className="upload-content">
            <div
              className={`upload-drop-zone ${dragOver ? 'drag-over' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="drop-zone-animation">
                <div className="drop-zone-icon">📸</div>
              </div>
              <h2 className="drop-zone-title">Перетащите фото сюда</h2>
              <p className="drop-zone-text">или нажмите для выбора из компьютера</p>
              <p className="drop-zone-hint">JPEG, PNG, WebP до 10MB</p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileInput}
                className="drop-zone-input"
              />
            </div>

            <div className="upload-features">
              <div className="feature-item">
                <div className="feature-icon">⚡</div>
                <div className="feature-content">
                  <h3>Быстрая загрузка</h3>
                  <p>Загружайте до 100 фото за раз</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🔒</div>
                <div className="feature-content">
                  <h3>Безопасность</h3>
                  <p>Все загрузки зашифрованы</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🌍</div>
                <div className="feature-content">
                  <h3>Общий доступ</h3>
                  <p>Делитесь со всеми или только друзьями</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">✨</div>
                <div className="feature-content">
                  <h3>Без ограничений</h3>
                  <p>Сохраняйте с полным разрешением</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stage 2: Details & Preview */}
      {uploadStage === 'details' && (
        <div className="upload-container upload-details-stage">
          <div className="upload-header">
            <h1 className="upload-page-title">Подробности фото</h1>
            <p className="upload-page-subtitle">
              Добавьте информацию о ваших фотографиях перед загрузкой
            </p>
          </div>

          <div className="upload-form">
            {/* Image Preview Grid */}
            <div className="upload-preview-section">
              <h2 className="section-title">Превью ({files.length})</h2>
              <div className="image-preview-grid">
                {files.map(file => (
                  <div key={file.id} className="preview-card">
                    <img
                      src={file.preview}
                      alt="preview"
                      className="preview-image"
                    />
                    <div className="preview-overlay">
                      <button
                        className="preview-remove-btn"
                        onClick={() => removeFile(file.id)}
                        title="Удалить"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Details */}
            <div className="upload-details-form">
              <h2 className="section-title">Описание</h2>

              <div className="form-group">
                <label className="form-label">Название фото</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Введите название вашей фотографии"
                  value={details.title}
                  onChange={(e) => setDetails({...details, title: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Описание</label>
                <textarea
                  className="form-textarea"
                  placeholder="Расскажите интересную историю о вашей фотографии..."
                  value={details.description}
                  onChange={(e) => setDetails({...details, description: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Теги</label>
                <div className="tags-container">
                  <div className="tags-list">
                    {details.tags.map(tag => (
                      <span key={tag} className="tag-badge">
                        {tag}
                        <button
                          className="tag-remove"
                          onClick={() => removeTag(tag)}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="tag-input-wrapper">
                    <input
                      type="text"
                      className="tag-input"
                      placeholder="Добавить тег..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                    <button
                      className="tag-add-btn"
                      onClick={handleAddTag}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-checkbox">
                  <input
                    type="checkbox"
                    checked={details.isPublic}
                    onChange={(e) => setDetails({...details, isPublic: e.target.checked})}
                  />
                  <span>Сделать общедоступным</span>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="upload-actions">
              <button
                className="upload-btn upload-btn-secondary"
                onClick={() => setUploadStage('select')}
              >
                ← Назад
              </button>
              <button
                className="upload-btn upload-btn-primary"
                onClick={simulateUpload}
              >
                Загрузить ({files.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stage 3: Uploading */}
      {uploadStage === 'uploading' && (
        <div className="upload-container upload-uploading-stage">
          <div className="uploading-content">
            <div className="uploading-header">
              <h1 className="uploading-title">Загрузка фотографий</h1>
              <p className="uploading-subtitle">
                Пожалуйста, подождите, идет загрузка ваших фотографий
              </p>
            </div>

            <div className="uploading-list">
              {files.map(file => (
                <div key={file.id} className="uploading-item">
                  <div className="uploading-preview">
                    <img src={file.preview} alt="uploading" />
                  </div>
                  <div className="uploading-info">
                    <div className="uploading-name">{file.file.name}</div>
                    <div className="uploading-progress">
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${uploadProgress[file.id] || 0}%`,
                            backgroundColor: file.status === 'success' ? '#10b981' : '#0ea5e9'
                          }}
                        />
                      </div>
                      <span className="progress-percent">
                        {Math.round(uploadProgress[file.id] || 0)}%
                      </span>
                    </div>
                  </div>
                  <div className="uploading-status">
                    {file.status === 'ready' && <span className="status-ready">⏳</span>}
                    {file.status === 'uploading' && <span className="status-uploading">⟳</span>}
                    {file.status === 'success' && <span className="status-success">✓</span>}
                  </div>
                </div>
              ))}
            </div>

            <div className="uploading-stats">
              <div className="stat">
                <div className="stat-value">{files.length}</div>
                <div className="stat-label">фото</div>
              </div>
              <div className="stat">
                <div className="stat-value">
                  {(files.reduce((sum, f) => sum + f.file.size, 0) / 1024 / 1024).toFixed(1)} MB
                </div>
                <div className="stat-label">размер</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stage 4: Success */}
      {uploadStage === 'success' && (
        <div className="upload-container upload-success-stage">
          <div className="success-content">
            <div className="success-icon-wrapper">
              <div className="success-icon">✓</div>
            </div>
            <h1 className="success-title">Успешно загружено!</h1>
            <p className="success-subtitle">
              Все ваши фотографии были успешно загружены и готовы к просмотру
            </p>

            <div className="success-actions">
              <button
                className="upload-btn upload-btn-primary"
                onClick={() => window.location.href = '/'}
              >
                Перейти к галерее
              </button>
              <button
                className="upload-btn upload-btn-secondary"
                onClick={resetUpload}
              >
                Загрузить еще
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Upload;
