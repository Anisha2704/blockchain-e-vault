import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import DocumentsPage from './pages/documents/DocumentsPage';
import UploadPage from './pages/documents/UploadPage';
import DocumentDetailPage from './pages/documents/DocumentDetailPage';
import VerifyPage from './pages/verification/VerifyPage';
import Profile from './pages/Profile';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 selection:bg-cyan-500 selection:text-white">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/verify" element={<VerifyPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/documents/upload" element={<UploadPage />} />
            <Route path="/documents/:id" element={<DocumentDetailPage />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
