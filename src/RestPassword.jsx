// ResetPasswordPage.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ResetPasswordPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const token = params.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:9090/api/forgotpassword/reset-password', {
        token,
        newPassword,
      });
      setMessage(res.data.message || 'Password reset successful!');
      setError('');
      // After success, you might want to redirect to login after some delay
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed.');
      setMessage('');
    }
  };

  if (!token) {
    return <p>Invalid or missing token.</p>;
  }

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', fontFamily: 'Arial, sans-serif' }}>
      <h2>Reset Password</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleReset}>
        <div style={{ marginBottom: '1rem' }}>
          <label>New Password</label><br />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Confirm Password</label><br />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button type="submit" style={{
          padding: '10px 15px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          borderRadius: '4px',
        }}>
          Reset Password
        </button>
      </form>
    </div>
  );
}
