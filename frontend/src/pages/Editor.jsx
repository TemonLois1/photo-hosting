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
  const [activeTab, setActiveTab] = useState('adjust'); // adjust, filters, layers
  
  // Mock image for demonstration
  const [imageSrc] = useState('https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80');

  const tools = [
    { id: 'select', name: 'Select', icon: 'pointer' },
    { id: 'crop', name: 'Crop', icon: 'crop' },
    { id: 'rotate', name: 'Rotate', icon: 'rotate-cw' },
    { id: 'text', name: 'Text', icon: 'type' },
    { id: 'draw', name: 'Draw', icon: 'pen-tool' },
  ];

  const filters = [
    { name: 'Normal', class: 'filter-normal' },
    { name: 'Vivid', class: 'filter-vivid' },
    { name: 'B&W', class: 'filter-bw' },
    { name: 'Sepia', class: 'filter-sepia' },
    { name: 'Vintage', class: 'filter-vintage' },
    { name: 'Cool', class: 'filter-cool' },
  ];

  const handleReset = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setBlur(0);
    setZoom(100);
  };

  // Dynamic styles for the image
  const imageStyle = {
    filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px)`,
    transform: `scale(${zoom / 100})`,
    transition: 'filter 0.2s ease, transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  return (
    <div className="editor-page">
      {/* Top Bar */}
      <header className="editor-header">
        <div className="header-left">
          <div className="logo-mark">E</div>
          <span className="file-name">Untitled-Project.jpg</span>
          <span className="save-status">Saved</span>
        </div>
        
        <div className="header-center">
          <div className="zoom-controls">
            <button onClick={() => setZoom(z => Math.max(z - 10, 10))}>-</button>
            <span className="zoom-level">{zoom}%</span>
            <button onClick={() => setZoom(z => Math.min(z + 10, 200))}>+</button>
          </div>
        </div>

        <div className="header-right">
          <button className="btn-secondary" onClick={handleReset}>Reset</button>
          <button className="btn-primary">Export Image</button>
        </div>
      </header>

      <div className="editor-layout">
        {/* Left Toolbar */}
        <aside className="tools-sidebar">
          {tools.map(tool => (
            <button 
              key={tool.id}
              className={`tool-btn ${selectedTool === tool.id ? 'active' : ''}`}
              onClick={() => setSelectedTool(tool.id)}
              title={tool.name}
            >
              <span className={`icon icon-${tool.icon}`}></span>
              <span className="tool-label">{tool.name}</span>
            </button>
          ))}
        </aside>

        {/* Main Canvas Area */}
        <main className="canvas-area">
          <div className="canvas-container">
            <div className="canvas-wrapper">
              <img 
                src={imageSrc} 
                alt="Editing canvas" 
                className="editor-image"
                style={imageStyle}
              />
            </div>
          </div>
        </main>

        {/* Right Properties Panel */}
        <aside className="properties-sidebar">
          <div className="sidebar-tabs">
            <button 
              className={`tab-btn ${activeTab === 'adjust' ? 'active' : ''}`}
              onClick={() => setActiveTab('adjust')}
            >
              Adjust
            </button>
            <button 
              className={`tab-btn ${activeTab === 'filters' ? 'active' : ''}`}
              onClick={() => setActiveTab('filters')}
            >
              Filters
            </button>
          </div>

          <div className="sidebar-content">
            {activeTab === 'adjust' && (
              <div className="adjustments-panel">
                <div className="control-group">
                  <label>Brightness</label>
                  <div className="slider-container">
                    <input 
                      type="range" 
                      min="0" 
                      max="200" 
                      value={brightness} 
                      onChange={(e) => setBrightness(Number(e.target.value))} 
                    />
                    <span className="value">{brightness}%</span>
                  </div>
                </div>

                <div className="control-group">
                  <label>Contrast</label>
                  <div className="slider-container">
                    <input 
                      type="range" 
                      min="0" 
                      max="200" 
                      value={contrast} 
                      onChange={(e) => setContrast(Number(e.target.value))} 
                    />
                    <span className="value">{contrast}%</span>
                  </div>
                </div>

                <div className="control-group">
                  <label>Saturation</label>
                  <div className="slider-container">
                    <input 
                      type="range" 
                      min="0" 
                      max="200" 
                      value={saturation} 
                      onChange={(e) => setSaturation(Number(e.target.value))} 
                    />
                    <span className="value">{saturation}%</span>
                  </div>
                </div>

                <div className="control-group">
                  <label>Blur</label>
                  <div className="slider-container">
                    <input 
                      type="range" 
                      min="0" 
                      max="20" 
                      value={blur} 
                      onChange={(e) => setBlur(Number(e.target.value))} 
                    />
                    <span className="value">{blur}px</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'filters' && (
              <div className="filters-grid">
                {filters.map((filter, idx) => (
                  <div key={idx} className="filter-item">
                    <div className={`filter-preview ${filter.class}`}></div>
                    <span>{filter.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Editor;
