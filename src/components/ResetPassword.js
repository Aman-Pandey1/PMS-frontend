// src/components/ResetPassword.js
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();

  const onSubmit = async e => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await axios.post('/api/auth/reset-password', { token, newPassword: password });
      setMessage('Password reset successfully. You can now login with your new password.');
      setError('');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError('Error resetting password. Link may be invalid or expired.');
      setMessage('');
    }
  };

  return (
    <div className="reset-password-container">
      <h1>Reset Password</h1>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;