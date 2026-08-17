import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, CheckCircle, Clock, UserCircle } from 'lucide-react';
import Button from '../components/Button';
import './AdminDashboard.css';

const API_BASE = (typeof window !== 'undefined' && window.location.hostname.includes('loca.lt'))
  ? 'https://hum-fleet-backend.loca.lt'
  : (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))
    ? 'http://localhost:5000'
    : (import.meta.env.VITE_BACKEND_URL || 'http://187.127.165.79:5000');

const StaffDashboard = () => {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    const employeeId = localStorage.getItem('employeeId');
    if (!employeeId) {
      navigate('/staff/login');
      return;
    }
    fetchEmployee(employeeId);
  }, []);

  const fetchEmployee = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/api/employee/${id}`);
      if (response.ok) {
        const data = await response.json();
        setEmployee(data);
      } else {
        navigate('/staff/login');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSignIn = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/employee/attendance/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: employee.id })
      });
      if (response.ok) {
        fetchEmployee(employee.id);
      } else {
        const data = await response.json();
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSignOut = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/employee/attendance/signout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: employee.id })
      });
      if (response.ok) {
        fetchEmployee(employee.id);
      } else {
        const data = await response.json();
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('employeeId');
    navigate('/staff/login');
  };

  if (!employee) return <div style={{ color: 'white', padding: '20px' }}>Loading...</div>;

  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = employee.attendance?.find(a => a.date === today);
  const isSignedIn = !!todayAttendance && !todayAttendance.signOut;
  const isCompleted = !!todayAttendance && !!todayAttendance.signOut;

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <div className="sidebar" style={{ width: '260px' }}>
        <div className="sidebar-header">
          <UserCircle size={28} color="var(--primary)" />
          <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>Staff Portal</h2>
        </div>
        <div className="sidebar-nav">
          <div className="admin-nav-item active">
            <Clock size={18} /> Attendance
          </div>
        </div>
        <div style={{ marginTop: 'auto', padding: '16px' }}>
          <Button variant="outline" className="full-width" onClick={handleLogout} style={{ justifyContent: 'center' }}>
            <LogOut size={16} /> Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <header className="header" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 4px 0' }}>Welcome, {employee.name}</h1>
            <p className="text-muted" style={{ margin: 0 }}>Role: {employee.role} | @{employee.username}</p>
          </div>
        </header>

        <div className="content-area animate-fade-in" style={{ padding: '24px' }}>
          <div className="glass-card" style={{ padding: '32px', borderRadius: '16px', background: 'var(--bg-card)', border: '1px solid var(--border)', maxWidth: '600px' }}>
            <h2 style={{ marginBottom: '24px' }}>Today's Attendance</h2>
            
            <div style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}>
              <div style={{ flex: 1, padding: '24px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <p style={{ color: 'var(--text-muted)', margin: '0 0 8px 0' }}>Sign In Time</p>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                  {todayAttendance?.signIn ? new Date(todayAttendance.signIn).toLocaleTimeString() : '--:--:--'}
                </div>
              </div>
              <div style={{ flex: 1, padding: '24px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <p style={{ color: 'var(--text-muted)', margin: '0 0 8px 0' }}>Sign Out Time</p>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                  {todayAttendance?.signOut ? new Date(todayAttendance.signOut).toLocaleTimeString() : '--:--:--'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              {!todayAttendance ? (
                <Button variant="primary" style={{ flex: 1, padding: '16px' }} onClick={handleSignIn}>
                  <CheckCircle size={20} style={{ marginRight: '8px' }} /> Register Sign In
                </Button>
              ) : isSignedIn ? (
                <Button variant="outline" style={{ flex: 1, padding: '16px', color: '#ef4444', borderColor: '#ef4444' }} onClick={handleSignOut}>
                  <LogOut size={20} style={{ marginRight: '8px' }} /> Register Sign Out
                </Button>
              ) : (
                <div style={{ flex: 1, padding: '16px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', textAlign: 'center', borderRadius: '8px', fontWeight: 'bold' }}>
                  Attendance Completed for Today
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
