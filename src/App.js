import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/Login';
import PostsPage from './pages/Post';
import ProfilePage from './pages/Profile';
import SignUpPage from './pages/SignUp';
import AuthContext from './context/auth-context';
import PrivateRoute from './components/PrivateRoute';

export default function App() {
  let [token, setToken] = useState(localStorage.getItem('token') || '');
  let [userId, setUserId] = useState(localStorage.getItem('userId') || '');
  let [name, setName] = useState(localStorage.getItem('name') || '');
  let [likes, setLikes] = useState(
    JSON.parse(localStorage?.getItem('likes')) || []
  );
  // useEffect(() => {
  //   console.log('🚀 ~ file: App.js:17 ~ App ~ likes:', likes);
  // }, [likes]);

  const login = (userToken, loginUserId, name, likes) => {
    if (userToken) {
      setToken(userToken);
      localStorage.setItem('token', userToken);
    }
    if (loginUserId) {
      setUserId(loginUserId);
      localStorage.setItem('userId', loginUserId);
    }
    if (name) {
      setName(name);
      localStorage.setItem('name', name);
    }
    if (likes) {
      setLikes(likes);
      localStorage.setItem('likes', JSON.stringify(likes));
    }
  };
  function likesHandler(likes) {
    setLikes(likes);
    localStorage.setItem('likes', JSON.stringify(likes));
  }
  const logout = () => {
    setToken(null);
    setUserId(null);
    setName(null);
    localStorage.clear();
  };

  return (
    <BrowserRouter>
      <AuthContext.Provider
        value={{ token, userId, name, login, logout, likes, likesHandler }}
      >
        <Navbar />
        <main className="main-content">
          <Routes>
            {token && (
              <Route
                path="/login"
                element={<Navigate replace to="/posts" />}
                exact
              />
            )}
            <Route path="/login" element={<LoginPage />} />
            {token && (
              <Route
                path="/signup"
                element={<Navigate replace to="/posts" />}
                exact
              />
            )}
            <Route path="/signup" element={<SignUpPage />} exact />
            <Route path="/" element={<Navigate replace to="/posts" />} exact />
            <Route path="/posts" element={<PostsPage />} />

            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            />
          </Routes>
        </main>
      </AuthContext.Provider>
    </BrowserRouter>
  );
}
