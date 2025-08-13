import React, { useState } from 'react';
import './styles.css'
import {useNavigate} from 'react'
import Photo from '../assets/login.jpg';
function Registration() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [error, setError] = useState('');

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const response = await fetch('http://localhost:9090/api/users/insert', {
                method: 'post',
                headers: {
                    'Content-Type' : 'application/json',
                },
                body : JSON.stringify({username, email, password, role}),
            });
            const data = await response.json();
            if(response.ok) {
                console.log('User Registered Successfuly: ', data);
                //redirect to login page
                window.location.href='/login'; 
            } else {
                throw new Error(data.error || 'Registration failed');

            }
        } catch(err) {
            setError(err.message);
        }
    };
  return (
        <div
      className="page-container"
      style={{
        backgroundImage: `url(${Photo})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',   // ensure background covers viewport
        width: '100%',
      }}
    >
        <div className='form-container'>
            <h1 className='form-title'>Register</h1>
            {error && <p className='error-message'>{error}</p>}
            <form onSubmit={handleSignUp} className='form-content'>
                <div className='form-group'>
                    <label htmlFor="username" className='form-label'>Username</label>
                    <input 
                    id='username'
                    type="text" 
                    placeholder='Enter your username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className='form-input'
                    />
                </div>
                <div className='form-group'>
                    <label htmlFor="email" className='form-label'>Email</label>
                    <input 
                    id='email'
                    type="email" 
                    placeholder='Enter your email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className='form-input'
                    />
                </div>
                <div className='form-group'>
                    <label htmlFor="password" className='form-label'>Password</label>
                    <input 
                    id='password'
                    type="password" 
                    placeholder='Enter your email'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className='form-input'
                    />
                </div>
                <div className='form-group'>
                    <label htmlFor="role" className='form-label'>Role</label>
                    <select 
                    id='role'
                    
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                    className='form-select'
                    > 
                    <option value="disabled" >Select your role</option>
                    <option value="PATIENT">PATIENT</option>
                    <option value="DOCTOR">DOCTOR</option>
                    </select>
                </div>
                <button type='submit' className='form-button'>Sign Up</button>
            </form>
            <p className='form-footer'>
                Already a user ? {' '}
                <a href="/login" className='form-link'>Log in here</a>
            </p>
        </div>
    </div>
  );
}

export default Registration