import React, { useState } from 'react'
import {useNavigate} from 'react-router-dom';
import './styles.css';
export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSignIn = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const response = await fetch('http://localhost:9090/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({email, password}),
            });
            const data =await response.json();
            if(response.ok) {
                console.log('User logged in successfully:', data);
                if(data.role === 'PATIENT') {
                    navigate('/patient');
                    console.log('Patient Logged in successful');
                } if(data.role == 'ADMIN') {
                    console.log('Admin Logged in successful');
                    navigate('/doctor')   
                } if(data.role == 'ADMIN') {
                    console.log('doctor Logged in successful');
                    navigate('/admin')   
                }
                else {
                    throw new Error('Invalid user role');
                }
            } else {
                throw new Error(data.error || 'Login failed');
            }
        } catch(err) {
            setError(err.message);
        }
    }
  return (
    <div className='page-container'>
    <div className='form-container'>
        <h1 className='form-title'>Login</h1>
        {error && <p className='error-message'>{error}</p>}
        <form onSubmit={handleSignIn} className='form-content'>
            <div className='form-group'>
                <label htmlFor="email" className='form-label'>Email</label>
                <input 
                id='email'
                type="text" 
                placeholder='Enter your Email'
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
                placeholder='Enter your password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className='form-input'
                />
            </div>
           
            <button type='submit' className='form-button'>Sign In</button>
        </form>
        <div className='form-footer'>
           
            <a href="/register" className='form-link'>Sign Up here</a>
        </div>
    </div>
</div>
  )
}