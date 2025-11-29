// src/App.jsx - Корневой компонент приложения

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Post from './pages/Post';
import Profile from './pages/Profile';
import Search from './pages/Search';
import Collections from './pages/Collections';
import Editor from './pages/Editor';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute';

import './styles/index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/post/:id" element={<Post />} />
          <Route path="/user/:username" element={<Profile />} />
          <Route path="/search" element={<Search />} />
          <Route path="/collections" element={<Collections />} />
          
          <Route element={<PrivateRoute />}>
            <Route path="/upload" element={<Upload />} />
            <Route path="/editor" element={<Editor />} />
          </Route>
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
