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

  