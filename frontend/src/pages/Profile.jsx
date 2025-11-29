// src/pages/Profile.jsx
import React from 'react';
import { useParams } from 'react-router-dom';

function Profile() {
  const { username } = useParams();

  return (
    <div className="container">
      <h1>👤 Профиль: {username}</h1>
      <p>Профиль пользователя в разработке...</p>
    </div>
  );
}

export default Profile;
