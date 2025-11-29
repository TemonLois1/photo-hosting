// src/pages/Editor.jsx
import React, { useState } from 'react';
import './Editor.modern.css';

function Editor() {
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [blur, setBlur] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [selectedTool, setSelectedTool] = useState('select');
  const [history] = useState(['Исходное изображение']);
  const [layers] = useState([
    { id: 1, name: 'Фоновый слой', visible: true },
  ]);

  const tools = [
    { id: 'select', name: 'Выбор', icon: '✍️' },
    { id: 'crop', name: 'Обрезка', icon: '⚔️' },
    { id: 'rotate', name: 'Поворот', icon: '🔄' },
    { id: 'flip', name: 'Отразить', icon: '↔️' },
    { id: 'paint', name: 'Кисть', icon: '🖌️' },
    { id: 'text', name: 'Текст', icon: '📝' },
  ];

  const presets = [
    { name: 'Нормально', color: '#3b82f6' },
    { name: 'Ч/Б', color: '#6b7280' },
    { name: 'Сепия', color: '#a16207' },
    { name: 'Кул', color: '#06b6d4' },
    { name: 'Теплый', color: '#f97316' },
    { name: 'Ночь', color: '#1e293b' },
  ];

  const handleZoomIn = () => setZoom(Math.min(zoom + 10, 200));
  const handleZoomOut = () => setZoom(Math.max(zoom - 10, 50));
  const handleResetZoom = () => setZoom(100);

  const handleReset = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setBlur(0);
  };

  return (
    <div className="editor-page">
      {/* Toolbar */}
      <div className="editor-toolbar">
        <div className="toolbar-title">🎨 Редактор изображений</div>

        <div className="toolbar-separator"></div>

        {/* Tools */}
        <div className="toolbar-group">
          <span className="toolbar-group-label">Инструменты</span>
          {tools.map(tool => (
            <button
              key={tool.id}
              className={`tool-btn ${selectedTool === tool.id ? 'active' : ''}`}
              onClick={() => setSelectedTool(tool.id)}
              title={tool.name}
            >
              {tool.icon}
            </button>
          ))}
        </div>

        <div className="toolbar-separator"></div>

        {/* Effects */}
        <div className="toolbar-group">
          <span className="toolbar-group-label">Эффекты</span>
          <button className="tool-btn">🌈</button>
          <button className="tool-btn">✨</button>
          <button className="tool-btn">🔥</button>
        </div>

        <div className="toolbar-separator"></div>

        {/* Colors */}
        <div className="toolbar-group">
          <button className="tool-btn color-picker-btn">
            🎨
            <div className="color-picker-preview"></div>
          </button>
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <button className="tool-btn">↩️</button>
          <button className="tool-btn">↪️</button>
          <button className="tool-btn" onClick={handleReset}>🔄</button>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="editor-container">
        {/* Canvas */}
        <div className="editor-canvas-area">
          <img
            src="https://picsum.photos/600/400?random=0"
            alt="editor"
            className="editor-canvas"
            style={{
              filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px)`,
              transform: `scale(${zoom / 100})`,
            }}
          />
        </div>

        {/* Sidebar */}
        <div className="editor-sidebar">
          {/* Properties */}
          <div className="sidebar-section">
            <div className="sidebar-section-title">Свойства</div>

            <div className="property-item">
              <label className="property-label">Яркость</label>
              <input
                type="range"
                min="0"
                max="200"
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                className="property-range"
              />
              <div className="property-value-display">{brightness}%</div>
            </div>

            <div className="property-item">
              <label className="property-label">Контраст</label>
              <input
                type="range"
                min="0"
                max="200"
                value={contrast}
                onChange={(e) => setContrast(Number(e.target.value))}
                className="property-range"
              />
              <div className="property-value-display">{contrast}%</div>
            </div>

            <div className="property-item">
              <label className="property-label">Насыщенность</label>
              <input
                type="range"
                min="0"
                max="200"
                value={saturation}
                onChange={(e) => setSaturation(Number(e.target.value))}
                className="property-range"
              />
              <div className="property-value-display">{saturation}%</div>
            </div>

            <div className="property-item">
              <label className="property-label">Размытие</label>
              <input
                type="range"
                min="0"
                max="20"
                value={blur}
                onChange={(e) => setBlur(Number(e.target.value))}
                className="property-range"
              />
              <div className="property-value-display">{blur}px</div>
            </div>
          </div>

          {/* Layers */}
          <div className="sidebar-section">
            <div className="sidebar-section-title">Слои</div>
            <div className="layers-list">
              {layers.map(layer => (
                <div key={layer.id} className="layer-item active">
                  <span className="layer-icon">🖼️</span>
                  <span className="layer-name">{layer.name}</span>
                  <button className="layer-visibility">👁️</button>
                </div>
              ))}
            </div>
          </div>

          {/* Presets */}
          <div className="sidebar-section">
            <div className="sidebar-section-title">Пресеты</div>
            <div className="presets-grid">
              {presets.map(preset => (
                <button key={preset.name} className="preset-btn">
                  <div
                    className="preset-preview"
                    style={{ backgroundColor: preset.color }}
                  ></div>
                  <span style={{ fontSize: '11px' }}>{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* History */}
          <div className="sidebar-section">
            <div className="sidebar-section-title">История</div>
            <div className="history-list">
              {history.map((item, idx) => (
                <div
                  key={idx}
                  className={`history-item ${idx === history.length - 1 ? 'active' : ''}`}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="editor-footer">
        <div className="editor-zoom-controls">
          <button className="zoom-btn" onClick={handleZoomOut}>−</button>
          <div className="zoom-value">{zoom}%</div>
          <button className="zoom-btn" onClick={handleZoomIn}>+</button>
          <button className="zoom-btn" onClick={handleResetZoom}>Сброс</button>
        </div>

        <div className="editor-actions">
          <button className="editor-btn secondary">Отмена</button>
          <button className="editor-btn primary">Сохранить</button>
        </div>
      </div>
    </div>
  );
}

export default Editor;
