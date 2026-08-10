import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Eye, EyeOff, UserCircle } from 'lucide-react';
import Button from '../components/Button';
import './Auth.css';

const API_BASE = 'https://hum-fleet-api.onrender.com';

const StaffLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/api/employee/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('employeeId', data.employee.id);
        navigate('/staff/dashboard');
      } else {
        const data = await response.json();
        setError(data.error || 'Invalid credentials.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to connect to authentication server.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass-card animate-fade-in">
        <div className="auth-header">
          <div style={{ 
            width: '56px', 
            height: '56px', 
            borderRadius: '14px', 
            background: 'var(--primary)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 16px auto',
            color: 'white',
            boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)'
          }}>
            <UserCircle size={28} />
          </div>
          <h2>Staff Portal</h2>
          <p>Login to your employee dashboard</p>
        </div>

        {error && (
          <div style={{ 
            background: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid rgba(239, 68, 68, 0.2)', 
            borderRadius: '8px', 
            padding: '12px', 
            color: '#ef4444', 
            fontSize: '14px', 
            textAlign: 'center' 
          }}>
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input 
              type="text" 
              id="username" 
              className="input-field" 
              placeholder="Enter your username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                id="password" 
                className="input-field" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingRight: '40px' }}
                required 
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <Button variant="primary" type="submit" className="full-width" style={{ marginTop: '8px' }}>
            <Lock size={16} /> Login
          </Button>
          
          <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px', color: 'var(--text-muted)' }}>
            Don't have an account? <a href="/staff/register" onClick={(e) => { e.preventDefault(); navigate('/staff/register'); }} style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '500' }}>Register here</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffLogin;
