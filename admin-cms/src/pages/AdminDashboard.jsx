import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, Car, DollarSign, Settings, Eye, Check, X, AlertCircle, FileText, LogOut, Key, UserCheck, TrendingUp, Search, MapPin, Navigation, Activity, Map, Radio, Compass, MessageSquare, Send, CreditCard, Upload, Tag, Phone, AlertTriangle, Bell, Menu } from 'lucide-react';
import Button from '../components/Button';
import './AdminDashboard.css';

// Extracted Components
import ErrorBoundary from '../components/ErrorBoundary';
import RegisteredPartners from '../components/admin/RegisteredPartners';
import ApprovalsQueue from '../components/admin/ApprovalsQueue';
import FleetMonitor from '../components/admin/FleetMonitor';
import Ledger from '../components/admin/Ledger';
import SystemSettings from '../components/admin/SystemSettings';
import RegisteredPassengers from '../components/admin/RegisteredPassengers';
import StaffManagement from '../components/admin/StaffManagement';
import PendingPayments from '../components/admin/PendingPayments';
import Analytics from '../components/admin/Analytics';
import Promotions from '../components/admin/Promotions';
import GlobalBroadcasts from '../components/admin/GlobalBroadcasts';
import SecurityCredentials from '../components/admin/SecurityCredentials';

// Hooks
import { 
  useDrivers, 
  usePassengers, 
  useEmployees, 
  useFinancials, 
  useCategories, 
  useSettings, 
  usePendingPayments,
  useLocations,
  useAdminProfile,
  useSocketFleetLive
} from '../hooks/admin/useAdminData';

