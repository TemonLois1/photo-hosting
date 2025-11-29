// src/pages/Upload.jsx
import React, { useState } from 'react';
import './Upload.modern.css';

function Upload() {
  const [files, setFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [details, setDetails] = useState({
    title: '',
    description: '',
    tags: [],
    isPublic: true,
  });
  const [newTag, setNewTag] = useState('');

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
    handleFiles(droppedFiles);
  };

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files);
    handleFiles(selectedFiles);
  };

  const handleFiles = (fileList) => {
    const imageFiles = fileList.filter(file => file.type.startsWith('image/'));
    
    imageFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFiles(prev => [...prev, {
          id: Date.now() + Math.random(),
          file,
          preview: e.target.result,
          status: 'ready'
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !details.tags.includes(newTag)) {
      setDetails(prev => ({
        ...prev,
        tags: [...prev.tags, newTag]
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

  const handleUpload = () => {
    // TODO: Implement actual upload
    console.log('Uploading files with details:', details);
    alert('Загрузка функция в разработке!');
  };

  return (
    <div className="upload-page">
      <div className="upload-container">
        {/* Header */}
        <div className="upload-header">
          <h1 className="upload-page-title">📤 Загрузить фото</h1>
          <p className="upload-page-subtitle">
            Поделитесь вашими лучшими фотографиями
          </p>
        </div>

        <div className="upload-form">
          {/* Drag & Drop Zone */}
          <div
            className={`upload-drop-zone ${dragOver ? 'drag-over' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="drop-zone-icon">🖼️</div>
            <div className="drop-zone-text">Перетащите фото сюда</div>
            <div className="drop-zone-subtext">или нажмите для выбора</div>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileInput}
              className="drop-zone-input"
              id="file-input"
            />
          </div>

          {/* Image Preview */}
          {files.length > 0 && (
            <div>
              <h3 style={{ marginBottom: '16px', fontWeight: '600' }}>
                Выбрано файлов: {files.length}
              </h3>
              <div className="image-preview-grid">
                {files.map(file => (
                  <div key={file.id} className="preview-item">
                    <img
                      src={file.preview}
                      alt="preview"
                      className="preview-image"
                    />
                    <div className="preview-overlay">
                      <button
                        className="preview-action-btn danger"
                        onClick={() => removeFile(file.id)}
                      >
                        ❌
                      </button>
                    </div>
                    {file.status === 'uploading' && (
                      <div className="preview-status">
                        Загрузка...
                      </div>
                    )}
                    {file.status === 'success' && (
                      <div className="preview-status success">
                        ✓ Успешно
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Details */}
          <div className="upload-details-section">
            <h2 className="upload-details-title">Описание фото</h2>

            <div className="form-group">
              <label className="form-label">Название</label>
              <input
                type="text"
                className="form-input"
                placeholder="Введите название фото"
                value={details.title}
                onChange={(e) => setDetails({...details, title: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Описание</label>
              <textarea
                className="form-textarea"
                placeholder="Расскажите о вашей фотографии..."
                value={details.description}
                onChange={(e) => setDetails({...details, description: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Теги</label>
              <div className="tags-input">
                {details.tags.map(tag => (
                  <span key={tag} className="tag">
                    {tag}
                    <button
                      className="tag-remove"
                      onClick={() => removeTag(tag)}
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  className="tag-input"
                  placeholder="Добавить тег..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                />
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
            <button className="upload-btn-secondary">
              Отмена
            </button>
            <button
              className="upload-btn-primary"
              disabled={files.length === 0}
              onClick={handleUpload}
            >
              Загрузить ({files.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Upload;
