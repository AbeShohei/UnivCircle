import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import TopPage from './pages/TopPage';
import SearchPage from './pages/SearchPage';
import DetailPage from './pages/DetailPage';
import AdminPage from './pages/AdminPage';
import CreateCirclePage from './pages/CreateCirclePage';
import UserProfilePage from './pages/UserProfilePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CircleRegisterPage from './pages/CircleRegisterPage';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<TopPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/circle/:id" element={<DetailPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/create-circle" element={<CreateCirclePage />} />
          <Route path="/register-circle" element={<CircleRegisterPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;