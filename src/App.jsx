import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Home from './pages/Home';
import ProjectDetail from './pages/ProjectDetail';
import BlogDetail from './pages/BlogDetail';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminBlog from './pages/AdminBlog';
import AdminConfig from './pages/AdminConfig';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/project/:id" element={<ProjectDetail />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        
        <Route path="/login" element={<AdminLogin />} />

        {/* Protected Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute><AdminDashboard /></ProtectedRoute>
        } />
        
        <Route path="/admin/blog" element={
          <ProtectedRoute><AdminBlog /></ProtectedRoute>
        } />
        
        <Route path="/admin/config" element={
          <ProtectedRoute><AdminConfig /></ProtectedRoute>
        } />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
