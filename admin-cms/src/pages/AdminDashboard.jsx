import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, Car, DollarSign, Settings, Eye, Check, X, AlertCircle, FileText, LogOut, Key, UserCheck, TrendingUp, Search, MapPin, Navigation, Activity, Map, Radio, Compass, MessageSquare, Send, CreditCard, Upload, Tag, Phone, AlertTriangle } from 'lucide-react';
import Button from '../components/Button';
import './AdminDashboard.css';
import Analytics from '../components/admin/Analytics';
import ChatModal from '../components/admin/ChatModal';
import ApprovalsQueue from '../components/admin/ApprovalsQueue';
import FleetMonitor from '../components/admin/FleetMonitor';
import GlobalBroadcasts from '../components/admin/GlobalBroadcasts';
import Ledger from '../components/admin/Ledger';
import PendingPayments from '../components/admin/PendingPayments';
import Promotions from '../components/admin/Promotions';
import RegisteredPartners from '../components/admin/RegisteredPartners';
import RegisteredPassengers from '../components/admin/RegisteredPassengers';
import SecurityCredentials from '../components/admin/SecurityCredentials';
import StaffManagement from '../components/admin/StaffManagement';
import SystemSettings from '../components/admin/SystemSettings';
import ErrorBoundary from '../components/ErrorBoundary';
import { 
  useDrivers, 
  usePassengers, 
  useSocketFleetLive
} from '../hooks/admin/useAdminData';


const MOCK_PHOTOS = {
  front: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600',
  rear: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600',
  left: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600',
  right: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=600',
  inside: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600',
  document: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600'
};