const API_BASE = (typeof window !== 'undefined' && window.location.hostname.includes('loca.lt'))
  ? 'https://hum-fleet-backend.loca.lt'
  : (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))
    ? 'http://localhost:5000'
    : 'https://hum-fleet-api.onrender.com';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('approvals');
  
  // Pagination & Search States
  const [driverPage, setDriverPage] = useState(1);
  const [passengerPage, setPassengerPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [driverSearch, setDriverSearch] = useState('');
  const [passengerSearch, setPassengerSearch] = useState('');

  // Socket
  useSocketFleetLive();

  // Queries
  const { data: driversData } = useDrivers(driverPage, itemsPerPage, driverSearch, null);
  const drivers = driversData?.data || driversData || [];
  const totalDrivers = driversData?.total || drivers.length;
  const totalDriverPages = driversData?.totalPages || 1;

  const { data: passengersData } = usePassengers(passengerPage, itemsPerPage, passengerSearch);
  const passengers = passengersData?.data || passengersData || [];
  const totalPassengers = passengersData?.total || passengers.length;
  const totalPassengerPages = passengersData?.totalPages || 1;

  const { data: employees = [] } = useEmployees();
  const { data: financials = { platformFees: 0, pendingPayouts: 0, totalTrips: 0 } } = useFinancials();
  const { data: categories = [] } = useCategories();
  const { data: settings = {} } = useSettings();
  const { data: locations = [] } = useLocations();

  useEffect(() => {
    if (localStorage.getItem('adminAuthenticated') !== 'true') {
      navigate('/');
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  if (!isAuthenticated) return null;

  return (
    <div className="admin-container container" style={{ paddingTop: '0' }}>
      {/* Sidebar */}
      <aside className="admin-sidebar glass-card">
        <div className="sidebar-header">
          <div className="logo-icon-container">
            <Shield size={28} className="text-primary" />
          </div>
          <h2 className="text-gradient">HUM CMS</h2>
        </div>
        
        <nav className="sidebar-nav">
          <div className="nav-section">
            <h3 className="nav-section-title">OPERATIONS</h3>
            <button className={`nav-btn ${activeTab === 'approvals' ? 'active' : ''}`} onClick={() => setActiveTab('approvals')}>
              <UserCheck size={18} /> Approvals Queue
            </button>
            <button className={`nav-btn ${activeTab === 'partners' ? 'active' : ''}`} onClick={() => setActiveTab('partners')}>
              <Car size={18} /> Partners (Drivers)
            </button>
            <button className={`nav-btn ${activeTab === 'passengers' ? 'active' : ''}`} onClick={() => setActiveTab('passengers')}>
              <Users size={18} /> Passengers (Users)
            </button>
            <button className={`nav-btn ${activeTab === 'fleet' ? 'active' : ''}`} onClick={() => setActiveTab('fleet')}>
              <Radio size={18} /> Live Fleet Monitor
            </button>
          </div>

          <div className="nav-section">
            <h3 className="nav-section-title">FINANCE & BUSINESS</h3>
            <button className={`nav-btn ${activeTab === 'ledger' ? 'active' : ''}`} onClick={() => setActiveTab('ledger')}>
              <FileText size={18} /> Partner Ledgers
            </button>
            <button className={`nav-btn ${activeTab === 'payments' ? 'active' : ''}`} onClick={() => setActiveTab('payments')}>
              <DollarSign size={18} /> Pending Payments
            </button>
            <button className={`nav-btn ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>
              <TrendingUp size={18} /> Revenue Analytics
            </button>
          </div>

          <div className="nav-section">
            <h3 className="nav-section-title">SYSTEM ADMIN</h3>
            <button className={`nav-btn ${activeTab === 'staff' ? 'active' : ''}`} onClick={() => setActiveTab('staff')}>
              <Shield size={18} /> Staff Management
            </button>
            <button className={`nav-btn ${activeTab === 'promotions' ? 'active' : ''}`} onClick={() => setActiveTab('promotions')}>
              <Tag size={18} /> Promotions & Codes
            </button>
            <button className={`nav-btn ${activeTab === 'broadcasts' ? 'active' : ''}`} onClick={() => setActiveTab('broadcasts')}>
              <Send size={18} /> Global Broadcasts
            </button>
            <button className={`nav-btn ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
              <Settings size={18} /> System Settings
            </button>
            <button className={`nav-btn ${activeTab === 'security' ? 'active' : ''}`} onClick={() => setActiveTab('security')}>
              <Key size={18} /> Security
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content Pane */}
      <div className="admin-main">
        <header className="admin-header glass-card">
          <div className="header-search">
            <Search size={18} color="var(--text-muted)" />
            <input type="text" placeholder="Global search..." />
          </div>
          <div className="header-actions">
            <button className="icon-btn position-relative">
              <Bell size={20} />
            </button>
            <div className="admin-profile">
              <div className="admin-avatar">A</div>
              <div className="admin-info">
                <span className="admin-name">Master Admin</span>
                <span className="admin-role">Super User</span>
              </div>
            </div>
          </div>
        </header>

        <main className="admin-content glass-card">
          <ErrorBoundary>
            {activeTab === 'approvals' && <ApprovalsQueue drivers={drivers} />}
            {activeTab === 'partners' && (
              <RegisteredPartners 
                filteredActiveDrivers={drivers}
                driverSearch={driverSearch}
                setDriverSearch={setDriverSearch}
                page={driverPage}
                setPage={setDriverPage}
                totalPages={totalDriverPages}
                totalItems={totalDrivers}
              />
            )}
            {activeTab === 'passengers' && (
              <RegisteredPassengers 
                passengerSearch={passengerSearch}
                setPassengerSearch={setPassengerSearch}
                filteredPassengers={passengers}
                page={passengerPage}
                setPage={setPassengerPage}
                totalPages={totalPassengerPages}
                totalItems={totalPassengers}
              />
            )}
            {activeTab === 'fleet' && <FleetMonitor />}
            {activeTab === 'ledger' && <Ledger />}
            {activeTab === 'payments' && <PendingPayments />}
            {activeTab === 'analytics' && <Analytics />}
            {activeTab === 'staff' && <StaffManagement employees={employees} />}
            {activeTab === 'promotions' && <Promotions />}
            {activeTab === 'broadcasts' && <GlobalBroadcasts />}
            {activeTab === 'settings' && <SystemSettings categories={categories} settings={settings} />}
            {activeTab === 'security' && <SecurityCredentials />}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
