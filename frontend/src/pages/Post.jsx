// src/pages/Post.jsx
import React from 'react';
import { useParams } from 'react-router-dom';

function Post() {
  const { id } = useParams();

  return (
    <div className="container">
      <h1>📸 Пост #{id}</h1>
      <p>Просмотр поста в разработке...</p>
    </div>
  );
}

export default Post;
