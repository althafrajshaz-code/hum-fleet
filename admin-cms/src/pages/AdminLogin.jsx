import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock } from 'lucide-react';
import Button from '../components/Button';
import './Auth.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      if (response.ok) {
        navigate('/dashboard');
      } else {
        const data = await response.json();
        setError(data.error || 'Invalid admin credentials.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to connect to operations authentication server.');
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
            <Shield size={28} />
          </div>
          <h2>HUM Fleet Admin</h2>
          <p>Secure Operations Portal Access</p>
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
            <label htmlFor="username">Admin Username</label>
            <input 
              type="text" 
              id="username" 
              className="input-field" 
              placeholder="Enter admin username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Security Password</label>
            <input 
              type="password" 
              id="password" 
              className="input-field" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <Button variant="primary" type="submit" className="full-width" style={{ marginTop: '8px' }}>
            <Lock size={16} /> Authenticate Portal
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
