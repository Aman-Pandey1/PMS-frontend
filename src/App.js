import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import AdminDashboard from './components/AdminDashboard';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        
        <Route path="/super-admin" element={
          <PrivateRoute allowedRoles={['super_admin']}>
            <SuperAdminDashboard />
          </PrivateRoute>
        } />
        
        <Route path="/admin" element={
          <PrivateRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </PrivateRoute>
        } />
        
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;