const API_BASE = (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))
  ? 'http://localhost:5000'
  : (typeof window !== 'undefined' && window.location.hostname.includes('loca.lt'))
    ? 'https://hum-fleet-backend.loca.lt'
    : 'https://hum-fleet-api.onrender.com';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('adminAuthenticated') !== 'true') {
      navigate('/');
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  const handleAdminLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    navigate('/');
  };


  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('adminActiveTab') || 'approvals');
  
  // --- REACT QUERY & PAGINATION INTEGRATION ---
  const [driverPage, setDriverPage] = useState(1);
  const [passengerPage, setPassengerPage] = useState(1);
  const itemsPerPage = 10;
  
  const [registeredDriverSearch, setRegisteredDriverSearch] = useState('');
  const [passengerSearch, setPassengerSearch] = useState('');
  const { data: driversData, refetch: refetchDriversQuery } = useDrivers(driverPage, itemsPerPage, registeredDriverSearch, null);
  const { data: passengersData, refetch: refetchPassengersQuery } = usePassengers(passengerPage, itemsPerPage, passengerSearch);
  
  useSocketFleetLive();

  useEffect(() => {
    if (Array.isArray(driversData)) {
      setDrivers(driversData);
    } else if (driversData?.data) {
      setDrivers(driversData.data);
    }
  }, [driversData]);

  useEffect(() => {
    if (Array.isArray(passengersData)) {
      setPassengers(passengersData);
    } else if (passengersData?.data) {
      setPassengers(passengersData.data);
    }
  }, [passengersData]);
  
  const totalDriverPages = driversData?.totalPages || 1;
  const totalDrivers = Array.isArray(driversData) ? driversData.length : (driversData?.total || 0);
  const totalPassengerPages = passengersData?.totalPages || 1;
  const totalPassengers = Array.isArray(passengersData) ? passengersData.length : (passengersData?.total || 0);
  // ---------------------------------------------
  const [activeSOSAlert, setActiveSOSAlert] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [passengers, setPassengers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);

  // Add/Remove Driver & Passenger State
  const [showAddDriverModal, setShowAddDriverModal] = useState(false);
  const [newDriverData, setNewDriverData] = useState({ name: '', email: '', phone: '', licenseNumber: '', vehicleType: 'Sedan', plateNumber: '' });
  const [showAddPassengerModal, setShowAddPassengerModal] = useState(false);
  const [newPassengerData, setNewPassengerData] = useState({ name: '', email: '', phone: '' });
  // Employee Management State
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ name: '', username: '', password: '', role: 'staff', position: '', managerId: '', salary: '', incentive: '', salaryDate: '' });
  const [selectedEmployeeForDetails, setSelectedEmployeeForDetails] = useState(null);

  // Pending Payments State
  const [pendingPaymentsData, setPendingPaymentsData] = useState({
    pendingPayments: [],
    summary: { totalOutstanding: '0.00', totalSameDay: '0.00', totalRolledOver: '0.00', pendingPartnersCount: 0 }
  });
  const [pendingSearch, setPendingSearch] = useState('');
  const [pendingFilter, setPendingFilter] = useState('all'); // 'all' | 'same-day' | 'rolled-over' | 'critical-overdue'

  // Direct Messaging States
  const [messageModalDriver, setMessageModalDriver] = useState(null);
  const [messageModalPassenger, setMessageModalPassenger] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessageText, setNewMessageText] = useState('');

  // Live Fleet Monitor States
  const [fleetData, setFleetData] = useState({ drivers: [], passengers: [], activeRides: [], onlineDriversCount: 0, ridingDriversCount: 0, offlineDriversCount: 0 });
  const [fleetSearch, setFleetSearch] = useState('');
  const [fleetFilter, setFleetFilter] = useState('all'); // 'all' | 'online' | 'riding' | 'offline'
  const [fleetEntity, setFleetEntity] = useState('drivers'); // 'drivers' | 'passengers'
  const [selectedMapDriver, setSelectedMapDriver] = useState(null);

  const [watermarkLogo, setWatermarkLogo] = useState(null);

  useEffect(() => {
    const img = new Image();
    img.src = '/hum_fleet_official_logo.jpg';
    img.onload = () => setWatermarkLogo(img);
  }, []);

  // Save activeTab to localStorage on change
  useEffect(() => {
    localStorage.setItem('adminActiveTab', activeTab);
  }, [activeTab]);

  // Search State Queries
  const [driverSearch, setDriverSearch] = useState('');
  const [businessListings, setBusinessListings] = useState([]);
  const [newLocName, setNewLocName] = useState('');
  const [newLocLat, setNewLocLat] = useState('');
  const [newLocLng, setNewLocLng] = useState('');
  
  const fetchLocations = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/locations`);
      if (response.ok) {
        const data = await response.json();
        setBusinessListings(data || []);
      }
    } catch (err) {
      console.error("Failed to fetch locations:", err);
    }
  };
  const [ledgerSearch, setLedgerSearch] = useState('');

  // Ledger filter query: 'all', 'pending', 'no-pending'
  const [ledgerFilter, setLedgerFilter] = useState(() => localStorage.getItem('adminLedgerFilter') || 'all');

  useEffect(() => {
    localStorage.setItem('adminLedgerFilter', ledgerFilter);
  }, [ledgerFilter]);

  // Financial Stats States
  const [financials, setFinancials] = useState({
    totalCommission: '0.00',
    totalGST: '0.00',
    toBeCollected: '0.00'
  });
  
  // Preview Modal State
  const [previewFile, setPreviewFile] = useState(null);
  const [previewTitle, setPreviewTitle] = useState('');

  // Global Date Filter State
  const [globalStartDate, setGlobalStartDate] = useState('');
  const [globalEndDate, setGlobalEndDate] = useState('');

  // Collect Cash & WhatsApp Statement modal states
  const [showCollectCashModal, setShowCollectCashModal] = useState(false);
  const [selectedLedgerDriver, setSelectedLedgerDriver] = useState(null);
  const [collectAmount, setCollectAmount] = useState('');
  const [isSubmittingCollection, setIsSubmittingCollection] = useState(false);
  const [statementImageSrc, setStatementImageSrc] = useState(null);

  // Payment Received & Watermarked PDF Bill Receipt States
  const [showPaymentReceivedModal, setShowPaymentReceivedModal] = useState(false);
  const [paidReceiptDetails, setPaidReceiptDetails] = useState(null);
  const [paidReceiptImageSrc, setPaidReceiptImageSrc] = useState(null);

  // System control states
  const [baseFare, setBaseFare] = useState('50.00');
  const [ratePerKm, setRatePerKm] = useState('15.00');
  const [minRatePerHour, setMinRatePerHour] = useState('100.00');
  const [surgeMultiplier, setSurgeMultiplier] = useState('1.0');
  const [systemStatus, setSystemStatus] = useState('online');
  const [voipMasking, setVoipMasking] = useState(true);

  // Payment Gateway states
  const [gatewayType, setGatewayType] = useState('upi'); // 'upi' | 'bank'
  const [upiId, setUpiId] = useState('humfleet@okaxis');
  const [bankName, setBankName] = useState('HDFC Bank');
  const [accountNo, setAccountNo] = useState('50100481293845');
  const [ifscCode, setIfscCode] = useState('HDFC0000123');
  const [accountHolder, setAccountHolder] = useState('HUM FLEET PLATFORMS PVT LTD');
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  // Vehicle Categories Management States
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [catName, setCatName] = useState('');
  const [catPassengers, setCatPassengers] = useState('4');
  const [catBaseFare, setCatBaseFare] = useState('50.00');
  const [catRatePerKm, setCatRatePerKm] = useState('15.00');

  // Credentials change states
  const [adminUsername, setAdminUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');

  const fetchAdminProfile = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/profile`);
      if (response.ok) {
        const data = await response.json();
        setAdminUsername(data.username);
      }
    } catch (err) {
      console.error("Failed to fetch admin profile:", err);
    }
  };

  const fetchPendingPayments = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/pending-payments`);
      if (response.ok) {
        const data = await response.json();
        setPendingPaymentsData(data);
      }
    } catch (err) {
      console.error("Failed to fetch pending payments from backend:", err);
    }
  };

  const fetchDrivers = async () => { await refetchDriversQuery(); };

  const fetchPassengers = async () => { await refetchPassengersQuery(); };

  const handleAddDriver = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/api/drivers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDriverData)
      });
      if (response.ok) {
        fetchDrivers();
        setShowAddDriverModal(false);
        setNewDriverData({ name: '', email: '', phone: '', licenseNumber: '', vehicleType: 'Sedan', plateNumber: '' });
      }
    } catch (err) {
      console.error("Failed to add driver:", err);
    }
  };

  const handleDeleteDriver = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/drivers/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchDrivers();
      }
    } catch (err) {
      console.error("Failed to delete driver:", err);
    }
  };

  const handleAddPassenger = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/api/passengers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPassengerData)
      });
      if (response.ok) {
        fetchPassengers();
        setShowAddPassengerModal(false);
        setNewPassengerData({ name: '', email: '', phone: '' });
      }
    } catch (err) {
      console.error("Failed to add passenger:", err);
    }
  };

  const handleDeletePassenger = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/passengers/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchPassengers();
      }
    } catch (err) {
      console.error("Failed to delete passenger:", err);
    }
  };


  const fetchEmployees = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/employees`);
      if (response.ok) {
        const data = await response.json();
        setEmployees(data);
      }
    } catch (err) {
      console.error("Failed to fetch employees from backend:", err);
    }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/api/admin/employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEmployee)
      });
      if (response.ok) {
        fetchEmployees();
        setShowAddEmployeeModal(false);
        setNewEmployee({ name: '', username: '', password: '', role: 'staff', position: '', managerId: '', salary: '', incentive: '', salaryDate: '' });
        alert('Employee added successfully!');
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(`Failed to add employee: ${errorData.error || 'Server error'}`);
      }
    } catch (err) {
      console.error('Error adding employee:', err);
      alert('Network error while adding employee.');
    }
  };

  const fetchFinancials = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/financials`);
      if (response.ok) {
        const data = await response.json();
        setFinancials(data);
      }
    } catch (err) {
      console.error("Failed to fetch financial analytics from backend:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/vehicle-categories?t=${Date.now()}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/settings?t=${Date.now()}`, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setBaseFare(data.baseFare);
        setRatePerKm(data.ratePerKm);
        setMinRatePerHour(data.minRatePerHour || '100.00');
        setSurgeMultiplier(data.surgeMultiplier);
        setSystemStatus(data.systemStatus);
        setGatewayType(data.gatewayType || 'upi');
        setUpiId(data.upiId || '');
        setBankName(data.bankName || '');
        setAccountNo(data.accountNo || '');
        setIfscCode(data.ifscCode || '');
        setAccountHolder(data.accountHolder || '');
        setQrCodeUrl(data.qrCodeUrl || '');
      }
    } catch (err) {
      console.error("Failed to fetch settings from backend:", err);
    }
  };

  const fetchFleetLive = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/fleet-live`);
      if (response.ok) {
        const data = await response.json();
        setFleetData(data);
      }
    } catch (err) {
      console.error("Failed to fetch live fleet monitor from backend:", err);
    }
  };

  const fetchChatMessages = async (email) => {
    if (!email) return;
    try {
      const response = await fetch(`${API_BASE}/api/admin/messages?driverEmail=${encodeURIComponent(email)}`);
      if (response.ok) {
        const data = await response.json();
        setChatMessages(data);
      }
    } catch (err) {
      console.error("Error fetching driver chat messages:", err);
    }
  };

  const handleBroadcastToOffline = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/messages/broadcast-offline`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'HUGE DEMAND RIGHT NOW! Go online to capture ride requests and earn surge fares!' })
      });
      if (response.ok) {
        const result = await response.json();
        alert(result.message);
      } else {
        alert('Failed to send broadcast.');
      }
    } catch (err) {
      console.error(err);
      alert('Error sending broadcast');
    }
  };

  const [broadcastText, setBroadcastText] = useState('');

  const handleBroadcastAll = async () => {
    if (!broadcastText.trim()) {
      alert('Please enter a message to broadcast.');
      return;
    }
    try {
      const response = await fetch(`${API_BASE}/api/admin/messages/broadcast-all`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: broadcastText })
      });
      if (response.ok) {
        const result = await response.json();
        alert(result.message);
        setBroadcastText(''); // Clear input
      } else {
        alert('Failed to send global broadcast.');
      }
    } catch (err) {
      console.error(err);
      alert('Error sending global broadcast');
    }
  };

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || newMessageText;
    if (!text || !text.trim() || !messageModalDriver) return;
    try {
      const response = await fetch(`${API_BASE}/api/admin/messages/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          driverEmail: messageModalDriver.email,
          sender: 'Admin CMS Support',
          text: text.trim()
        })
      });
      if (response.ok) {
        setNewMessageText('');
        fetchChatMessages(messageModalDriver.email);
      }
    } catch (err) {
      console.error("Error sending message to driver:", err);
    }
  };

  const downloadPendingPaymentsCSV = () => {
    const headers = [
      'Partner Name',
      'Phone Number',
      'Email Address',
      'Vehicle Plate',
      'Total Cash Collected (INR)',
      'Pending Due Amount (INR)',
      'First Incurred Date',
      'Days Pending',
      'Aging Status'
    ];

    const rows = pendingPaymentsData.pendingPayments.map(p => ({
      name: p.name,
      phone: p.phone,
      email: p.email,
      plate: p.plate,
      cashCollected: p.cashCollected,
      toBePaid: p.toBePaid,
      date: p.pendingDateFormatted,
      days: p.daysPending,
      status: p.statusLabel
    }));

    const csvContent = [
      headers.join(','),
      ...rows.map(r => [
        `"${r.name}"`,
        `"${r.phone}"`,
        `"${r.email}"`,
        `"${r.plate}"`,
        `"${r.cashCollected}"`,
        `"${r.toBePaid}"`,
        `"${r.date}"`,
        `"${r.days}"`,
        `"${r.status}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'type: text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `pending_payments_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    fetchDrivers();
    fetchPassengers();
    fetchEmployees();
    fetchFinancials();
    fetchCategories();
    fetchSettings();
    fetchFleetLive();
    fetchPendingPayments();
    fetchLocations();
    fetchAdminProfile();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchDrivers();
      fetchPassengers();
      fetchEmployees();
      fetchFinancials();
      fetchCategories();
      fetchSettings();
      fetchFleetLive();
      fetchPendingPayments();
      fetchLocations();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Stats values
  // const totalDrivers = drivers.length; 
  const pendingDrivers = drivers.filter(d => d.status === 'Pending').length;
  const approvedDriversCount = drivers.filter(d => d.status === 'Approved').length;

  // Filter lists based on search queries
  const filteredPendingDrivers = drivers
    .filter(d => d.status === 'Pending')
    .filter(d => 
      String(d.name || '').toLowerCase().includes(driverSearch.toLowerCase()) ||
      String(d.phone || '').includes(driverSearch) ||
      String(d.email || '').toLowerCase().includes(driverSearch.toLowerCase()) ||
      (d.plate && String(d.plate).toLowerCase().replace(/\s+/g, '').includes(driverSearch.toLowerCase().replace(/\s+/g, ''))) ||
      (d.manufacturer && String(d.manufacturer).toLowerCase().includes(driverSearch.toLowerCase())) ||
      (d.model && String(d.model).toLowerCase().includes(driverSearch.toLowerCase()))
    );

  const filteredApprovedDrivers = drivers
    .filter(d => d.status !== 'Rejected')
    .filter(d => 
      String(d.name || '').toLowerCase().includes(registeredDriverSearch.toLowerCase()) ||
      String(d.phone || '').includes(registeredDriverSearch) ||
      String(d.email || '').toLowerCase().includes(registeredDriverSearch.toLowerCase()) ||
      (d.plate && String(d.plate).toLowerCase().replace(/\s+/g, '').includes(registeredDriverSearch.toLowerCase().replace(/\s+/g, ''))) ||
      (d.manufacturer && String(d.manufacturer).toLowerCase().includes(registeredDriverSearch.toLowerCase())) ||
      (d.model && String(d.model).toLowerCase().includes(registeredDriverSearch.toLowerCase()))
    )
    .filter(d => {
      if (!globalStartDate && !globalEndDate) return true;
      if (!d.createdAt) return false;
      const dDate = new Date(d.createdAt);
      if (globalStartDate && dDate < new Date(globalStartDate)) return false;
      if (globalEndDate && dDate > new Date(globalEndDate + 'T23:59:59')) return false;
      return true;
    });

  const filteredPassengers = passengers.filter(p => 
      String(p.name || '').toLowerCase().includes(passengerSearch.toLowerCase()) ||
      String(p.phone || '').includes(passengerSearch) ||
      String(p.email || '').toLowerCase().includes(passengerSearch.toLowerCase())
  ).filter(p => {
    if (!globalStartDate && !globalEndDate) return true;
    if (!p.createdAt) return false;
    const pDate = new Date(p.createdAt);
    if (globalStartDate && pDate < new Date(globalStartDate)) return false;
    if (globalEndDate && pDate > new Date(globalEndDate + 'T23:59:59')) return false;
    return true;
  });

  const filteredLedgerDrivers = drivers
    .filter(d => 
      String(d.name || '').toLowerCase().includes(ledgerSearch.toLowerCase()) ||
      String(d.phone || '').includes(ledgerSearch) ||
      String(d.email || '').toLowerCase().includes(ledgerSearch.toLowerCase()) ||
      (d.plate && String(d.plate).toLowerCase().replace(/\s+/g, '').includes(ledgerSearch.toLowerCase().replace(/\s+/g, ''))) ||
      (d.manufacturer && String(d.manufacturer).toLowerCase().includes(ledgerSearch.toLowerCase())) ||
      (d.model && String(d.model).toLowerCase().includes(ledgerSearch.toLowerCase()))
    )
    .filter(d => {
      const toBePaid = parseFloat(d.wallet?.toBePaid || 0);
      if (ledgerFilter === 'pending') return toBePaid > 0;
      if (ledgerFilter === 'no-pending') return toBePaid === 0;
      return true;
    })
    .filter(d => {
      if (!globalStartDate && !globalEndDate) return true;
      if (!d.createdAt) return false;
      const dDate = new Date(d.createdAt);
      if (globalStartDate && dDate < new Date(globalStartDate)) return false;
      if (globalEndDate && dDate > new Date(globalEndDate + 'T23:59:59')) return false;
      return true;
    });

  const filteredPendingPayments = (pendingPaymentsData.pendingPayments || []).filter(p => {
    const matchesSearch = String(p.name || '').toLowerCase().includes(pendingSearch.toLowerCase()) ||
                          String(p.phone || '').includes(pendingSearch) ||
                          (p.plate && String(p.plate).toLowerCase().includes(pendingSearch.toLowerCase()));
    if (!matchesSearch) return false;

    if (pendingFilter === 'same-day') return p.daysPending === 0;
    if (pendingFilter === 'rolled-over') return p.daysPending > 0;
    if (pendingFilter === 'critical-overdue') return p.daysPending >= 3;

    return true;
  }).filter(p => {
    if (!globalStartDate && !globalEndDate) return true;
    if (!p.pendingDate) return false;
    const pDate = new Date(p.pendingDate);
    if (globalStartDate && pDate < new Date(globalStartDate)) return false;
    if (globalEndDate && pDate > new Date(globalEndDate + 'T23:59:59')) return false;
    return true;
  });

  const handleApprove = async (driverOrId) => {
    const targetId = typeof driverOrId === 'object' ? (driverOrId.id || driverOrId.email) : driverOrId;
    setDrivers(prev => prev.map(d => (String(d.id) === String(targetId) || d.email === targetId) ? { ...d, status: 'Approved' } : d));
    try {
      const response = await fetch(`${API_BASE}/api/drivers/${encodeURIComponent(targetId)}/approve`, {
        method: 'POST'
      });
      if (response.ok) {
        fetchDrivers();
        setSelectedDriver(null);
      }
    } catch (err) {
      console.error('Error approving driver:', err);
    }
  };

  const handleReject = async (driverOrId) => {
    const targetId = typeof driverOrId === 'object' ? (driverOrId.id || driverOrId.email) : driverOrId;
    setDrivers(prev => prev.map(d => (String(d.id) === String(targetId) || d.email === targetId) ? { ...d, status: 'Rejected' } : d));
    try {
      const response = await fetch(`${API_BASE}/api/drivers/${encodeURIComponent(targetId)}/reject`, {
        method: 'POST'
      });
      if (response.ok) {
        fetchDrivers();
        setSelectedDriver(null);
      }
    } catch (err) {
      console.error('Error rejecting driver:', err);
    }
  };

  const handleBlockDriver = async (id, name) => {
    if (!window.confirm(`Block ${name} from receiving any trips?`)) return;
    setDrivers(prev => prev.map(d => (String(d.id) === String(id) || d.email === id) ? { ...d, isBlocked: true } : d));
    try {
      const response = await fetch(`${API_BASE}/api/drivers/${encodeURIComponent(id)}/block`, { method: 'POST' });
      if (response.ok) {
        fetchDrivers();
      } else {
        alert('Failed to block driver.');
      }
    } catch (err) {
      console.error('Error blocking driver:', err);
    }
  };

  const handleUpdateDriverCategory = async (id, newCategory) => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/drivers/${id}/category`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicleCategory: newCategory })
      });
      if (response.ok) {
        alert('Driver category updated successfully!');
        fetchDrivers();
      } else {
        alert('Failed to update driver category.');
      }
    } catch (err) {
      console.error('Error updating driver category:', err);
    }
  };

  const handleUnblockDriver = async (id, name) => {
    if (!window.confirm(`Restore trip access for ${name}?`)) return;
    setDrivers(prev => prev.map(d => (String(d.id) === String(id) || d.email === id) ? { ...d, isBlocked: false } : d));
    try {
      const response = await fetch(`${API_BASE}/api/drivers/${encodeURIComponent(id)}/unblock`, { method: 'POST' });
      if (response.ok) {
        fetchDrivers();
      } else {
        alert('Failed to unblock driver.');
      }
    } catch (err) {
      console.error('Error unblocking driver:', err);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/api/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          baseFare,
          ratePerKm,
          minRatePerHour,
          surgeMultiplier,
          systemStatus,
          gatewayType,
          upiId,
          bankName,
          accountNo,
          ifscCode,
          accountHolder,
          qrCodeUrl
        })
      });
      if (response.ok) {
        alert('System and Payment Gateway settings updated successfully on server!');
        fetchSettings();
      } else {
        alert('Failed to update system settings.');
      }
    } catch (err) {
      console.error("Error saving settings:", err);
      alert('Failed to connect to operations server.');
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!catName) return;

    const payload = {
      name: catName,
      maxPassengers: catPassengers,
      baseFare: catBaseFare,
      ratePerKm: catRatePerKm
    };

    try {
      let response;
      if (editingCategory) {
        // Edit existing category
        response = await fetch(`${API_BASE}/api/vehicle-categories/${editingCategory.id || editingCategory._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
      } else {
        // Create new category
        response = await fetch(`${API_BASE}/api/vehicle-categories`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
      }

      if (response.ok) {
        alert(editingCategory ? 'Category updated successfully!' : 'Category added successfully!');
        setCatName('');
        setCatPassengers('4');
        setCatBaseFare('50.00');
        setCatRatePerKm('15.00');
        setEditingCategory(null);
        fetchCategories();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to add category.');
      }
    } catch (err) {
      console.error("Failed to save category:", err);
    }
  };

  const handleStartEdit = (cat) => {
    setEditingCategory(cat);
    setCatName(cat.name || '');
    setCatPassengers(cat.maxPassengers != null ? cat.maxPassengers.toString() : '4');
    setCatBaseFare(cat.baseFare != null ? cat.baseFare.toString() : '50.00');
    setCatRatePerKm(cat.ratePerKm != null ? cat.ratePerKm.toString() : '15.00');
    // Scroll to the edit form
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  const handleCancelEdit = () => {
    setCatName('');
    setCatPassengers('4');
    setCatBaseFare('50.00');
    setCatRatePerKm('15.00');
    setEditingCategory(null);
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vehicle category?')) return;
    try {
      const categoryId = id;
      const response = await fetch(`${API_BASE}/api/vehicle-categories/${categoryId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        alert('Category deleted successfully!');
        fetchCategories();
      }
    } catch (err) {
      console.error("Failed to delete category:", err);
    }
  };

  const downloadLedgerCSV = () => {
    const headers = [
      'Driver Name', 
      'Phone Number', 
      'Email Address', 
      'Vehicle', 
      'Plate Number', 
      'Cash Collected (INR)', 
      'Pending Platform Due (INR)', 
      'Driver Retained Cash (INR)', 
      'Bank Name', 
      'Account Holder', 
      'Account Number', 
      'IFSC Code'
    ];
    
    const rows = filteredLedgerDrivers.map(d => [
      d.name,
      d.phone,
      d.email,
      `${d.manufacturer} ${d.model}`,
      d.plate,
      (d.wallet?.cashCollected || 0).toFixed(2),
      (-(d.wallet?.toBePaid || 0)).toFixed(2),
      ((d.wallet?.cashCollected || 0) - (d.wallet?.toBePaid || 0)).toFixed(2),
      d.bank?.bankName || 'N/A',
      d.bank?.holderName || 'N/A',
      d.bank?.accountNumber || 'N/A',
      d.bank?.ifscCode || 'N/A'
    ]);
    
    // Convert to CSV string, wrap items in quotes to support commas inside fields
    const csvRows = [headers.map(h => `"${h}"`).join(',')];
    rows.forEach(r => {
      csvRows.push(r.map(val => `"${val}"`).join(','));
    });

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `driver_ledger_${ledgerFilter}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadDailyLedgerCSV = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/rides`);
      if (!response.ok) {
        alert('Failed to fetch rides data from server.');
        return;
      }
      const allRides = await response.json();
      
      const todayStr = new Date().toDateString();
      const dailyRides = allRides.filter(r => 
        r.status === 'Completed' && 
        new Date(r.completedAt || r.createdAt || Date.now()).toDateString() === todayStr
      );

      const headers = [
        'Driver Name',
        'Phone Number',
        'Email Address',
        'Vehicle Plate',
        'Rides Completed Today',
        'Daily Cash Collected (INR)',
        'Daily GST Collected from Customer (5%) (INR)',
        'Daily Platform Commission (5%) (INR)',
        'Daily Net Platform Dues Added (INR)'
      ];

      const rows = drivers.map(d => {
        const driverDailyRides = dailyRides.filter(r => r.driverEmail === d.email);
        const totalCash = driverDailyRides.reduce((sum, r) => sum + parseFloat(r.totalCollected || 0), 0);
        const totalGST = driverDailyRides.reduce((sum, r) => sum + parseFloat(r.gst || 0), 0);
        const totalCommission = driverDailyRides.reduce((sum, r) => sum + parseFloat(r.commission || 0), 0);
        const totalDuesAdded = totalGST + totalCommission;

        return {
          name: d.name,
          phone: d.phone,
          email: d.email,
          plate: d.plate || 'N/A',
          count: driverDailyRides.length,
          totalCash,
          totalGST,
          totalCommission,
          totalDuesAdded
        };
      })
      .filter(d => d.count > 0)
      .map(d => [
        d.name,
        d.phone,
        d.email,
        d.plate,
        d.count,
        d.totalCash.toFixed(2),
        d.totalGST.toFixed(2),
        d.totalCommission.toFixed(2),
        (-d.totalDuesAdded).toFixed(2)
      ]);

      if (rows.length === 0) {
        alert('No completed driver ledger entries found for today.');
        return;
      }

      const csvRows = [headers.map(h => `"${h}"`).join(',')];
      rows.forEach(r => {
        csvRows.push(r.map(val => `"${val}"`).join(','));
      });

      const csvContent = "data:text/csv;charset=utf-8," + csvRows.join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `daily_driver_ledger_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error generating daily driver ledger:', err);
      alert('Failed to connect to ledger API.');
    }
  };

  // Monthly, weekly, and daily completed rides report exporter
  const downloadReportCSV = async (range) => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/rides`);
      if (!response.ok) {
        alert('Failed to fetch rides report from server.');
        return;
      }
      const allRides = await response.json();
      
      // Filter by range
      const filtered = allRides.filter(ride => {
        if (!ride.completedAt) return false;
        const diff = new Date() - new Date(ride.completedAt);
        if (range === 'daily') {
          return diff <= 24 * 60 * 60 * 1000;
        } else if (range === 'weekly') {
          return diff <= 7 * 24 * 60 * 60 * 1000;
        } else if (range === 'monthly') {
          return diff <= 30 * 24 * 60 * 60 * 1000;
        }
        return true;
      });

      if (filtered.length === 0) {
        alert(`No completed rides found in the ${range} timeframe.`);
        return;
      }

      const headers = [
        'Ride ID',
        'Completed At',
        'Passenger Name',
        'Passenger Email',
        'Driver Name',
        'Driver Email',
        'Pickup Location',
        'Dropoff Location',
        'Distance (KM)',
        'Intercity',
        'Offered Price (INR)',
        'GST 5% (INR)',
        'Commission 5% (INR)',
        'Total Collected (INR)'
      ];

      const rows = filtered.map(r => [
        r.id,
        r.completedAt,
        r.passengerName,
        r.passengerEmail,
        r.driverName || 'N/A',
        r.driverEmail || 'N/A',
        r.pickup,
        r.dropoff,
        r.totalKm || 0,
        r.isIntercity ? 'Yes' : 'No',
        r.fare,
        r.gst || '0.00',
        r.commission || '0.00',
        r.totalCollected || '0.00'
      ]);

      const csvRows = [headers.map(h => `"${h}"`).join(',')];
      rows.forEach(r => {
        csvRows.push(r.map(val => `"${val}"`).join(','));
      });

      const csvContent = "data:text/csv;charset=utf-8," + csvRows.join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `hum_fleet_${range}_report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error generating report:', err);
      alert('Failed to connect to report API.');
    }
  };

  // Admin clears a driver's pending balance (restores cash trip access)
  const handleClearBalance = async (driverId, driverName, amount) => {
    if (!window.confirm(`Mark ₹${parseFloat(amount).toFixed(2)} pending balance of ${driverName} as paid and clear it?`)) return;
    try {
      const response = await fetch(`${API_BASE}/api/admin/drivers/${driverId}/clear-balance`, {
        method: 'POST'
      });
      if (response.ok) {
        const data = await response.json();
        alert(`✅ Balance of ₹${parseFloat(data.clearedAmount).toFixed(2)} cleared for ${driverName}. Cash trips restored.`);
        fetchDrivers();
      } else {
        alert('Failed to clear balance.');
      }
    } catch (err) {
      console.error('Error clearing balance:', err);
      alert('Failed to connect to server.');
    }
  };

  const handleOpenCollectCashModal = (driver) => {
    setSelectedLedgerDriver(driver);
    setCollectAmount(parseFloat(driver.wallet?.toBePaid || 0).toFixed(2));
    setStatementImageSrc(null);
    setShowCollectCashModal(true);
    // Let state apply first, then generate statement image
    setTimeout(() => {
      generateStatementImage(driver);
    }, 100);
  };

  const generatePaidReceiptCanvas = (driver, amountPaid, receiptId, paymentDate, remainingBalance) => {
    const canvas = document.createElement('canvas');
    canvas.width = 650;
    canvas.height = 780;
    const ctx = canvas.getContext('2d');

    // Background Gradient (Dark Slate & Emerald)
    const grad = ctx.createLinearGradient(0, 0, 0, 780);
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(1, '#1e293b');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 650, 780);

    // Border Frame
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 4;
    ctx.strokeRect(15, 15, 620, 750);

    // WATERMARK (HUM FLEET PLATFORMS)
    ctx.save();
    ctx.translate(325, 390);
    ctx.rotate(-25 * Math.PI / 180);
    if (watermarkLogo) {
      ctx.globalAlpha = 0.08;
      const imgWidth = 400;
      const imgHeight = (watermarkLogo.height / watermarkLogo.width) * imgWidth;
      ctx.drawImage(watermarkLogo, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);
    } else {
      ctx.fillStyle = 'rgba(16, 185, 129, 0.08)';
      ctx.font = 'bold 58px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('HUM FLEET', 0, -30);
      ctx.font = 'bold 32px Arial, sans-serif';
      ctx.fillText('OFFICIAL RECEIPT', 0, 20);
    }
    ctx.restore();

    // Header Logo & Company Name
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 24px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('HUM FLEET PLATFORMS', 325, 65);

    // Receipt Subtitle
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 15px Arial, sans-serif';
    ctx.fillText('OFFICIAL PAYMENT RECEIPT & TAX INVOICE', 325, 95);

    // Receipt Meta Box
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.fillRect(40, 115, 570, 45);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.strokeRect(40, 115, 570, 45);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px Arial, sans-serif';
    ctx.fillText(`Receipt No: ${receiptId}`, 55, 142);
    ctx.textAlign = 'right';
    ctx.fillText(`Date & Time: ${paymentDate}`, 595, 142);

    // DRIVER INFORMATION BOX (Name, Phone, Vehicle Number)
    ctx.fillStyle = 'rgba(16, 185, 129, 0.05)';
    ctx.fillRect(40, 175, 570, 140);
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.3)';
    ctx.strokeRect(40, 175, 570, 140);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 14px Arial, sans-serif';
    ctx.fillText('DRIVER PARTNER DETAILS', 55, 200);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '13px Arial, sans-serif';
    ctx.fillText(`Driver Name:`, 55, 230);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px Arial, sans-serif';
    ctx.fillText(driver.name || 'Partner', 160, 230);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '13px Arial, sans-serif';
    ctx.fillText(`Mobile No:`, 55, 260);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px Arial, sans-serif';
    ctx.fillText(driver.phone || 'N/A', 160, 260);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '13px Arial, sans-serif';
    ctx.fillText(`Vehicle Reg:`, 55, 290);
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 15px monospace';
    ctx.fillText(`${driver.manufacturer || ''} ${driver.model || ''} (${driver.plate || 'N/A'})`, 160, 290);

    // PAYMENT BREAKDOWN TABLE
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.fillRect(40, 330, 570, 35);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px Arial, sans-serif';
    ctx.fillText('Description', 55, 352);
    ctx.textAlign = 'right';
    ctx.fillText('Amount (INR)', 595, 352);

    const comm = (parseFloat(amountPaid) * 0.5).toFixed(2);
    const gst = (parseFloat(amountPaid) * 0.5).toFixed(2);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '13px Arial, sans-serif';
    ctx.fillText('Platform Base Commission (5%)', 55, 395);
    ctx.fillText('Government GST Tax (5%)', 55, 430);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#10b981';
    ctx.fillText(`₹${comm}`, 595, 395);
    ctx.fillText(`₹${gst}`, 595, 430);

    // TOTAL AMOUNT RECEIVED BOX
    ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
    ctx.fillRect(40, 460, 570, 50);
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(40, 460, 570, 50);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 16px Arial, sans-serif';
    ctx.fillText('TOTAL PAYMENT RECEIVED', 55, 492);

    ctx.textAlign = 'right';
    ctx.font = 'bold 22px Arial, sans-serif';
    ctx.fillText(`₹${parseFloat(amountPaid).toFixed(2)}`, 595, 492);

    // REMAINING BALANCE STATUS
    ctx.textAlign = 'left';
    ctx.fillStyle = '#94a3b8';
    ctx.font = '13px Arial, sans-serif';
    ctx.fillText('Remaining Dues Balance:', 55, 540);
    ctx.fillStyle = parseFloat(remainingBalance) > 0 ? '#ef4444' : '#10b981';
    ctx.font = 'bold 14px Arial, sans-serif';
    ctx.fillText(parseFloat(remainingBalance) > 0 ? `₹${parseFloat(remainingBalance).toFixed(2)}` : '₹0.00 (PAID IN FULL)', 220, 540);

    // OFFICIAL "PAID" SEAL STAMP (DRAWN ON CANVAS)
    ctx.save();
    ctx.translate(480, 630);
    ctx.rotate(-12 * Math.PI / 180);
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3.5;
    ctx.strokeRect(-90, -40, 180, 80);
    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-84, -34, 168, 68);

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 26px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('PAID', 0, -4);

    ctx.font = 'bold 10px Arial, sans-serif';
    ctx.fillText('PAYMENT RECEIVED', 0, 14);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '9px Arial, sans-serif';
    ctx.fillText('HUM FLEET VERIFIED', 0, 28);
    ctx.restore();

    // FOOTER NOTICE
    ctx.textAlign = 'center';
    ctx.fillStyle = '#64748b';
    ctx.font = '11px Arial, sans-serif';
    ctx.fillText('Computer-generated official receipt · HUM Fleet Platforms Pvt. Ltd.', 325, 740);

    return canvas.toDataURL('image/png');
  };

  const handlePrintPDFReceipt = (details) => {
    if (!details) return;
    const { driver, amountPaid, receiptId, paymentDate, remainingBalance } = details;
    const win = window.open('', '_blank', 'width=800,height=900');
    if (!win) {
      alert('Pop-up blocked! Please allow pop-ups to view/print PDF receipt.');
      return;
    }
    const comm = (parseFloat(amountPaid) * 0.5).toFixed(2);
    const gst = (parseFloat(amountPaid) * 0.5).toFixed(2);
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>HUM Fleet Payment Receipt - ${receiptId}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
          body {
            font-family: 'Inter', sans-serif;
            background-color: #f8fafc;
            color: #0f172a;
            margin: 0;
            padding: 40px 20px;
            display: flex;
            justify-content: center;
          }
          .receipt-box {
            position: relative;
            background: #ffffff;
            width: 100%;
            max-width: 680px;
            border-radius: 16px;
            border: 2px solid #e2e8f0;
            padding: 40px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.08);
            overflow: hidden;
          }
          /* WATERMARK */
          .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-30deg);
            font-size: 72px;
            font-weight: 900;
            color: rgba(16, 185, 129, 0.08);
            white-space: nowrap;
            pointer-events: none;
            user-select: none;
            text-transform: uppercase;
            letter-spacing: 4px;
          }
          .watermark-sub {
            position: absolute;
            top: 25%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-30deg);
            font-size: 36px;
            font-weight: 800;
            color: rgba(16, 185, 129, 0.05);
            white-space: nowrap;
            pointer-events: none;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px dashed #cbd5e1;
            padding-bottom: 20px;
            margin-bottom: 24px;
          }
          .brand-logo {
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .logo-badge {
            background: #10b981;
            color: #ffffff;
            font-weight: 900;
            padding: 8px 14px;
            border-radius: 10px;
            font-size: 18px;
            letter-spacing: 1px;
          }
          .company-name {
            font-size: 18px;
            font-weight: 800;
            color: #0f172a;
          }
          .receipt-title {
            text-align: right;
          }
          .receipt-title h2 {
            margin: 0;
            font-size: 18px;
            font-weight: 800;
            color: #10b981;
            text-transform: uppercase;
          }
          .receipt-meta {
            font-size: 12px;
            color: #64748b;
            margin-top: 4px;
          }
          .details-card {
            background: #f1f5f9;
            border: 1px solid #cbd5e1;
            border-radius: 12px;
            padding: 16px 20px;
            margin-bottom: 24px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
          }
          .detail-item {
            font-size: 13px;
          }
          .detail-label {
            color: #64748b;
            font-weight: 600;
            font-size: 11px;
            text-transform: uppercase;
            margin-bottom: 2px;
          }
          .detail-val {
            font-weight: 800;
            color: #0f172a;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 24px;
          }
          th {
            background: #0f172a;
            color: #ffffff;
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            padding: 10px 14px;
            text-align: left;
          }
          td {
            padding: 12px 14px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 13px;
          }
          .total-row td {
            font-weight: 800;
            font-size: 15px;
            background: #f8fafc;
            border-top: 2px solid #0f172a;
          }
          .seal-container {
            position: absolute;
            bottom: 60px;
            right: 40px;
            transform: rotate(-12deg);
            pointer-events: none;
          }
          .paid-seal {
            border: 4px double #10b981;
            color: #10b981;
            padding: 10px 20px;
            border-radius: 12px;
            text-align: center;
            background: rgba(255, 255, 255, 0.92);
            box-shadow: 0 4px 15px rgba(16, 185, 129, 0.2);
          }
          .paid-seal-text {
            font-size: 26px;
            font-weight: 900;
            letter-spacing: 3px;
            text-transform: uppercase;
            line-height: 1;
          }
          .paid-seal-sub {
            font-size: 9px;
            font-weight: 800;
            letter-spacing: 1px;
            margin-top: 4px;
            text-transform: uppercase;
          }
          .footer {
            margin-top: 40px;
            border-top: 1px solid #e2e8f0;
            padding-top: 16px;
            font-size: 11px;
            color: #94a3b8;
            display: flex;
            justify-content: space-between;
          }
          @media print {
            body { background: #ffffff; padding: 0; }
            .receipt-box { border: none; box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="receipt-box">
          <div class="watermark">HUM FLEET</div>
          <div class="watermark-sub">HUM FLEET PLATFORMS</div>
          
          <div class="header">
            <div class="brand-logo">
              <img src="${window.location.origin}/hum_fleet_official_logo.jpg" alt="HUM Logo" style="height: 40px; margin-right: 12px; border-radius: 8px;" />
              <div>
                <div class="company-name">HUM FLEET PLATFORMS</div>
                <div style="font-size: 11px; color: #64748b;">Operations Control & Settlement Center</div>
              </div>
            </div>
            <div class="receipt-title">
              <h2>OFFICIAL RECEIPT</h2>
              <div class="receipt-meta">Receipt #: <strong>${receiptId}</strong></div>
              <div class="receipt-meta">Date: ${paymentDate}</div>
            </div>
          </div>

          <div class="details-card">
            <div class="detail-item">
              <div class="detail-label">Driver Partner Name</div>
              <div class="detail-val">${driver.name}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Mobile Contact Number</div>
              <div class="detail-val">${driver.phone}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Vehicle Model & Make</div>
              <div class="detail-val">${driver.manufacturer || ''} ${driver.model || 'N/A'}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Vehicle Plate / Registration Number</div>
              <div class="detail-val" style="font-family: monospace; font-size: 14px; color: #10b981;">${driver.plate || 'N/A'}</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Description / Breakdown</th>
                <th style="text-align: right;">Amount (INR)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Platform Base Commission (5%)</td>
                <td style="text-align: right;">₹${comm}</td>
              </tr>
              <tr>
                <td>Government GST Tax (5%)</td>
                <td style="text-align: right;">₹${gst}</td>
              </tr>
              <tr class="total-row">
                <td style="color: #10b981;">TOTAL PAYMENT RECEIVED</td>
                <td style="text-align: right; color: #10b981; font-size: 18px;">₹${parseFloat(amountPaid).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          <div style="background: rgba(16,185,129,0.06); border: 1px solid rgba(16,185,129,0.2); padding: 12px 16px; border-radius: 10px; margin-bottom: 24px; display: flex; justify-content: space-between; font-size: 13px;">
            <span style="color: #64748b; font-weight: 600;">Remaining Platform Dues Balance:</span>
            <strong style="color: ${parseFloat(remainingBalance) > 0 ? '#ef4444' : '#10b981'}; font-weight: 800;">
              ${parseFloat(remainingBalance) > 0 ? `₹${parseFloat(remainingBalance).toFixed(2)}` : '✓ ZERO DUES (PAID IN FULL)'}
            </strong>
          </div>

          <div class="seal-container">
            <div class="paid-seal">
              <div class="paid-seal-text">★ PAID ★</div>
              <div class="paid-seal-sub">PAYMENT RECEIVED</div>
              <div style="font-size: 8px; margin-top: 2px; color: #64748b;">HUM FLEET VERIFIED</div>
            </div>
          </div>

          <div class="footer">
            <span>Computer generated official tax invoice receipt. Valid without physical signature.</span>
            <span>HUM Fleet Platforms Pvt. Ltd.</span>
          </div>
        </div>
        <script>
          window.onload = () => { window.print(); };
        </script>
      </body>
      </html>
    `);
    win.document.close();
  };

  const handleSharePaidReceiptWhatsApp = () => {
    if (!paidReceiptDetails || !paidReceiptImageSrc) return;
    const { driver, amountPaid, receiptId, remainingBalance } = paidReceiptDetails;

    const img = new Image();
    img.src = paidReceiptImageSrc;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(async (blob) => {
        try {
          const item = new ClipboardItem({ "image/png": blob });
          await navigator.clipboard.write([item]);
          alert("📋 Watermarked Official Receipt image copied to clipboard! Opening WhatsApp... You can paste (Ctrl+V) the receipt image directly into the driver's chat.");
        } catch (err) {
          console.error("Clipboard copy failed:", err);
          alert("Opening WhatsApp Web with text receipt notification.");
        }

        const phone = driver.phone.replace(/[^0-9]/g, '');
        const formattedPhone = phone.length === 10 ? `91${phone}` : phone;
        const msg = encodeURIComponent(`Dear ${driver.name} (Phone: ${driver.phone}, Vehicle: ${driver.manufacturer || ''} ${driver.model || ''} - ${driver.plate || 'N/A'}), your payment of ₹${parseFloat(amountPaid).toFixed(2)} has been RECEIVED & VERIFIED by HUM Fleet. Receipt #: ${receiptId}. Remaining Balance: ₹${remainingBalance}. (Official Watermarked PDF Receipt image has been copied to your clipboard - press Ctrl+V to paste it).`);
        window.open(`https://web.whatsapp.com/send?phone=${formattedPhone}&text=${msg}`, '_blank');
      });
    };
  };

  const handleCollectCash = async (e) => {
    e.preventDefault();
    if (!selectedLedgerDriver || isSubmittingCollection) return;
    setIsSubmittingCollection(true);
    try {
      const amountVal = parseFloat(collectAmount);
      const response = await fetch(`${API_BASE}/api/admin/drivers/${selectedLedgerDriver.id}/collect-cash`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount: amountVal })
      });
      if (response.ok) {
        const receiptId = `HUM-REC-${Date.now().toString().slice(-6)}`;
        const paymentDate = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
        const remBal = Math.max(0, (selectedLedgerDriver.wallet?.toBePaid || 0) - amountVal).toFixed(2);
        
        const details = {
          driver: selectedLedgerDriver,
          amountPaid: amountVal,
          receiptId,
          paymentDate,
          remainingBalance: remBal
        };

        const canvasDataUrl = generatePaidReceiptCanvas(selectedLedgerDriver, amountVal, receiptId, paymentDate, remBal);

        setPaidReceiptDetails(details);
        setPaidReceiptImageSrc(canvasDataUrl);
        setShowCollectCashModal(false);
        setShowPaymentReceivedModal(true);
        fetchDrivers();
      } else {
        alert('Failed to record cash payment.');
      }
    } catch (err) {
      console.error('Error collecting cash:', err);
      alert('Failed to connect to server.');
    } finally {
      setIsSubmittingCollection(false);
    }
  };

  const generateStatementImage = (driver) => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 700;
    const ctx = canvas.getContext('2d');

    // Draw background gradient (sleek dark design)
    const grad = ctx.createLinearGradient(0, 0, 0, 700);
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(1, '#1e293b');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 600, 700);

    // Draw header border
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
    ctx.lineWidth = 4;
    ctx.strokeRect(15, 15, 570, 670);

    // WATERMARK
    if (watermarkLogo) {
      ctx.save();
      ctx.translate(300, 350);
      ctx.rotate(-25 * Math.PI / 180);
      ctx.globalAlpha = 0.05;
      const imgWidth = 400;
      const imgHeight = (watermarkLogo.height / watermarkLogo.width) * imgWidth;
      ctx.drawImage(watermarkLogo, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);
      ctx.restore();
    }

    // Title logo
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 24px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('HUM FLEET PLATFORMS', 300, 70);

    // Subtitle
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Arial, sans-serif';
    ctx.fillText('OUTSTANDING DUES STATEMENT', 300, 105);

    // Metadata lines
    ctx.textAlign = 'left';
    ctx.fillStyle = '#94a3b8';
    ctx.font = '13px Arial, sans-serif';
    ctx.fillText(`Statement Date: ${new Date().toLocaleDateString('en-IN')}`, 45, 160);
    ctx.fillText(`Driver Partner: ${driver.name}`, 45, 190);
    ctx.fillText(`Phone Number: ${driver.phone}`, 45, 220);
    ctx.fillText(`Vehicle Model: ${driver.manufacturer || 'N/A'} ${driver.model || 'N/A'}`, 45, 250);
    ctx.fillText(`Plate Number: ${driver.plate || 'N/A'}`, 45, 280);

    // Table Header Box
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.fillRect(45, 320, 510, 40);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px Arial, sans-serif';
    ctx.fillText('Description', 60, 345);
    ctx.textAlign = 'right';
    ctx.fillText('Amount (INR)', 530, 345);

    // Itemized values
    ctx.textAlign = 'left';
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '14px Arial, sans-serif';
    ctx.fillText('Platform Base Commission (5%)', 60, 395);
    ctx.fillText('Government GST on Commission (5%)', 60, 435);

    const pending = parseFloat(driver.wallet?.toBePaid || 0);
    const comm = pending * 0.5;
    const gst = pending * 0.5;

    ctx.textAlign = 'right';
    ctx.fillStyle = '#ef4444';
    ctx.fillText(`-₹${comm.toFixed(2)}`, 530, 395);
    ctx.fillText(`-₹${gst.toFixed(2)}`, 530, 435);

    // Total box
    ctx.fillStyle = 'rgba(239, 68, 68, 0.1)';
    ctx.fillRect(45, 470, 510, 50);
    ctx.textAlign = 'left';
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 15px Arial, sans-serif';
    ctx.fillText('Total Outstanding Dues', 60, 502);
    ctx.textAlign = 'right';
    ctx.fillText(`-₹${pending.toFixed(2)}`, 530, 502);

    // Payment Info Section
    ctx.textAlign = 'center';
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 12px Arial, sans-serif';
    ctx.fillText('PAYMENT INSTRUCTIONS', 300, 560);
    ctx.font = '12px Arial, sans-serif';
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText('Please settle your platform dues directly via the Driver Partner App', 300, 585);
    ctx.fillText('or transfer using UPI ID: humfleet@okaxis', 300, 608);

    // Footer notice
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 11px Arial, sans-serif';
    ctx.fillText('⚠️ Notice: Cash trip access will be locked if dues exceed ₹1,500.', 300, 650);

    // Set state
    setStatementImageSrc(canvas.toDataURL('image/png'));
  };

  const handleShareWhatsApp = () => {
    if (!selectedLedgerDriver || !statementImageSrc) return;

    // Create a temporary image to generate blob
    const img = new Image();
    img.src = statementImageSrc;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(async (blob) => {
        try {
          const item = new ClipboardItem({ "image/png": blob });
          await navigator.clipboard.write([item]);
          alert("📋 Statement invoice image copied to clipboard! Opening WhatsApp... You can paste (Ctrl+V) the statement image directly into the driver's chat.");
        } catch (err) {
          console.error("Clipboard copy failed:", err);
          alert("Could not automatically copy image to clipboard. Opening WhatsApp Web with text statement reminder.");
        }

        // Open WhatsApp Web
        const phone = selectedLedgerDriver.phone.replace(/[^0-9]/g, '');
        const formattedPhone = phone.length === 10 ? `91${phone}` : phone;
        const reminderText = encodeURIComponent(`Dear ${selectedLedgerDriver.name}, here is your outstanding HUM Fleet platform dues statement of -₹${parseFloat(selectedLedgerDriver.wallet?.toBePaid || 0).toFixed(2)}. Please settle it immediately. (Invoice statement image statement has been copied to your clipboard - press Ctrl+V to paste it).`);
        window.open(`https://web.whatsapp.com/send?phone=${formattedPhone}&text=${reminderText}`, '_blank');
      }, "image/png");
    };
  };

  const handleSaveCredentials = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');

    try {
      const response = await fetch(`${API_BASE}/api/admin/update-credentials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: adminUsername,
          currentPassword,
          newPassword
        })
      });

      if (response.ok) {
        setProfileSuccess('Console credentials updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
      } else {
        const data = await response.json();
        setProfileError(data.error || 'Failed to update credentials.');
      }
    } catch (err) {
      console.error(err);
      setProfileError('Failed to connect to authentication server.');
    }
  };

  const getPhotoSrc = (side, data) => {
    if (data && data.startsWith('data:')) {
      return data;
    }
    return MOCK_PHOTOS[side] || MOCK_PHOTOS.front;
  };

  const getDocSrc = (data) => {
    if (data && data.startsWith('data:')) {
      return data;
    }
    return MOCK_PHOTOS.document;
  };

  const handleOpenPreview = (data, title) => {
    setPreviewFile(data);
    setPreviewTitle(title);
  };

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
              <AlertCircle size={20} />
            </button>
            <button className="icon-btn" onClick={handleAdminLogout}>
              <LogOut size={20} />
            </button>
          </div>
        </header>

        <main className="admin-content glass-card">
          <ErrorBoundary>
            {activeTab === 'approvals' && (
              <ApprovalsQueue 
                drivers={drivers}
                driverSearch={driverSearch}
                setDriverSearch={setDriverSearch}
                filteredPendingDrivers={filteredPendingDrivers}
                selectedDriver={selectedDriver}
                setSelectedDriver={setSelectedDriver}
                handleApprove={handleApprove}
                handleReject={handleReject}
                handleUpdateDriverCategory={handleUpdateDriverCategory}
                categories={categories}
                handleOpenPreview={handleOpenPreview}
                getPhotoSrc={getPhotoSrc}
                getDocSrc={getDocSrc}
                setMessageModalDriver={setMessageModalDriver}
                fetchChatMessages={fetchChatMessages}
              />
            )}
            
            {activeTab === 'partners' && (
              <RegisteredPartners 
                filteredApprovedDrivers={filteredApprovedDrivers}
                approvedDriversCount={approvedDriversCount}
                registeredDriverSearch={registeredDriverSearch}
                setRegisteredDriverSearch={setRegisteredDriverSearch}
                handleUnblockDriver={handleUnblockDriver}
                handleBlockDriver={handleBlockDriver}
                handleReject={handleReject}
                handleDeleteDriver={handleDeleteDriver}
                setSelectedDriver={setSelectedDriver}
                setMessageModalDriver={setMessageModalDriver}
                fetchChatMessages={fetchChatMessages}
                page={driverPage}
                setPage={setDriverPage}
                totalPages={totalDriverPages}
                totalItems={totalDrivers}
                setShowAddDriverModal={setShowAddDriverModal}
              />
            )}
            
            {activeTab === 'passengers' && (
              <RegisteredPassengers 
                activeTab={activeTab}
                setShowAddPassengerModal={setShowAddPassengerModal}
                passengerSearch={passengerSearch}
                setPassengerSearch={setPassengerSearch}
                filteredPassengers={filteredPassengers}
                handleDeletePassenger={handleDeletePassenger}
                setMessageModalPassenger={setMessageModalPassenger}
                page={passengerPage}
                setPage={setPassengerPage}
                totalPages={totalPassengerPages}
                totalItems={totalPassengers}
              />
            )}
            
            {activeTab === 'fleet' && (
              <FleetMonitor 
                fleetEntity={fleetEntity}
                setFleetEntity={setFleetEntity}
                fleetData={fleetData}
                fleetSearch={fleetSearch}
                setFleetSearch={setFleetSearch}
                fleetFilter={fleetFilter}
                setFleetFilter={setFleetFilter}
                setSelectedMapDriver={setSelectedMapDriver}
                setMessageModalDriver={setMessageModalDriver}
                fetchChatMessages={fetchChatMessages}
              />
            )}
            
            {activeTab === 'ledger' && (
              <Ledger 
                ledgerFilter={ledgerFilter}
                setLedgerFilter={setLedgerFilter}
                ledgerSearch={ledgerSearch}
                setLedgerSearch={setLedgerSearch}
                filteredLedgerDrivers={filteredLedgerDrivers}
                downloadDailyLedgerCSV={downloadDailyLedgerCSV}
                downloadLedgerCSV={downloadLedgerCSV}
                handleOpenCollectCashModal={handleOpenCollectCashModal}
                downloadReportCSV={downloadReportCSV}
              />
            )}
            
            {activeTab === 'payments' && (
              <PendingPayments 
                activeTab={activeTab}
                pendingSearch={pendingSearch}
                setPendingSearch={setPendingSearch}
                pendingFilter={pendingFilter}
                setPendingFilter={setPendingFilter}
                downloadPendingPaymentsCSV={downloadPendingPaymentsCSV}
                pendingPaymentsData={pendingPaymentsData}
                filteredPendingPayments={filteredPendingPayments}
                setSelectedLedgerDriver={setSelectedLedgerDriver}
                setCollectAmount={setCollectAmount}
                setShowCollectCashModal={setShowCollectCashModal}
                drivers={drivers}
                setMessageModalDriver={setMessageModalDriver}
                fetchChatMessages={fetchChatMessages}
              />
            )}
            
            {activeTab === 'analytics' && (
              <Analytics activeTab={activeTab} />
            )}
            
            {activeTab === 'staff' && (
              <StaffManagement 
                activeTab={activeTab}
                employees={employees}
                setShowAddEmployeeModal={setShowAddEmployeeModal}
                setSelectedEmployeeForDetails={setSelectedEmployeeForDetails}
                API_BASE={API_BASE}
                fetchEmployees={fetchEmployees}
              />
            )}
            
            {activeTab === 'promotions' && <Promotions activeTab={activeTab} API_BASE={API_BASE} />}
            
            {activeTab === 'broadcasts' && (
              <GlobalBroadcasts 
                activeTab={activeTab}
                broadcastMessage={broadcastText}
                setBroadcastMessage={setBroadcastText}
                handleBroadcastAll={handleBroadcastAll}
                handleBroadcastToOffline={handleBroadcastToOffline}
              />
            )}
            
            {activeTab === 'settings' && (
              <SystemSettings 
                baseFare={baseFare} setBaseFare={setBaseFare}
                ratePerKm={ratePerKm} setRatePerKm={setRatePerKm}
                minRatePerHour={minRatePerHour} setMinRatePerHour={setMinRatePerHour}
                surgeMultiplier={surgeMultiplier} setSurgeMultiplier={setSurgeMultiplier}
                systemStatus={systemStatus} setSystemStatus={setSystemStatus}
                voipMasking={voipMasking} setVoipMasking={setVoipMasking}
                gatewayType={gatewayType} setGatewayType={setGatewayType}
                accountHolder={accountHolder} setAccountHolder={setAccountHolder}
                upiId={upiId} setUpiId={setUpiId}
                qrCodeUrl={qrCodeUrl} setQrCodeUrl={setQrCodeUrl}
                bankName={bankName} setBankName={setBankName}
                accountNo={accountNo} setAccountNo={setAccountNo}
                ifscCode={ifscCode} setIfscCode={setIfscCode}
                handleSaveSettings={handleSaveSettings}
                categories={categories}
                catName={catName} setCatName={setCatName}
                catPassengers={catPassengers} setCatPassengers={setCatPassengers}
                catBaseFare={catBaseFare} setCatBaseFare={setCatBaseFare}
                catRatePerKm={catRatePerKm} setCatRatePerKm={setCatRatePerKm}
                editingCategory={editingCategory}
                handleStartEdit={handleStartEdit}
                handleCancelEdit={handleCancelEdit}
                handleDeleteCategory={handleDeleteCategory}
                handleAddCategory={handleAddCategory}
              />
            )}
            
            {activeTab === 'security' && (
              <SecurityCredentials 
                activeTab={activeTab}
                handleAdminLogout={handleAdminLogout}
                newLocName={newLocName} setNewLocName={setNewLocName}
                newLocLat={newLocLat} setNewLocLat={setNewLocLat}
                newLocLng={newLocLng} setNewLocLng={setNewLocLng}
                fetchLocations={fetchLocations}
                businessListings={businessListings}
                profileError={profileError}
                profileSuccess={profileSuccess}
                handleSaveCredentials={handleSaveCredentials}
                adminUsername={adminUsername} setAdminUsername={setAdminUsername}
                currentPassword={currentPassword} setCurrentPassword={setCurrentPassword}
                newPassword={newPassword} setNewPassword={setNewPassword}
                API_BASE={API_BASE}
              />
            )}
          </ErrorBoundary>
        </main>
      </div>

      {/* ========== ADD PARTNER MODAL ========== */}
      {showAddDriverModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-card animate-scale-in" style={{ maxWidth: '500px', width: '100%', padding: '32px' }}>
            <h3 style={{ margin: '0 0 24px 0', fontSize: '20px', fontWeight: '800' }}>Add New Driver Partner</h3>
            <form onSubmit={handleAddDriver} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input type="text" placeholder="Full Name" className="input-field" value={newDriverData.name} onChange={(e) => setNewDriverData({...newDriverData, name: e.target.value})} required />
              <input type="email" placeholder="Email Address" className="input-field" value={newDriverData.email} onChange={(e) => setNewDriverData({...newDriverData, email: e.target.value})} required />
              <input type="tel" placeholder="Phone Number" className="input-field" value={newDriverData.phone} onChange={(e) => setNewDriverData({...newDriverData, phone: e.target.value})} required />
              <input type="text" placeholder="License Number" className="input-field" value={newDriverData.licenseNumber} onChange={(e) => setNewDriverData({...newDriverData, licenseNumber: e.target.value})} required />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <select className="input-field" value={newDriverData.vehicleType} onChange={(e) => setNewDriverData({...newDriverData, vehicleType: e.target.value})} required>
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id || cat._id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
                <input type="text" placeholder="Plate Number" className="input-field" value={newDriverData.plateNumber} onChange={(e) => setNewDriverData({...newDriverData, plateNumber: e.target.value})} required />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <Button type="button" variant="outline" onClick={() => setShowAddDriverModal(false)}>Cancel</Button>
                <Button type="submit" variant="primary">Add Driver</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========== ADD PASSENGER MODAL ========== */}
      {showAddPassengerModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-card animate-scale-in" style={{ maxWidth: '400px', width: '100%', padding: '32px' }}>
            <h3 style={{ margin: '0 0 24px 0', fontSize: '20px', fontWeight: '800' }}>Add New Passenger</h3>
            <form onSubmit={handleAddPassenger} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input type="text" placeholder="Full Name" className="input-field" value={newPassengerData.name} onChange={(e) => setNewPassengerData({...newPassengerData, name: e.target.value})} required />
              <input type="email" placeholder="Email Address" className="input-field" value={newPassengerData.email} onChange={(e) => setNewPassengerData({...newPassengerData, email: e.target.value})} required />
              <input type="tel" placeholder="Phone Number" className="input-field" value={newPassengerData.phone} onChange={(e) => setNewPassengerData({...newPassengerData, phone: e.target.value})} required />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <Button type="button" variant="outline" onClick={() => setShowAddPassengerModal(false)}>Cancel</Button>
                <Button type="submit" variant="primary">Add Passenger</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========== PARTNER DETAILS MODAL ========== */}
      {selectedDriver && activeTab === 'partners' && (
        <div className="modal-overlay" onClick={() => setSelectedDriver(null)}>
          <div className="modal-content glass-card animate-scale-in" onClick={e => e.stopPropagation()} style={{ maxWidth: '750px', width: '100%', padding: '32px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '22px', fontWeight: '800' }}>Partner Profile: {selectedDriver.name}</h3>
              <button onClick={() => setSelectedDriver(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Profile grid */}
              <div className="profile-grid">
                <div><strong>Phone:</strong> {selectedDriver.phone}</div>
                <div><strong>Email:</strong> {selectedDriver.email}</div>
                {selectedDriver.licenseNumber && (
                   <div style={{ gridColumn: '1 / -1' }}><strong>Licence Number:</strong> <span style={{ fontFamily: 'monospace', fontWeight: '800', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>{selectedDriver.licenseNumber}</span></div>
                )}
                <div><strong>Vehicle Category:</strong> {selectedDriver.vehicleCategory || 'Not Assigned'}</div>
                <div><strong>Vehicle Make:</strong> {selectedDriver.manufacturer}</div>
                <div><strong>Vehicle Model:</strong> {selectedDriver.model}</div>
                <div><strong>Mfg. Year:</strong> {selectedDriver.year}</div>
                <div><strong>Plate No:</strong> {selectedDriver.plate}</div>
                <div><strong>Minimum Rate/KM:</strong> ₹{selectedDriver.ratePerKm || '15.00'}</div>
                <div><strong>Minimum Rate/Hour:</strong> ₹{selectedDriver.ratePerHour || '120.00'}</div>
              </div>

              {/* Bank account */}
              <div style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', background: 'rgba(255,255,255,0.01)' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '800' }}>
                  <DollarSign size={16} color="var(--primary)"/> Bank Account Details
                </h4>
                {selectedDriver.bank ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
                    <div><strong>Holder Name:</strong> {selectedDriver.bank.holderName || 'N/A'}</div>
                    <div><strong>Bank Name:</strong> {selectedDriver.bank.bankName || 'N/A'}</div>
                    <div><strong>Account No:</strong> {selectedDriver.bank.accountNumber || 'N/A'}</div>
                    <div><strong>IFSC Code:</strong> {selectedDriver.bank.ifscCode || 'N/A'}</div>
                  </div>
                ) : (
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No bank details provided.</div>
                )}
              </div>

              {/* Ledger */}
              <div style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', background: 'rgba(255,255,255,0.01)' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '800' }}><DollarSign size={16} color="var(--primary)"/> Partner Ledger (Cash Runs)</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
                  <div><strong>Collected Cash:</strong> ₹{parseFloat(selectedDriver.wallet?.cashCollected || 0).toFixed(2)}</div>
                  <div style={{ color: '#ef4444' }}><strong>Platform Debt Due:</strong> ₹{parseFloat(selectedDriver.wallet?.toBePaid || 0).toFixed(2)}</div>
                </div>
              </div>

              {/* Face selfie */}
              <div className="doc-section">
                <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px' }}>Registration Live Face Selfie</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <div 
                    className="clickable-thumb" 
                    onClick={() => handleOpenPreview(selectedDriver.profilePic || selectedDriver.facePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600', `${selectedDriver.name} Live Face Selfie`)}
                    style={{ width: '70px', height: '70px', borderRadius: '50%', overflow: 'hidden', border: '3px solid var(--primary)', flexShrink: 0 }}
                  >
                    <img 
                      src={selectedDriver.profilePic || selectedDriver.facePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600'} 
                      alt="Face Verification" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-main)' }}>Live Face Verification Captured</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Camera selfie captured during driver registration flow.</div>
                    <div style={{ fontSize: '12px', color: '#10b981', fontWeight: '700', marginTop: '2px' }}>✓ Facial Geometry Validated</div>
                  </div>
                </div>
              </div>

              {/* Vehicle Photos */}
              <div className="doc-section">
                <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px' }}>Uploaded Vehicle Photos</h4>
                <div className="admin-docs-grid">
                  {Object.entries(selectedDriver.photos || {}).map(([side, data]) => {
                    const src = getPhotoSrc(side, data);
                    return (
                      <div key={side} className="admin-doc-thumbnail clickable-thumb" onClick={() => handleOpenPreview(src, `${side.charAt(0).toUpperCase() + side.slice(1)} View`)}>
                        <img src={src} alt={side} style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                        <span className="thumb-label" style={{ marginTop: '4px' }}>{side.charAt(0).toUpperCase() + side.slice(1)} view</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Compliance documents */}
              <div className="doc-section">
                <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px' }}>Compliance Documents</h4>
                <div className="admin-docs-grid">
                  {[
                    { id: 'rc', label: 'Registration (RC)' },
                    { id: 'pollution', label: 'Pollution (PUC)' },
                    { id: 'insurance', label: 'Insurance' },
                    { id: 'fitness', label: 'Fitness Cert.' },
                    { id: 'license', label: 'Driving Licence (DL)' },
                    { id: 'licenseFront', label: 'DL (Front)' },
                    { id: 'licenseBack', label: 'DL (Back)' }
                  ].filter(doc => selectedDriver.docs?.[doc.id]).map((doc) => {
                    const data = selectedDriver.docs?.[doc.id];
                    const src = getDocSrc(data);
                    return (
                      <div key={doc.id} className="admin-doc-thumbnail doc-pdf clickable-thumb" onClick={() => handleOpenPreview(src, doc.label)}>
                        {data && data.startsWith('data:image') ? (
                          <img src={data} alt={doc.label} style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '12px 0' }}>
                            <FileText size={28} color="var(--secondary)" />
                          </div>
                        )}
                        <span className="thumb-label">{doc.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
              <Button variant="outline" onClick={() => setSelectedDriver(null)}>Close Profile</Button>
            </div>
          </div>
        </div>
      )}

      {/* ========== COLLECT CASH MODAL ========== */}
      {showCollectCashModal && selectedLedgerDriver && (
        <div className="modal-overlay" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', position: 'fixed', inset: 0, zIndex: 1100, display: 'flex', alignItems: 'center', justifycontent: 'center', padding: '16px' }}>
          <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '640px', padding: '24px', borderRadius: '24px', background: 'var(--bg-card)', border: '1px solid var(--border)', display: 'flex', gap: '20px', flexDirection: 'column' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <DollarSign size={20} color="var(--primary)" />
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800' }}>Payment Received from Driver</h3>
              </div>
              <button onClick={() => setShowCollectCashModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {/* Left Side: Statement Preview & Share */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', alignSelf: 'flex-start' }}>
                  📄 Statement Receipt Preview
                </div>
                {statementImageSrc ? (
                  <img 
                    src={statementImageSrc} 
                    alt="Dues Statement" 
                    style={{ 
                      width: '100%', 
                      maxWidth: '260px', 
                      borderRadius: '12px', 
                      border: '1px solid var(--border)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)' 
                    }} 
                  />
                ) : (
                  <div style={{ width: '100%', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.01)', border: '1px dashed var(--border)', borderRadius: '12px', color: 'var(--text-muted)', fontSize: '12px' }}>
                    Generating statement image...
                  </div>
                )}
                
                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  style={{
                    width: '100%',
                    background: '#25D366',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '10px',
                    fontSize: '12.5px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  💬 Copy Image & Open WhatsApp
                </button>
              </div>

              {/* Right Side: Cash Collection Form */}
              <form onSubmit={handleCollectCash} style={{ display: 'flex', flexDirection: 'column', gap: '14px', justifyContent: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Driver Partner</span>
                  <strong style={{ fontSize: '15px', color: 'var(--text-main)' }}>{selectedLedgerDriver.name}</strong>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Phone Number</span>
                  <span style={{ fontSize: '13px', color: 'var(--text-main)', fontWeight: '600' }}>{selectedLedgerDriver.phone}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Total Pending Balance</span>
                  <strong style={{ fontSize: '18px', color: '#ef4444' }}>-₹{parseFloat(selectedLedgerDriver.wallet?.toBePaid || 0).toFixed(2)}</strong>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label>Amount Received (INR)</label>
                  <input 
                    type="number" 
                    className="input-field" 
                    step="0.01"
                    min="0.01"
                    max={parseFloat(selectedLedgerDriver.wallet?.toBePaid || 0)}
                    value={collectAmount}
                    onChange={(e) => setCollectAmount(e.target.value)}
                    required
                  />
                </div>

                <Button 
                  variant="primary" 
                  type="submit" 
                  disabled={isSubmittingCollection}
                  style={{ marginTop: '8px', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', fontWeight: '800' }}
                >
                  {isSubmittingCollection ? 'Processing...' : '✅ Record Payment Received & Generate PDF Bill'}
                </Button>
              </form>
            </div>
            
          </div>
        </div>
      )}

      {/* ========== ADD EMPLOYEE MODAL ========== */}
      {showAddEmployeeModal && (
        <div className="modal-overlay" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', position: 'fixed', inset: 0, zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '400px', padding: '24px', borderRadius: '16px', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0 }}>Add New Employee</h3>
              <button onClick={() => setShowAddEmployeeModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddEmployee} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>Name</label>
                <input required type="text" className="input-field" value={newEmployee.name} onChange={e => setNewEmployee({...newEmployee, name: e.target.value})} style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>Username</label>
                <input required type="text" className="input-field" value={newEmployee.username} onChange={e => setNewEmployee({...newEmployee, username: e.target.value})} style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>Password</label>
                <input required type="password" className="input-field" value={newEmployee.password} onChange={e => setNewEmployee({...newEmployee, password: e.target.value})} style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>Position</label>
                <input required type="text" className="input-field" value={newEmployee.position} onChange={e => setNewEmployee({...newEmployee, position: e.target.value})} style={{ width: '100%' }} placeholder="e.g. Area Manager, Support Staff" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>Role</label>
                <select className="input-field" value={newEmployee.role} onChange={e => setNewEmployee({...newEmployee, role: e.target.value})} style={{ width: '100%' }}>
                  <option value="staff">Staff</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>Salary (₹)</label>
                  <input type="number" className="input-field" value={newEmployee.salary} onChange={e => setNewEmployee({...newEmployee, salary: e.target.value})} style={{ width: '100%' }} placeholder="Monthly Salary" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>Salary Date (Day)</label>
                  <input type="number" className="input-field" value={newEmployee.salaryDate} onChange={e => setNewEmployee({...newEmployee, salaryDate: e.target.value})} style={{ width: '100%' }} placeholder="e.g. 1" min="1" max="31" />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>Incentive Details</label>
                <textarea className="input-field" value={newEmployee.incentive} onChange={e => setNewEmployee({...newEmployee, incentive: e.target.value})} style={{ width: '100%', minHeight: '60px' }} placeholder="E.g. 5% commission on closed sales..."></textarea>
              </div>
              <Button type="submit" variant="primary" style={{ marginTop: '8px' }}>Create Account</Button>
            </form>
          </div>
        </div>
      )}

      {/* ========== EMPLOYEE DETAILS MODAL ========== */}
      {selectedEmployeeForDetails && (
        <div className="modal-overlay" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', position: 'fixed', inset: 0, zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto', padding: '24px', borderRadius: '16px', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '20px' }}>{selectedEmployeeForDetails.name}</h3>
                <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>
                  {selectedEmployeeForDetails.role} | {selectedEmployeeForDetails.position} | @{selectedEmployeeForDetails.username}
                </p>
              </div>
              <button onClick={() => setSelectedEmployeeForDetails(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {/* Payroll Details */}
              <div style={{ gridColumn: '1 / -1', background: 'var(--card-bg)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <h4 style={{ margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <TrendingUp size={18} color="var(--primary)" /> Payroll & Reminders
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Monthly Salary</div>
                    <div style={{ fontWeight: '600', color: '#10b981', fontSize: '16px' }}>{selectedEmployeeForDetails.salary ? `₹${selectedEmployeeForDetails.salary}` : 'Not specified'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Salary Date</div>
                    <div style={{ fontWeight: '500' }}>{selectedEmployeeForDetails.salaryDate ? `Day ${selectedEmployeeForDetails.salaryDate} of month` : 'Not set'}</div>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Incentive / Bonus Details</div>
                    <div style={{ fontWeight: '500', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', border: '1px dashed var(--border)', marginTop: '4px' }}>
                      {selectedEmployeeForDetails.incentive || 'No incentives defined.'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bank Details */}
              <div style={{ gridColumn: '1 / -1', background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <h4 style={{ margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <DollarSign size={18} color="var(--primary)" /> Bank Account Details
                </h4>
                {selectedEmployeeForDetails.bankDetails ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                    <div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Bank Name</div>
                      <div style={{ fontWeight: '500' }}>{selectedEmployeeForDetails.bankDetails.bankName || '-'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Account Number</div>
                      <div style={{ fontWeight: '500' }}>{selectedEmployeeForDetails.bankDetails.accountNo || '-'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>IFSC Code</div>
                      <div style={{ fontWeight: '500' }}>{selectedEmployeeForDetails.bankDetails.ifscCode || '-'}</div>
                    </div>
                  </div>
                ) : (
                  <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No bank details provided.</div>
                )}
              </div>

              {/* KYC Documents */}
              <div style={{ gridColumn: '1 / -1' }}>
                <h4 style={{ margin: '0 0 12px 0', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>KYC Documents</h4>
                {selectedEmployeeForDetails.documents ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    
                    <div style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '12px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>Aadhaar Card (Front)</div>
                      {selectedEmployeeForDetails.documents.aadhaarFront ? (
                         <img src={selectedEmployeeForDetails.documents.aadhaarFront} alt="Aadhaar Front" style={{ width: '100%', height: '150px', objectFit: 'contain', background: '#000', borderRadius: '4px' }} />
                      ) : <div style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', borderRadius: '4px' }}>Not Uploaded</div>}
                    </div>

                    <div style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '12px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>Aadhaar Card (Back)</div>
                      {selectedEmployeeForDetails.documents.aadhaarBack ? (
                         <img src={selectedEmployeeForDetails.documents.aadhaarBack} alt="Aadhaar Back" style={{ width: '100%', height: '150px', objectFit: 'contain', background: '#000', borderRadius: '4px' }} />
                      ) : <div style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', borderRadius: '4px' }}>Not Uploaded</div>}
                    </div>

                    <div style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '12px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>PAN Card (Front)</div>
                      {selectedEmployeeForDetails.documents.panFront ? (
                         <img src={selectedEmployeeForDetails.documents.panFront} alt="PAN Front" style={{ width: '100%', height: '150px', objectFit: 'contain', background: '#000', borderRadius: '4px' }} />
                      ) : <div style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', borderRadius: '4px' }}>Not Uploaded</div>}
                    </div>

                    <div style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '12px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>PAN Card (Back)</div>
                      {selectedEmployeeForDetails.documents.panBack ? (
                         <img src={selectedEmployeeForDetails.documents.panBack} alt="PAN Back" style={{ width: '100%', height: '150px', objectFit: 'contain', background: '#000', borderRadius: '4px' }} />
                      ) : <div style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', borderRadius: '4px' }}>Not Uploaded</div>}
                    </div>

                    <div style={{ gridColumn: '1 / -1', border: '1px solid var(--border)', borderRadius: '8px', padding: '12px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>Bank Proof (Cancelled Check / Passbook)</div>
                      {selectedEmployeeForDetails.documents.bankProof ? (
                         <img src={selectedEmployeeForDetails.documents.bankProof} alt="Bank Proof" style={{ width: '100%', height: '200px', objectFit: 'contain', background: '#000', borderRadius: '4px' }} />
                      ) : <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', borderRadius: '4px' }}>Not Uploaded</div>}
                    </div>

                  </div>
                ) : (
                  <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No documents provided.</div>
                )}
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Button variant="danger" onClick={async () => {
                  const message = window.prompt('Enter warning message:');
                  if(message) {
                    await fetch(`${API_BASE}/api/admin/employees/${selectedEmployeeForDetails.id}/warn`, { 
                      method: 'POST', 
                      headers: {'Content-Type': 'application/json'},
                      body: JSON.stringify({ message }) 
                    });
                    alert('Warning Letter recorded and sent to employee.');
                    fetchEmployees();
                  }
                }} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                  <AlertCircle size={16} style={{ marginRight: '8px' }} /> Issue Warning Letter
                </Button>
                <Button variant="outline" onClick={() => {
                  alert(`Generated Terms & Conditions Document for ${selectedEmployeeForDetails.name}.\n\n(A PDF would typically download here)`);
                }} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={16} /> Generate Terms & Conditions
                </Button>
              </div>
              <Button variant="outline" onClick={() => setSelectedEmployeeForDetails(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {messageModalDriver && (
        <ChatModal 
          entityType="driver" 
          entityData={messageModalDriver} 
          onClose={() => setMessageModalDriver(null)} 
          API_BASE={API_BASE} 
        />
      )}

      {messageModalPassenger && (
        <ChatModal 
          entityType="passenger" 
          entityData={messageModalPassenger} 
          onClose={() => setMessageModalPassenger(null)} 
          API_BASE={API_BASE} 
        />
      )}

    </div>
  );
};
export default AdminDashboard;
