

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [infoMessage, setInfoMessage] = useState(null);
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError(null);
    setInfoMessage(null);
    try {
      const response = await fetch('http://localhost:9090/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      localStorage.setItem("userId", data.getId());
      if (response.ok) {
        console.log('User logged in successfully:', data);
        if (data.role === 'PATIENT') {
          navigate('/patient');
        } else if (data.role === 'ADMIN') {
          navigate('/admin');
        } else if (data.role === 'DOCTOR') {
          navigate('/doctor');
        } else {
          throw new Error('Invalid user role');
        }
      } else {
        throw new Error(data.error || 'Login failed');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError(null);
    setInfoMessage(null);

    if (!email) {
      setError('Please enter your email to reset password.');
      return;
    }

    try {
      const response = await fetch(
        'http://localhost:9090/api/forgotpassword/forgot-password',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        }
      );
      if (response.success = 'true') {
        setInfoMessage(
          'Email is sent to you. You can reset password and login again.'
        );
      } else {
        const data = await response.json();
        setError('Failed to send reset email.');
      }
    } catch (err) {
      setError("Enter Valid Email");
    }
  };

  return (
    <div className="page-container">
      <div className="form-container">
        <h1 className="form-title">Login</h1>
        {error && <p className="error-message">{error}</p>}
        {infoMessage && <p className="info-message">{infoMessage}</p>}
        <form onSubmit={handleSignIn} className="form-content">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              type="text"
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value.trim())}
              required
              className="form-input"
            />
          </div>

          <button type="submit" className="form-button">
            Sign In
          </button>
        </form>
        <div className="form-footer">
          <a href="/register" className="form-link">
            Sign Up here
          </a>{' '}
          <a href="#!" onClick={handleForgotPassword} className="form-link">
            Forgot Password
          </a>
        </div>
      </div>
    </div>
  );
}
