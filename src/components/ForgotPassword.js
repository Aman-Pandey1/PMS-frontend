// src/components/ForgotPassword.js
import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('/api/auth/forgot-password', { email });
      setMessage('Password reset email sent. Please check your inbox.');
      setError('');
    } catch (err) {
      setError('Error sending reset email');
      setMessage('');
    }
  };

  return (
    <div className="forgot-password-container">
      <h1>Forgot Password</h1>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Send Reset Link</button>
      </form>
    </div>
  );
};

export default ForgotPassword;