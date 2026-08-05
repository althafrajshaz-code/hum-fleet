import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, Car, DollarSign, Settings, Eye, Check, X, AlertCircle, FileText, LogOut, Key, UserCheck, TrendingUp, Search, MapPin, Navigation, Activity, Map, Radio, Compass, MessageSquare, Send, CreditCard, Upload, Tag, Phone } from 'lucide-react';
import Button from '../components/Button';
import './AdminDashboard.css';

const MOCK_PHOTOS = {
  front: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600',
  rear: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600',
  left: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600',
  right: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=600',
  inside: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600',
  document: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600'
};

const API_BASE = (typeof window !== 'undefined' && window.location.hostname.includes('loca.lt'))
  ? 'https://hum-fleet-backend.loca.lt'
  : (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))
    ? 'http://localhost:5000'
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


  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('adminActiveTab') || 'approvals');
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
  const [newEmployee, setNewEmployee] = useState({ name: '', username: '', password: '', role: 'staff', position: '', managerId: '' });
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
  const [registeredDriverSearch, setRegisteredDriverSearch] = useState('');
  const [passengerSearch, setPassengerSearch] = useState('');
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

  const fetchDrivers = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/drivers`);
      if (response.ok) {
        const data = await response.json();
        setDrivers(data);
        if (selectedDriver) {
          const updatedSelected = data.find(d => d.id === selectedDriver.id);
          if (updatedSelected) {
            setSelectedDriver(updatedSelected);
          }
        }
      }
    } catch (err) {
      console.error("Failed to fetch drivers from backend:", err);
    }
  };

  const fetchPassengers = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/passengers`);
      if (response.ok) {
        const data = await response.json();
        setPassengers(data);
      }
    } catch (err) {
      console.error("Failed to fetch passengers from backend:", err);
    }
  };

  const handleAddDriver = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/api/admin/drivers`, {
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
      const response = await fetch(`${API_BASE}/api/admin/passengers`, {
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
        setNewEmployee({ name: '', username: '', password: '', role: 'staff', position: '', managerId: '' });
      }
    } catch (err) {
      console.error('Error adding employee:', err);
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
      const response = await fetch(`${API_BASE}/api/vehicle-categories`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (err) {
      console.error("Failed to fetch vehicle categories from backend:", err);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/settings`);
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
  const totalDrivers = drivers.length; 
  const pendingDrivers = drivers.filter(d => d.status === 'Pending').length;
  const approvedDriversCount = drivers.filter(d => d.status === 'Approved').length;

  // Filter lists based on search queries
  const filteredPendingDrivers = drivers
    .filter(d => d.status === 'Pending')
    .filter(d => 
      d.name.toLowerCase().includes(driverSearch.toLowerCase()) ||
      d.phone.includes(driverSearch) ||
      d.email.toLowerCase().includes(driverSearch.toLowerCase()) ||
      (d.plate && d.plate.toLowerCase().replace(/\s+/g, '').includes(driverSearch.toLowerCase().replace(/\s+/g, ''))) ||
      (d.manufacturer && d.manufacturer.toLowerCase().includes(driverSearch.toLowerCase())) ||
      (d.model && d.model.toLowerCase().includes(driverSearch.toLowerCase()))
    );

  const filteredApprovedDrivers = drivers
    .filter(d => d.status !== 'Rejected')
    .filter(d => 
      d.name.toLowerCase().includes(registeredDriverSearch.toLowerCase()) ||
      d.phone.includes(registeredDriverSearch) ||
      d.email.toLowerCase().includes(registeredDriverSearch.toLowerCase()) ||
      (d.plate && d.plate.toLowerCase().replace(/\s+/g, '').includes(registeredDriverSearch.toLowerCase().replace(/\s+/g, ''))) ||
      (d.manufacturer && d.manufacturer.toLowerCase().includes(registeredDriverSearch.toLowerCase())) ||
      (d.model && d.model.toLowerCase().includes(registeredDriverSearch.toLowerCase()))
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
    p.name.toLowerCase().includes(passengerSearch.toLowerCase()) ||
    p.phone.includes(passengerSearch) ||
    p.email.toLowerCase().includes(passengerSearch.toLowerCase())
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
      d.name.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
      d.phone.includes(ledgerSearch) ||
      d.email.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
      (d.plate && d.plate.toLowerCase().replace(/\s+/g, '').includes(ledgerSearch.toLowerCase().replace(/\s+/g, ''))) ||
      (d.manufacturer && d.manufacturer.toLowerCase().includes(ledgerSearch.toLowerCase())) ||
      (d.model && d.model.toLowerCase().includes(ledgerSearch.toLowerCase()))
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
    const matchesSearch = p.name.toLowerCase().includes(pendingSearch.toLowerCase()) ||
                          p.phone.includes(pendingSearch) ||
                          (p.plate && p.plate.toLowerCase().includes(pendingSearch.toLowerCase()));
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
        response = await fetch(`${API_BASE}/api/vehicle-categories/${editingCategory.id}`, {
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
    setCatName(cat.name);
    setCatPassengers(cat.maxPassengers.toString());
    setCatBaseFare(cat.baseFare.toString());
    setCatRatePerKm(cat.ratePerKm.toString());
  };

  const handleCancelEdit = () => {
    setCatName('');
    setCatPassengers('4');
    setCatBaseFare('50.00');
    setCatRatePerKm('15.00');
    setEditingCategory(null);
  };

  const handleDeleteCategory = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/api/vehicle-categories/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
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
    <div className="admin-page">
      {activeSOSAlert && activeSOSAlert.active && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 99999, background: '#ef4444', color: '#fff', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 20px rgba(239, 68, 68, 0.4)', animation: 'pulse 1.5s infinite'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <AlertCircle size={28} />
            <div>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '900', letterSpacing: '1px' }}>EMERGENCY SOS TRIGGERED</h2>
              <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', opacity: 0.9 }}>
                Driver: {activeSOSAlert.driverName} ({activeSOSAlert.phone}) | Location Coordinates: {activeSOSAlert.location}
              </p>
            </div>
          </div>
          <button 
            onClick={() => setActiveSOSAlert({ ...activeSOSAlert, active: false })}
            style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            DISMISS / RESOLVED
          </button>
        </div>
      )}
      <div className="admin-container container" style={{ paddingTop: activeSOSAlert?.active ? '60px' : '0' }}>
        {/* Sidebar Nav */}
        <aside className="admin-sidebar glass-card">
          <div className="admin-profile" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src="/hum_fleet_official_logo.jpg" alt="HUM Fleet" style={{ height: '42px', width: 'auto', borderRadius: '6px' }} />
            <div>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '800' }}>Admin Panel</h3>
              <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>HUM Fleet Control</p>
            </div>
          </div>
          <nav className="admin-nav" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <button 
              className={`admin-nav-item ${activeTab === 'approvals' ? 'active' : ''}`}
              onClick={() => setActiveTab('approvals')}
            >
              <UserCheck size={18} /> Partner Approvals ({pendingDrivers})
            </button>
            <button 
              className={`admin-nav-item ${activeTab === 'fleet-monitor' ? 'active' : ''}`}
              onClick={() => setActiveTab('fleet-monitor')}
              style={{ position: 'relative' }}
            >
              <MapPin size={18} color={fleetData.onlineDriversCount > 0 ? '#10b981' : 'currentColor'} /> 
              Live Fleet Monitor
              {fleetData.onlineDriversCount > 0 && (
                <span style={{ marginLeft: 'auto', background: '#10b981', color: '#000', fontSize: '10px', fontWeight: '800', borderRadius: '10px', padding: '1px 6px' }}>
                  {fleetData.onlineDriversCount} Live
                </span>
              )}
            </button>
            <button 
              className={`admin-nav-item ${activeTab === 'registered-drivers' ? 'active' : ''}`}
              onClick={() => setActiveTab('registered-drivers')}
            >
              <Car size={18} /> Registered Partners ({approvedDriversCount})
            </button>
            <button 
              className={`admin-nav-item ${activeTab === 'passengers' ? 'active' : ''}`}
              onClick={() => setActiveTab('passengers')}
            >
              <Users size={18} /> Registered Users ({passengers.length})
            </button>
            <button 
              className={`admin-nav-item ${activeTab === 'staff' ? 'active' : ''}`}
              onClick={() => setActiveTab('staff')}
            >
              <UserCheck size={18} /> Staff & Management
            </button>
            <button 
              className={`admin-nav-item ${activeTab === 'ledger' ? 'active' : ''}`}
              onClick={() => setActiveTab('ledger')}
            >
              <DollarSign size={18} /> Partner Ledger
            </button>
            <button 
              className={`admin-nav-item ${activeTab === 'pending-payments' ? 'active' : ''}`}
              onClick={() => setActiveTab('pending-payments')}
              style={{ position: 'relative' }}
            >
              <CreditCard size={18} color={pendingPaymentsData.summary.pendingPartnersCount > 0 ? '#ef4444' : 'currentColor'} /> 
              Pending Payments
              {pendingPaymentsData.summary.pendingPartnersCount > 0 && (
                <span style={{ marginLeft: 'auto', background: '#ef4444', color: '#ffffff', fontSize: '10px', fontWeight: '800', borderRadius: '10px', padding: '1px 7px' }}>
                  {pendingPaymentsData.summary.pendingPartnersCount} Due
                </span>
              )}
            </button>
            <button 
              className={`admin-nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              <TrendingUp size={18} /> Visual Analytics
            </button>
            <button 
              className={`admin-nav-item ${activeTab === 'promotions' ? 'active' : ''}`}
              onClick={() => setActiveTab('promotions')}
            >
              <Tag size={18} /> Promotions & Offers
            </button>
            <button 
              className={`admin-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <Settings size={18} /> System Controls
            </button>
            <button 
              className={`admin-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <Key size={18} /> Security Settings
            </button>
            <button 
              className={`admin-nav-item ${activeTab === 'locations' ? 'active' : ''}`}
              onClick={() => setActiveTab('locations')}
            >
              <MapPin size={18} /> Business Locations
            </button>
            <button 
              className={`admin-nav-item ${activeTab === 'broadcasts' ? 'active' : ''}`}
              onClick={() => setActiveTab('broadcasts')}
            >
              <Send size={18} /> Global Broadcasts
            </button>
            
            <button 
              className="admin-nav-item"
              onClick={() => {
                localStorage.removeItem('adminAuthenticated');
                navigate('/');
              }}
              style={{ marginTop: 'auto', color: '#ef4444' }}
            >
              <LogOut size={18} /> Logout
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="admin-content glass-card">
          
          {/* Global Date Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', padding: '12px', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.1)', borderRadius: '12px', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--primary)' }}>
              📅 Global Date Filter:
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>From:</label>
              <input 
                type="date" 
                className="input-field"
                value={globalStartDate}
                onChange={(e) => setGlobalStartDate(e.target.value)}
                style={{ padding: '6px 10px', fontSize: '12px', width: 'auto' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>To:</label>
              <input 
                type="date" 
                className="input-field"
                value={globalEndDate}
                onChange={(e) => setGlobalEndDate(e.target.value)}
                style={{ padding: '6px 10px', fontSize: '12px', width: 'auto' }}
              />
            </div>
            {(globalStartDate || globalEndDate) && (
              <button 
                onClick={() => { setGlobalStartDate(''); setGlobalEndDate(''); }}
                style={{ background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', marginLeft: 'auto' }}
              >
                Clear Filter
              </button>
            )}
          </div>

          {/* Top Row: General Statistics */}
          <div className="admin-stats-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
            <div className="admin-stat-box">
              <span className="stat-label">Total Partners</span>
              <span className="stat-value">{totalDrivers}</span>
            </div>
            <div className="admin-stat-box">
              <span className="stat-label">Pending Approval</span>
              <span className="stat-value text-gradient">{pendingDrivers}</span>
            </div>
            <div className="admin-stat-box">
              <span className="stat-label">Total Passengers</span>
              <span className="stat-value text-gradient" style={{ color: '#3b82f6' }}>{passengers.length}</span>
            </div>
            <div className="admin-stat-box">
              <span className="stat-label">System State</span>
              <span className="stat-value" style={{ color: systemStatus === 'online' ? 'var(--primary)' : '#ef4444' }}>
                {systemStatus.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Bottom Row: Financial Statistics Ledgers ( GST & Comm ) */}
          <div className="admin-stats-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginTop: '16px' }}>
            <div className="admin-stat-box" style={{ background: 'rgba(16, 185, 129, 0.03)', borderColor: 'rgba(16, 185, 129, 0.15)' }}>
              <span className="stat-label" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Total Commission (5%)</span>
              <span className="stat-value" style={{ color: 'var(--primary)' }}>₹{parseFloat(financials.totalCommission).toFixed(2)}</span>
            </div>
            <div className="admin-stat-box" style={{ background: 'rgba(245, 158, 11, 0.03)', borderColor: 'rgba(245, 158, 11, 0.15)' }}>
              <span className="stat-label" style={{ color: '#f59e0b', fontWeight: 'bold' }}>Total GST Collected (5%)</span>
              <span className="stat-value" style={{ color: '#f59e0b' }}>₹{parseFloat(financials.totalGST).toFixed(2)}</span>
            </div>
            <div className="admin-stat-box" style={{ background: 'rgba(239, 68, 68, 0.03)', borderColor: 'rgba(239, 68, 68, 0.15)' }}>
              <span className="stat-label" style={{ color: '#ef4444', fontWeight: 'bold' }}>Cash Commission Due (Unpaid)</span>
              <span className="stat-value" style={{ color: '#ef4444' }}>₹{parseFloat(financials.toBeCollected).toFixed(2)}</span>
            </div>
          </div>

          <hr className="divider" />

          {/* TAB 1: Driver Approvals */}
          {activeTab === 'approvals' && (
            <div className="tab-pane">
              <h2>Partner Approvals Queue</h2>
              <p className="tab-subtitle">Review applicant registration profiles, uploaded vehicle photos, bank details, and compliance documents.</p>

              {drivers.filter(d => d.status === 'Pending').length === 0 ? (
                <p className="empty-state">No pending applications found in the database.</p>
              ) : (
                <div className="approval-layout">
                  <div className="drivers-list">
                    {/* Dynamic Search Box for Driver Approvals */}
                    <div style={{ position: 'relative', marginBottom: '12px' }}>
                      <input 
                        type="text" 
                        className="input-field" 
                        placeholder="Search by vehicle number, name, phone..." 
                        value={driverSearch}
                        onChange={(e) => setDriverSearch(e.target.value)}
                        style={{ padding: '10px 14px 10px 36px', width: '100%', fontSize: '13px' }}
                      />
                      <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    </div>

                    {filteredPendingDrivers.length === 0 ? (
                      <p className="empty-state" style={{ padding: '20px 0' }}>No matching applications found.</p>
                    ) : (
                      filteredPendingDrivers.map(driver => (
                        <div 
                          key={driver.id} 
                          className={`driver-list-card ${selectedDriver?.id === driver.id ? 'selected' : ''}`}
                          onClick={() => setSelectedDriver(driver)}
                        >
                          <div className="driver-info-header">
                            <h4>{driver.name}</h4>
                            <span className={`status-badge badge-${driver.status.toLowerCase()}`}>
                              {driver.status}
                            </span>
                          </div>
                          <p className="driver-car">{driver.manufacturer} {driver.model} ({driver.year})</p>
                          <p className="driver-plate">{driver.plate}</p>
                          <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }} onClick={(e) => e.stopPropagation()}>
                            <Button 
                              variant="primary" 
                              onClick={() => handleApprove(driver)}
                              style={{ flex: 1, padding: '4px 8px', fontSize: '11px' }}
                            >
                              <Check size={14} /> Approve & Activate
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => handleReject(driver)}
                              style={{ flex: 1, padding: '4px 8px', fontSize: '11px', borderColor: '#ef4444', color: '#ef4444' }}
                            >
                              <X size={14} /> Reject
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="driver-details-panel">
                    {selectedDriver ? (
                      <div className="details-scrollable">
                        <h3>Review Profile: {selectedDriver.name}</h3>
                        <div className="profile-grid">
                          <div><strong>Phone:</strong> {selectedDriver.phone}</div>
                          <div><strong>Email:</strong> {selectedDriver.email}</div>
                          {selectedDriver.licenseNumber && (
                             <div style={{ gridColumn: '1 / -1' }}><strong>Licence Number:</strong> <span style={{ fontFamily: 'monospace', fontWeight: '800', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>{selectedDriver.licenseNumber}</span></div>
                          )}
                          <div><strong>Vehicle Make:</strong> {selectedDriver.manufacturer}</div>
                          <div><strong>Vehicle Model:</strong> {selectedDriver.model}</div>
                          <div><strong>Mfg. Year:</strong> {selectedDriver.year}</div>
                          <div><strong>Plate No:</strong> {selectedDriver.plate}</div>
                          <div><strong>Minimum Rate/KM:</strong> ₹{selectedDriver.ratePerKm || '15.00'}</div>
                          <div><strong>Minimum Rate/Hour:</strong> ₹{selectedDriver.ratePerHour || '120.00'}</div>
                        </div>

                        {/* Indian Bank Account Details Card */}
                        <div style={{ marginTop: '14px', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px', background: 'rgba(255,255,255,0.01)' }}>
                          <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '800' }}>
                            <DollarSign size={15} color="var(--primary)"/> Bank Account Details (Indian)
                          </h4>
                          {selectedDriver.bank ? (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px' }}>
                              <div><strong>Holder Name:</strong> {selectedDriver.bank.holderName || 'N/A'}</div>
                              <div><strong>Bank Name:</strong> {selectedDriver.bank.bankName || 'N/A'}</div>
                              <div><strong>Account No:</strong> {selectedDriver.bank.accountNumber || 'N/A'}</div>
                              <div><strong>IFSC Code:</strong> {selectedDriver.bank.ifscCode || 'N/A'}</div>
                            </div>
                          ) : (
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No bank details provided.</div>
                          )}
                        </div>

                        {/* Partner Ledger Balance */}
                        <div style={{ marginTop: '14px', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px', background: 'rgba(255,255,255,0.01)' }}>
                          <h4 style={{ margin: '0 0 6px 0', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}><DollarSign size={15} color="var(--primary)"/> Partner Ledger (Cash Runs)</h4>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12px' }}>
                            <div><strong>Collected Cash:</strong> ₹{parseFloat(selectedDriver.wallet?.cashCollected || 0).toFixed(2)}</div>
                            <div style={{ color: '#ef4444' }}><strong>Platform Debt Due:</strong> ₹{parseFloat(selectedDriver.wallet?.toBePaid || 0).toFixed(2)}</div>
                          </div>
                        </div>

                        {/* Live Registration Face Verification Selfie */}
                        <div className="doc-section" style={{ marginTop: '14px' }}>
                          <h4>Registration Live Face Selfie <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 'bold' }}>✓ Verified</span></h4>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid var(--border)' }}>
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
                              <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-main)' }}>Live Face Verification Captured</div>
                              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Camera selfie captured during driver registration flow.</div>
                              <div style={{ fontSize: '11px', color: '#10b981', fontWeight: '700', marginTop: '2px' }}>✓ Facial Geometry Validated</div>
                            </div>
                          </div>
                        </div>

                        {/* Vehicle Photos */}
                        <div className="doc-section" style={{ marginTop: '14px' }}>
                          <h4>Uploaded Vehicle Photos <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 'normal' }}>(Click to view)</span></h4>
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

                        {/* Vehicle Documents */}
                        <div className="doc-section">
                          <h4>Compliance Documents <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 'normal' }}>(Click to view)</span></h4>
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

                          <div className="action-buttons-row" style={{ display: 'flex', gap: '10px' }}>
                            {selectedDriver.status === 'Pending' && (
                              <>
                                <Button 
                                  variant="outline" 
                                  onClick={() => handleReject(selectedDriver.id)}
                                  style={{ flex: 1, borderColor: '#ef4444', color: '#ef4444' }}
                                >
                                  <X size={16} /> Reject Partner
                                </Button>
                                <Button 
                                  variant="primary" 
                                  onClick={() => handleApprove(selectedDriver.id)}
                                  style={{ flex: 1 }}
                                >
                                  <Check size={16} /> Approve & Activate
                                </Button>
                              </>
                            )}
                            <Button
                              variant="outline"
                              onClick={() => { setMessageModalDriver(selectedDriver); fetchChatMessages(selectedDriver.email); }}
                              style={{ flex: 1, borderColor: '#3b82f6', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                            >
                              <MessageSquare size={16} /> Direct Message
                            </Button>
                          </div>
                      </div>
                    ) : (
                      <div className="no-selection-state">
                        <Users size={48} />
                        <p>Select an applicant from the queue to view full profile, photos, and compliance documents.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 1B: Live Fleet & Partner GPS Monitor */}
          {activeTab === 'fleet-monitor' && (
            <div className="tab-pane animate-fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin color="#10b981" size={24} /> Live Fleet & GPS Monitor
                  </h2>
                  <p className="tab-subtitle" style={{ margin: '4px 0 0 0' }}>
                    Track active/online partners, passengers on trip, live GPS coordinates, and real-time ride telemetry.
                  </p>
                </div>

                {/* View Switcher: Drivers vs Passengers */}
                <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border)' }}>
                  <button
                    onClick={() => setFleetEntity('drivers')}
                    style={{
                      background: fleetEntity === 'drivers' ? 'var(--primary)' : 'transparent',
                      color: fleetEntity === 'drivers' ? '#000' : 'var(--text-muted)',
                      border: 'none', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', fontWeight: '800', cursor: 'pointer'
                    }}
                  >
                    🚗 Partner Drivers ({fleetData.drivers?.length || 0})
                  </button>
                  <button
                    onClick={() => setFleetEntity('passengers')}
                    style={{
                      background: fleetEntity === 'passengers' ? '#3b82f6' : 'transparent',
                      color: fleetEntity === 'passengers' ? '#fff' : 'var(--text-muted)',
                      border: 'none', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', fontWeight: '800', cursor: 'pointer'
                    }}
                  >
                    👤 Passengers ({fleetData.passengers?.length || 0})
                  </button>
                </div>
              </div>

              {/* Status Summary Bar */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', margin: '16px 0' }}>
                <div style={{ padding: '14px', borderRadius: '12px', border: '1px solid rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.06)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold' }}>
                    <Radio size={20} />
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Online Partners (Idle)</span>
                    <span style={{ fontSize: '18px', fontWeight: '800', color: '#10b981' }}>{fleetData.onlineDriversCount || 0}</span>
                  </div>
                </div>

                <div style={{ padding: '14px', borderRadius: '12px', border: '1px solid rgba(245,158,11,0.3)', background: 'rgba(245,158,11,0.06)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold' }}>
                    <Navigation size={20} />
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>On Active Trip</span>
                    <span style={{ fontSize: '18px', fontWeight: '800', color: '#f59e0b' }}>{fleetData.ridingDriversCount || 0}</span>
                  </div>
                </div>

                <div style={{ padding: '14px', borderRadius: '12px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontWeight: 'bold' }}>
                    <Car size={20} />
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Offline Partners</span>
                    <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>{fleetData.offlineDriversCount || 0}</span>
                  </div>
                </div>

                <div style={{ padding: '14px', borderRadius: '12px', border: '1px solid rgba(59,130,246,0.3)', background: 'rgba(59,130,246,0.06)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>
                    <Users size={20} />
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Total Passengers</span>
                    <span style={{ fontSize: '18px', fontWeight: '800', color: '#3b82f6' }}>{fleetData.passengers?.length || 0}</span>
                  </div>
                </div>
              </div>

              {/* Filters & Search Toolbar */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Search by name, phone, email, plate number, or location..." 
                    value={fleetSearch}
                    onChange={(e) => setFleetSearch(e.target.value)}
                    style={{ padding: '10px 14px 10px 36px', width: '100%', fontSize: '13px' }}
                  />
                  <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                </div>

                {fleetEntity === 'drivers' && (
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {[
                      { id: 'all', label: 'All Partners' },
                      { id: 'online', label: '🟢 Online (Idle)' },
                      { id: 'riding', label: '🚕 On Active Trip' },
                      { id: 'offline', label: '⚪ Offline' }
                    ].map(f => (
                      <button
                        key={f.id}
                        onClick={() => setFleetFilter(f.id)}
                        style={{
                          background: fleetFilter === f.id ? 'var(--primary)' : 'rgba(255,255,255,0.04)',
                          color: fleetFilter === f.id ? '#000' : 'var(--text-muted)',
                          border: '1px solid var(--border)',
                          borderRadius: '8px', padding: '8px 12px', fontSize: '12px', fontWeight: '700', cursor: 'pointer'
                        }}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* FLEET DRIVERS VIEW */}
              {fleetEntity === 'drivers' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
                  {fleetData.drivers
                    .filter(d => {
                      if (fleetFilter === 'online') return d.isOnline && !d.currentRide;
                      if (fleetFilter === 'riding') return d.currentRide != null;
                      if (fleetFilter === 'offline') return !d.isOnline;
                      return true;
                    })
                    .filter(d => 
                      d.name.toLowerCase().includes(fleetSearch.toLowerCase()) ||
                      d.phone.includes(fleetSearch) ||
                      d.email.toLowerCase().includes(fleetSearch.toLowerCase()) ||
                      (d.plate && d.plate.toLowerCase().replace(/\s+/g, '').includes(fleetSearch.toLowerCase().replace(/\s+/g, ''))) ||
                      (d.manufacturer && d.manufacturer.toLowerCase().includes(fleetSearch.toLowerCase())) ||
                      (d.model && d.model.toLowerCase().includes(fleetSearch.toLowerCase()))
                    )
                    .map(d => {
                      const isRiding = d.currentRide != null;
                      const isOnline = Boolean(d.isOnline);
                      return (
                        <div key={d.id} style={{
                          border: `1.5px solid ${isRiding ? 'rgba(245,158,11,0.5)' : isOnline ? 'rgba(16,185,129,0.4)' : 'var(--border)'}`,
                          borderRadius: '16px', padding: '16px',
                          background: isRiding ? 'rgba(245,158,11,0.03)' : isOnline ? 'rgba(16,185,129,0.03)' : 'rgba(255,255,255,0.01)',
                          display: 'flex', flexDirection: 'column', gap: '12px'
                        }}>
                          {/* Driver Card Header */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{ width: '42px', height: '42px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--border)', background: '#121624', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 'bold', fontSize: '16px' }}>
                                {d.profilePic ? <img src={d.profilePic} alt={d.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : d.name.charAt(0)}
                              </div>
                              <div>
                                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '800' }}>{d.name}</h4>
                                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{d.manufacturer} {d.model} • <strong style={{ color: 'var(--text-main)', fontFamily: 'monospace' }}>{d.plate}</strong></span>
                              </div>
                            </div>

                            {/* Status Badge */}
                            {isRiding ? (
                              <span style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.4)', borderRadius: '20px', padding: '4px 10px', fontSize: '10px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#f59e0b', animation: 'pulse 1.5s infinite' }}></span> 🚕 ON TRIP
                              </span>
                            ) : d.isPaused ? (
                              <span style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.4)', borderRadius: '20px', padding: '4px 10px', fontSize: '10px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                ☕ ON REST BREAK
                              </span>
                            ) : isOnline ? (
                              <span style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.4)', borderRadius: '20px', padding: '4px 10px', fontSize: '10px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', animation: 'pulse 1.5s infinite' }}></span> 🟢 ONLINE
                              </span>
                            ) : (
                              <span style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)', border: '1px solid var(--border)', borderRadius: '20px', padding: '4px 10px', fontSize: '10px', fontWeight: '800' }}>
                                ⚪ OFFLINE
                              </span>
                            )}
                          </div>

                          {/* Active Trip Details Box if riding */}
                          {isRiding && d.currentRide && (
                            <div style={{ border: '1px solid rgba(245,158,11,0.3)', borderRadius: '10px', padding: '10px', background: 'rgba(245,158,11,0.06)', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <div style={{ fontWeight: '800', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Navigation size={14} /> Active Trip for {d.currentRide.passengerName || 'Passenger'}
                              </div>
                              <div><strong>From:</strong> {d.currentRide.pickup}</div>
                              <div><strong>To:</strong> {d.currentRide.dropoff}</div>
                              <div><strong>Fare:</strong> ₹{d.currentRide.fare}</div>
                            </div>
                          )}

                          {/* GPS Telemetry & Contact */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: '8px' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Compass size={14} color="var(--primary)" /> 
                              Lat: {d.lat ? parseFloat(d.lat).toFixed(4) : '28.4950'}, Lng: {d.lng ? parseFloat(d.lng).toFixed(4) : '77.0896'}
                            </span>
                            <span>📞 {d.phone}</span>
                          </div>

                          {/* View Live Map Location & Direct Message Buttons */}
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <Button 
                              variant="primary" 
                              onClick={() => setSelectedMapDriver(d)}
                              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', flex: 1, fontSize: '12px', padding: '8px' }}
                            >
                              <MapPin size={15} /> View Live Location
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => { setMessageModalDriver(d); fetchChatMessages(d.email); }}
                              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', flex: 1, fontSize: '12px', padding: '8px', borderColor: '#3b82f6', color: '#3b82f6' }}
                            >
                              <MessageSquare size={15} /> 💬 Message
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}

              {/* PASSENGERS VIEW */}
              {fleetEntity === 'passengers' && (
                <div style={{ border: '1px solid var(--border)', borderRadius: '12px', overflowX: 'auto', background: 'rgba(255,255,255,0.01)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border)' }}>
                        <th style={{ padding: '16px', fontWeight: '700' }}>Passenger Name</th>
                        <th style={{ padding: '16px', fontWeight: '700' }}>Email Address</th>
                        <th style={{ padding: '16px', fontWeight: '700' }}>Mobile Number</th>
                        <th style={{ padding: '16px', fontWeight: '700', textAlign: 'center' }}>Active Ride Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fleetData.passengers
                        .filter(p => p.name.toLowerCase().includes(fleetSearch.toLowerCase()) || p.email.toLowerCase().includes(fleetSearch.toLowerCase()) || p.phone.includes(fleetSearch))
                        .map(p => (
                          <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                            <td style={{ padding: '16px', fontWeight: '600' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '34px', height: '34px', borderRadius: '50%', overflow: 'hidden', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.05)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '13px', color: '#3b82f6' }}>
                                  {p.profilePic ? <img src={p.profilePic} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : p.name.charAt(0)}
                                </div>
                                <span>{p.name}</span>
                              </div>
                            </td>
                            <td style={{ padding: '16px', color: 'var(--text-main)' }}>{p.email}</td>
                            <td style={{ padding: '16px', color: 'var(--text-main)' }}>{p.phone}</td>
                            <td style={{ padding: '16px', textAlign: 'center' }}>
                              {p.activeRide ? (
                                <span style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.4)', borderRadius: '20px', padding: '4px 12px', fontSize: '11px', fontWeight: '800' }}>
                                  🚕 Ride Requested / Active ({p.activeRide.pickup.split(',')[0]} → {p.activeRide.dropoff.split(',')[0]})
                                </span>
                              ) : (
                                <span style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '20px', padding: '4px 12px', fontSize: '11px', fontWeight: '800' }}>
                                  ✓ Account Active (Idle)
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 1C: Registered Drivers List (EXCLUSIVELY VERTICAL ALIGNED CARD VIEW & VERTICAL SCROLL) */}
          {activeTab === 'registered-drivers' && (
            <div className="tab-pane animate-fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h2 style={{ margin: 0 }}>Registered Partners</h2>
                  <p className="tab-subtitle" style={{ margin: '4px 0 0 0' }}>Database of partner accounts approved and active to perform rides on the platform.</p>
                </div>
                <button 
                  onClick={() => setShowAddDriverModal(true)}
                  style={{ background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 16px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  + Add New Driver
                </button>
              </div>

              {/* Dynamic Search Box for Registered Drivers */}
              <div style={{ position: 'relative', margin: '16px 0 16px 0', maxWidth: '380px' }}>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Search by partner name, phone, email, plate..." 
                  value={registeredDriverSearch}
                  onChange={(e) => setRegisteredDriverSearch(e.target.value)}
                  style={{ padding: '10px 14px 10px 36px', width: '100%', fontSize: '13px' }}
                />
                <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>

              {filteredApprovedDrivers.length === 0 ? (
                <p className="empty-state">No matching registered partners found.</p>
              ) : (

                /* VERTICAL ALIGNED CARDS LIST WITH SMOOTH VERTICAL SCROLLING */
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  maxHeight: 'calc(100vh - 240px)',
                  overflowY: 'auto',
                  paddingRight: '8px',
                  paddingBottom: '24px'
                }}>
                  {filteredApprovedDrivers.map((d) => {
                    const isVerifiedToday = d.lastVerifiedAt && new Date(d.lastVerifiedAt).toDateString() === new Date().toDateString();
                    return (
                      <div 
                        key={d.id} 
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'minmax(210px, 1.2fr) minmax(180px, 1fr) minmax(150px, 1fr) minmax(160px, 1fr) auto',
                          alignItems: 'center',
                          gap: '16px',
                          background: '#ffffff',
                          border: '1px solid var(--border)',
                          borderRadius: '16px',
                          padding: '16px 20px',
                          boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                          transition: 'all 0.2s ease'
                        }} 
                        className="glass-card table-row-hover"
                      >
                        {/* Column 1: Partner Avatar, Name, Rating */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '46px', height: '46px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--primary)', background: '#121624', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px', color: 'var(--primary)' }}>
                            {d.profilePic ? <img src={d.profilePic} alt={d.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : d.name.charAt(0)}
                          </div>
                          <div>
                            <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: 'var(--text-main)' }}>{d.name}</h4>
                            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '4px' }}>
                              <span style={{ color: '#f59e0b', fontSize: '11px', fontWeight: '800' }}>★ {d.rating || '5.0'}</span>
                              <span style={{ 
                                background: (d.totalTrips || 0) >= 50 ? 'linear-gradient(45deg, #FFD700, #FDB931)' : (d.totalTrips || 0) >= 10 ? 'linear-gradient(45deg, #C0C0C0, #E5E4E2)' : 'linear-gradient(45deg, #cd7f32, #b87333)',
                                color: '#000', fontSize: '10px', fontWeight: '900', borderRadius: '12px', padding: '2px 6px', textShadow: '0px 1px 1px rgba(255,255,255,0.3)', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' 
                              }}>
                                🏆 {(d.totalTrips || 0) >= 50 ? 'GOLD' : (d.totalTrips || 0) >= 10 ? 'SILVER' : 'BRONZE'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Column 2: Contact Details */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.email}</span>
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>📞 {d.phone}</span>
                        </div>

                        {/* Column 3: Vehicle Model & Plate Number */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>{d.manufacturer} {d.model}</span>
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'monospace', fontWeight: '700' }}>{d.plate}</span>
                        </div>

                        {/* Column 4: Verification & Trip Access Badges */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {isVerifiedToday ? (
                            <span style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '20px', padding: '3px 10px', fontSize: '11px', fontWeight: '800', width: 'fit-content' }}>
                              ✓ Face Verified Today
                            </span>
                          ) : (
                            <span style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '20px', padding: '3px 10px', fontSize: '11px', fontWeight: '800', width: 'fit-content' }}>
                              ⏳ Verification Pending
                            </span>
                          )}

                          {d.isBlocked ? (
                            <span style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '20px', padding: '3px 10px', fontSize: '11px', fontWeight: '800', width: 'fit-content' }}>
                              🚫 Access Blocked
                            </span>
                          ) : (
                            <span style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '20px', padding: '3px 10px', fontSize: '11px', fontWeight: '800', width: 'fit-content' }}>
                              ✅ Access Active
                            </span>
                          )}
                        </div>

                        {/* Column 5: Actions */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {d.isBlocked ? (
                            <button
                              title="Unblock Partner"
                              onClick={() => handleUnblockDriver(d.id, d.name)}
                              style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 12px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                              ✅ Unblock
                            </button>
                          ) : (
                            <button
                              title="Block Partner"
                              onClick={() => handleBlockDriver(d.id, d.name)}
                              style={{ background: '#f59e0b', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 12px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                              🚫 Block
                            </button>
                          )}

                          <button
                            title="Direct Message Partner"
                            onClick={() => { setMessageModalDriver(d); fetchChatMessages(d.email); }}
                            style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 12px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <MessageSquare size={14} /> Message
                          </button>

                          <Button 
                            variant="outline" 
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to suspend and deactivate driver ${d.name}?`)) {
                                handleReject(d.id);
                              }
                            }}
                            style={{ borderColor: '#ef4444', color: '#ef4444', padding: '8px 12px', fontSize: '12px' }}
                          >
                            <AlertTriangle size={14} /> Suspend
                          </Button>

                          <button
                            title="Delete Driver permanently"
                            onClick={() => {
                              if (window.confirm(`WARNING: Are you sure you want to PERMANENTLY delete driver ${d.name}? This cannot be undone.`)) {
                                handleDeleteDriver(d.id);
                              }
                            }}
                            style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            <X size={14} />
                          </button>

                          <Button 
                            variant="outline" 
                            onClick={() => setSelectedDriver(d)}
                            style={{ fontSize: '12px', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <Eye size={14} /> Details
                          </Button>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Registered Passengers (Users) */}
          {activeTab === 'passengers' && (
            <div className="tab-pane">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h2>Registered Customers (Users)</h2>
                  <p className="tab-subtitle">Database of passenger accounts registered to request and book rides on the platform.</p>
                </div>
                <button 
                  onClick={() => setShowAddPassengerModal(true)}
                  style={{ background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 16px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  + Add New Passenger
                </button>
              </div>

              {/* Dynamic Search Box for Passengers */}
              <div style={{ position: 'relative', margin: '14px 0 14px 0', maxWidth: '350px' }}>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Search passengers (name, email, phone...)" 
                  value={passengerSearch}
                  onChange={(e) => setPassengerSearch(e.target.value)}
                  style={{ padding: '10px 14px 10px 36px', width: '100%', fontSize: '13px' }}
                />
                <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>

              {filteredPassengers.length === 0 ? (
                <p className="empty-state">No matching registered passengers found.</p>
              ) : (
                <div style={{ border: '1px solid var(--border)', borderRadius: '12px', overflowX: 'auto', background: 'rgba(255,255,255,0.01)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border)' }}>
                        <th style={{ padding: '16px', fontWeight: '700' }}>Name</th>
                        <th style={{ padding: '16px', fontWeight: '700' }}>Rating</th>
                        <th style={{ padding: '16px', fontWeight: '700' }}>Email Address</th>
                        <th style={{ padding: '16px', fontWeight: '700' }}>Mobile Number</th>
                        <th style={{ padding: '16px', fontWeight: '700' }}>Total Spent</th>
                        <th style={{ padding: '16px', fontWeight: '700' }}>GST Paid</th>
                        <th style={{ padding: '16px', fontWeight: '700' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPassengers.map((p) => (
                        <tr key={p.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }} className="table-row-hover">
                          <td style={{ padding: '16px', fontWeight: '600' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{ width: '34px', height: '34px', borderRadius: '50%', overflow: 'hidden', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.05)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '13px', color: '#3b82f6' }}>
                                {p.profilePic ? <img src={p.profilePic} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : p.name.charAt(0)}
                              </div>
                              <span>{p.name}</span>
                            </div>
                          </td>
                          <td style={{ padding: '16px', color: '#f59e0b', fontWeight: '700' }}>★ {p.rating || '5.0'}</td>
                          <td style={{ padding: '16px', color: 'var(--text-main)' }}>{p.email}</td>
                          <td style={{ padding: '16px', color: 'var(--text-main)' }}>{p.phone}</td>
                          <td style={{ padding: '16px', fontWeight: '600', color: 'var(--primary)' }}>₹{parseFloat(p.wallet?.totalSpent || 0).toFixed(2)}</td>
                          <td style={{ padding: '16px', color: '#f59e0b' }}>₹{parseFloat(p.wallet?.taxPaid || 0).toFixed(2)}</td>
                          <td style={{ padding: '16px' }}>
                            <button
                              title="Delete Passenger"
                              onClick={() => {
                                if (window.confirm(`WARNING: Are you sure you want to PERMANENTLY delete passenger ${p.name}?`)) {
                                  handleDeletePassenger(p.id);
                                }
                              }}
                              style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                              <X size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB: Staff & Management */}
          {activeTab === 'staff' && (
            <div className="tab-pane animate-fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h2>Staff & Management</h2>
                  <p className="tab-subtitle">Manage internal staff, managers and view their attendance.</p>
                </div>
                <Button variant="primary" onClick={() => setShowAddEmployeeModal(true)}>
                  + Add Employee
                </Button>
              </div>

              {employees.length === 0 ? (
                <div className="empty-state">No employees found.</div>
              ) : (
                <div style={{ border: '1px solid var(--border)', borderRadius: '12px', overflowX: 'auto', background: 'var(--card-bg)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                    <thead>
                      <tr style={{ background: 'var(--bg-hover)', borderBottom: '1px solid var(--border)' }}>
                        <th style={{ padding: '16px' }}>Name</th>
                        <th style={{ padding: '16px' }}>Role</th>
                        <th style={{ padding: '16px' }}>Status</th>
                        <th style={{ padding: '16px' }}>Today's Sign In</th>
                        <th style={{ padding: '16px' }}>Today's Sign Out</th>
                        <th style={{ padding: '16px', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees.map(emp => {
                        const today = new Date().toISOString().split('T')[0];
                        const todayAttendance = emp.attendance?.find(a => a.date === today);
                        return (
                          <tr key={emp.id} style={{ borderBottom: '1px solid var(--border)' }}>
                            <td style={{ padding: '16px' }}>
                              <div style={{ fontWeight: 600 }}>{emp.name}</div>
                              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>@{emp.username}</div>
                              {emp.position && <div style={{ fontSize: '11px', color: 'var(--primary)', marginTop: '2px' }}>{emp.position}</div>}
                            </td>
                            <td style={{ padding: '16px', textTransform: 'capitalize' }}>
                              <span style={{ 
                                padding: '4px 8px', 
                                borderRadius: '4px', 
                                fontSize: '12px', 
                                background: emp.role === 'manager' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                color: emp.role === 'manager' ? '#3b82f6' : '#10b981'
                              }}>
                                {emp.role}
                              </span>
                            </td>
                            <td style={{ padding: '16px' }}>
                              <span style={{ 
                                padding: '4px 8px', 
                                borderRadius: '4px', 
                                fontSize: '12px', 
                                background: emp.isBlocked ? 'rgba(239, 68, 68, 0.1)' : (emp.status === 'pending' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)'),
                                color: emp.isBlocked ? '#ef4444' : (emp.status === 'pending' ? '#f59e0b' : '#10b981')
                              }}>
                                {emp.isBlocked ? 'Blocked' : (emp.status === 'pending' ? 'Pending' : 'Approved')}
                              </span>
                            </td>
                            <td style={{ padding: '16px' }}>
                              {todayAttendance?.signIn ? new Date(todayAttendance.signIn).toLocaleTimeString() : '-'}
                            </td>
                            <td style={{ padding: '16px' }}>
                              {todayAttendance?.signOut ? new Date(todayAttendance.signOut).toLocaleTimeString() : '-'}
                            </td>
                            <td style={{ padding: '16px', textAlign: 'right' }}>
                              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                                <button 
                                  onClick={() => setSelectedEmployeeForDetails(emp)}
                                  style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                                >
                                  View Details
                                </button>
                                {emp.status === 'pending' && !emp.isBlocked && (
                                  <button 
                                    onClick={async () => {
                                      await fetch(`${API_BASE}/api/admin/employees/${emp.id}/approve`, { method: 'POST' });
                                      fetchEmployees();
                                    }}
                                    style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                                  >
                                    Approve
                                  </button>
                                )}
                                {emp.status === 'approved' && !emp.isBlocked && (
                                  <button 
                                    onClick={async () => {
                                      if (window.confirm('Block this employee?')) {
                                        await fetch(`${API_BASE}/api/admin/employees/${emp.id}/block`, { method: 'POST' });
                                        fetchEmployees();
                                      }
                                    }}
                                    style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                                  >
                                    Block
                                  </button>
                                )}
                                {emp.isBlocked && (
                                  <button 
                                    onClick={async () => {
                                      if (window.confirm('Unblock this employee?')) {
                                        await fetch(`${API_BASE}/api/admin/employees/${emp.id}/unblock`, { method: 'POST' });
                                        fetchEmployees();
                                      }
                                    }}
                                    style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                                  >
                                    Unblock
                                  </button>
                                )}
                                <button 
                                  onClick={async () => {
                                    if (window.confirm('Delete this employee?')) {
                                      await fetch(`${API_BASE}/api/admin/employees/${emp.id}`, { method: 'DELETE' });
                                      fetchEmployees();
                                    }
                                  }}
                                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '12px', padding: '6px' }}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Driver Ledger Accounts */}
          {activeTab === 'ledger' && (
            <div className="tab-pane">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h2>{ledgerFilter === 'pending' ? 'Pending Collection Report' : ledgerFilter === 'no-pending' ? 'Settled Collection Report' : 'Master Collection Report'}</h2>
                  <p className="tab-subtitle">
                    {ledgerFilter === 'pending' 
                      ? 'Showing outstanding commission and GST platform dues currently owed by partners.' 
                      : ledgerFilter === 'no-pending' 
                        ? 'Showing partners with zero platform dues and completed settlements.' 
                        : 'Monitor cash collections, contact profiles, and outstanding balances due to the platform.'}
                  </p>
                </div>
                
                {/* Search & Dynamic Status Filters */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="text" 
                      className="input-field" 
                      placeholder="Search ledger by vehicle number, name..." 
                      value={ledgerSearch}
                      onChange={(e) => setLedgerSearch(e.target.value)}
                      style={{ padding: '8px 12px 8px 34px', width: '220px', fontSize: '13px' }}
                    />
                    <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                  </div>

                  {/* Pending & Non-Pending Amount Filter dropdown */}
                  <select 
                    className="input-field" 
                    value={ledgerFilter} 
                    onChange={(e) => setLedgerFilter(e.target.value)}
                    style={{ 
                      padding: '8px 12px', 
                      width: '200px', 
                      fontSize: '13px', 
                      fontWeight: '600',
                      display: 'block',
                      color: '#ffffff',
                      background: '#1a2035',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="all" style={{ background: '#1a2035', color: '#ffffff' }}>Show All Balances</option>
                    <option value="pending" style={{ background: '#1a2035', color: '#ef4444' }}>With Pending Due (&gt; ₹0)</option>
                    <option value="no-pending" style={{ background: '#1a2035', color: '#10b981' }}>No Pending Due (₹0)</option>
                  </select>
                  
                  <Button 
                    variant="outline" 
                    onClick={downloadDailyLedgerCSV}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '38px', borderColor: '#10b981', color: '#10b981' }}
                  >
                    <FileText size={16} /> Download Daily Ledger (CSV)
                  </Button>
                  
                  <Button 
                    variant="primary" 
                    onClick={downloadLedgerCSV}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '38px' }}
                  >
                    <TrendingUp size={16} /> Export to Excel (CSV)
                  </Button>
                </div>
              </div>

              {filteredLedgerDrivers.length === 0 ? (
                <p className="empty-state">No matching driver ledger accounts found.</p>
              ) : (
                <div style={{ border: '1px solid var(--border)', borderRadius: '12px', overflowX: 'auto', background: 'rgba(255,255,255,0.01)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border)' }}>
                        <th style={{ padding: '16px', fontWeight: '700' }}>Partner Name</th>
                        <th style={{ padding: '16px', fontWeight: '700' }}>Contact Number</th>
                        <th style={{ padding: '16px', fontWeight: '700' }}>Vehicle & Plate</th>
                        <th style={{ padding: '16px', fontWeight: '700' }}>Cash Collected</th>
                        <th style={{ padding: '16px', fontWeight: '700' }}>Pending Amount (Due)</th>
                        <th style={{ padding: '16px', fontWeight: '700' }}>Non-Pending (Settled)</th>
                        <th style={{ padding: '16px', fontWeight: '700', textAlign: 'center' }}>Balance Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLedgerDrivers.map((d) => (
                        <tr key={d.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }} className="table-row-hover">
                          <td style={{ padding: '16px', fontWeight: '600' }}>{d.name}</td>
                          <td style={{ padding: '16px', color: 'var(--text-main)', fontWeight: '500' }}>{d.phone}</td>
                          <td style={{ padding: '16px', color: 'var(--text-main)' }}>
                            {d.manufacturer} {d.model} (<span style={{ fontFamily: 'monospace', fontSize: '12px', fontWeight: '600' }}>{d.plate}</span>)
                          </td>
                          <td style={{ padding: '16px', fontWeight: '600', color: 'var(--primary)' }}>₹{parseFloat(d.wallet?.cashCollected || 0).toFixed(2)}</td>
                          <td style={{ padding: '16px', fontWeight: '700', color: '#ef4444' }}>-₹{parseFloat(d.wallet?.toBePaid || 0).toFixed(2)}</td>
                          <td style={{ padding: '16px', fontWeight: '700', color: 'var(--primary)' }}>
                            ₹{parseFloat((d.wallet?.cashCollected || 0) - (d.wallet?.toBePaid || 0)).toFixed(2)}
                          </td>
                          <td style={{ padding: '16px', textAlign: 'center' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                              {parseFloat(d.wallet?.toBePaid || 0) > 1500 ? (
                                <span style={{
                                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                                  background: 'rgba(239,68,68,0.1)', color: '#ef4444',
                                  border: '1px solid rgba(239,68,68,0.3)', borderRadius: '20px',
                                  padding: '2px 10px', fontSize: '10px', fontWeight: '800'
                                }}>
                                  🔒 Cash Locked
                                </span>
                              ) : (
                                <span style={{
                                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                                  background: 'rgba(16,185,129,0.1)', color: '#10b981',
                                  border: '1px solid rgba(16,185,129,0.25)', borderRadius: '20px',
                                  padding: '2px 10px', fontSize: '10px', fontWeight: '700'
                                }}>
                                  ✓ Cash Active
                                </span>
                              )}
                              {parseFloat(d.wallet?.toBePaid || 0) > 0 && (
                                <Button
                                  variant="outline"
                                  onClick={() => handleOpenCollectCashModal(d)}
                                  style={{ borderColor: '#10b981', color: '#10b981', padding: '4px 10px', fontSize: '11px', fontWeight: '700' }}
                                >
                                  ✅ Payment Received
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr style={{ background: 'rgba(255, 255, 255, 0.04)', borderTop: '2px solid var(--border)', fontWeight: 'bold' }}>
                        <td style={{ padding: '16px' }}>Grand Total</td>
                        <td style={{ padding: '16px' }}>-</td>
                        <td style={{ padding: '16px' }}>-</td>
                        <td style={{ padding: '16px', color: 'var(--primary)', fontWeight: '800' }}>
                          ₹{filteredLedgerDrivers.reduce((sum, d) => sum + (d.wallet?.cashCollected || 0), 0).toFixed(2)}
                        </td>
                        <td style={{ padding: '16px', color: '#ef4444', fontWeight: '800' }}>
                          -₹{filteredLedgerDrivers.reduce((sum, d) => sum + (d.wallet?.toBePaid || 0), 0).toFixed(2)}
                        </td>
                        <td style={{ padding: '16px', color: 'var(--primary)', fontWeight: '800' }}>
                          ₹{filteredLedgerDrivers.reduce((sum, d) => sum + ((d.wallet?.cashCollected || 0) - (d.wallet?.toBePaid || 0)), 0).toFixed(2)}
                        </td>
                        <td style={{ padding: '16px', textAlign: 'center', color: '#ef4444', fontWeight: '800' }}>
                          {filteredLedgerDrivers.filter(d => parseFloat(d.wallet?.toBePaid || 0) > 1500).length} Locked Partners
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}

              {/* Transactional Reports Download Section */}
              <div style={{ marginTop: '24px', padding: '20px', border: '1px solid var(--border)', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.01)' }}>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: '800' }}>System Operational Reports</h3>
                <p style={{ margin: '0 0 16px 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                  Download audit spreadsheets of completed trips and revenue splits over custom time windows.
                </p>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <Button variant="outline" onClick={() => downloadReportCSV('daily')} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <TrendingUp size={15} /> Download Daily Report
                  </Button>
                  <Button variant="outline" onClick={() => downloadReportCSV('weekly')} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <TrendingUp size={15} /> Download Weekly Report
                  </Button>
                  <Button variant="outline" onClick={() => downloadReportCSV('monthly')} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <TrendingUp size={15} /> Download Monthly Report
                  </Button>
                </div>
              </div>

            </div>
          )}

          {/* TAB: Dedicated Pending Payments Section */}
          {activeTab === 'pending-payments' && (
            <div className="tab-pane">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CreditCard color="#ef4444" size={28} /> Pending Payments & Dues Control
                  </h2>
                  <p className="tab-subtitle">
                    Dedicated view for outstanding partner balances. Dues uncollected on the same day automatically roll over daily with aging indicators until cleared.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="text" 
                      className="input-field" 
                      placeholder="Search partner, phone, plate..." 
                      value={pendingSearch}
                      onChange={(e) => setPendingSearch(e.target.value)}
                      style={{ padding: '8px 12px 8px 34px', width: '220px', fontSize: '13px' }}
                    />
                    <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                  </div>

                  <select 
                    className="input-field" 
                    value={pendingFilter} 
                    onChange={(e) => setPendingFilter(e.target.value)}
                    style={{ 
                      padding: '8px 12px', 
                      width: '210px', 
                      fontSize: '13px', 
                      fontWeight: '600',
                      color: '#ffffff',
                      background: '#1a2035',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="all" style={{ background: '#1a2035', color: '#ffffff' }}>All Pending Dues</option>
                    <option value="same-day" style={{ background: '#1a2035', color: '#3b82f6' }}>Pending Today (Same Day)</option>
                    <option value="rolled-over" style={{ background: '#1a2035', color: '#f59e0b' }}>Rolled Over (1+ Days)</option>
                    <option value="critical-overdue" style={{ background: '#1a2035', color: '#ef4444' }}>Critical Overdue (&gt; 3 Days)</option>
                  </select>

                  <Button 
                    variant="outline" 
                    onClick={downloadPendingPaymentsCSV}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '38px', borderColor: '#ef4444', color: '#ef4444' }}
                  >
                    <FileText size={16} /> Export Pending Dues (CSV)
                  </Button>
                </div>
              </div>

              {/* Summary Cards Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#ef4444', textTransform: 'uppercase' }}>Total Outstanding Dues</span>
                    <AlertCircle size={20} color="#ef4444" />
                  </div>
                  <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#ffffff', marginTop: '8px', marginBottom: '0' }}>
                    -₹{pendingPaymentsData.summary.totalOutstanding}
                  </h3>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Across all active partner accounts</span>
                </div>

                <div style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#3b82f6', textTransform: 'uppercase' }}>Due Today (Same Day)</span>
                    <Check size={20} color="#3b82f6" />
                  </div>
                  <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#ffffff', marginTop: '8px', marginBottom: '0' }}>
                    -₹{pendingPaymentsData.summary.totalSameDay}
                  </h3>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Incurred today & pending collection</span>
                </div>

                <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#f59e0b', textTransform: 'uppercase' }}>Rolled-Over Dues</span>
                    <TrendingUp size={20} color="#f59e0b" />
                  </div>
                  <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#ffffff', marginTop: '8px', marginBottom: '0' }}>
                    -₹{pendingPaymentsData.summary.totalRolledOver}
                  </h3>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Uncollected from previous days</span>
                </div>

                <div style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.25)', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#a855f7', textTransform: 'uppercase' }}>Pending Partners</span>
                    <Users size={20} color="#a855f7" />
                  </div>
                  <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#ffffff', marginTop: '8px', marginBottom: '0' }}>
                    {pendingPaymentsData.summary.pendingPartnersCount}
                  </h3>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Drivers with balance due &gt; ₹0</span>
                </div>
              </div>

              {/* Table of Pending Payments */}
              {filteredPendingPayments.length === 0 ? (
                <p className="empty-state">No pending payment dues matching your criteria.</p>
              ) : (
                <div style={{ border: '1px solid var(--border)', borderRadius: '12px', overflowX: 'auto', background: 'rgba(255,255,255,0.01)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border)' }}>
                        <th style={{ padding: '16px', fontWeight: '700' }}>Partner Name</th>
                        <th style={{ padding: '16px', fontWeight: '700' }}>Contact</th>
                        <th style={{ padding: '16px', fontWeight: '700' }}>Vehicle Plate</th>
                        <th style={{ padding: '16px', fontWeight: '700' }}>Cash Collected</th>
                        <th style={{ padding: '16px', fontWeight: '700' }}>Pending Due Amount</th>
                        <th style={{ padding: '16px', fontWeight: '700' }}>First Incurred Date</th>
                        <th style={{ padding: '16px', fontWeight: '700' }}>Aging / Days Pending</th>
                        <th style={{ padding: '16px', fontWeight: '700', textAlign: 'center' }}>Rollover Status</th>
                        <th style={{ padding: '16px', fontWeight: '700', textAlign: 'center' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPendingPayments.map((p) => (
                        <tr key={p.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }} className="table-row-hover">
                          <td style={{ padding: '16px', fontWeight: '600' }}>{p.name}</td>
                          <td style={{ padding: '16px', color: 'var(--text-main)', fontWeight: '500' }}>{p.phone}</td>
                          <td style={{ padding: '16px', color: 'var(--text-main)' }}>
                            {p.manufacturer} {p.model} (<span style={{ fontFamily: 'monospace', fontSize: '12px', fontWeight: '600' }}>{p.plate}</span>)
                          </td>
                          <td style={{ padding: '16px', fontWeight: '600', color: 'var(--primary)' }}>₹{p.cashCollected}</td>
                          <td style={{ padding: '16px', fontWeight: '800', color: '#ef4444', fontSize: '15px' }}>-₹{p.toBePaid}</td>
                          <td style={{ padding: '16px', fontSize: '13px', color: 'var(--text-muted)' }}>{p.pendingDateFormatted}</td>
                          <td style={{ padding: '16px', fontWeight: '700' }}>
                            {p.daysPending === 0 ? (
                              <span style={{ color: '#3b82f6' }}>0 Days (Today)</span>
                            ) : p.daysPending === 1 ? (
                              <span style={{ color: '#f59e0b' }}>1 Day Overdue</span>
                            ) : (
                              <span style={{ color: '#ef4444' }}>{p.daysPending} Days Overdue</span>
                            )}
                          </td>
                          <td style={{ padding: '16px', textAlign: 'center' }}>
                            <span style={{
                              display: 'inline-flex', alignItems: 'center', gap: '4px',
                              background: p.daysPending === 0 ? 'rgba(59,130,246,0.1)' : p.daysPending < 3 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.15)',
                              color: p.daysPending === 0 ? '#3b82f6' : p.daysPending < 3 ? '#f59e0b' : '#ef4444',
                              border: `1px solid ${p.daysPending === 0 ? 'rgba(59,130,246,0.3)' : p.daysPending < 3 ? 'rgba(245,158,11,0.3)' : 'rgba(239,68,68,0.4)'}`,
                              borderRadius: '20px', padding: '4px 12px', fontSize: '11px', fontWeight: '800'
                            }}>
                              {p.statusLabel}
                            </span>
                          </td>
                          <td style={{ padding: '16px', textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                              <Button 
                                variant="primary" 
                                style={{ padding: '6px 12px', fontSize: '12px', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', fontWeight: '700' }}
                                onClick={() => {
                                  setSelectedLedgerDriver(drivers.find(d => d.id === p.id) || p);
                                  setCollectAmount(p.toBePaid);
                                  setShowCollectCashModal(true);
                                }}
                              >
                                ✅ Payment Received
                              </Button>
                              <Button 
                                variant="outline" 
                                style={{ padding: '6px 10px', fontSize: '12px', borderColor: '#3b82f6', color: '#3b82f6' }}
                                onClick={() => {
                                  const driverObj = drivers.find(d => d.id === p.id) || p;
                                  setMessageModalDriver(driverObj);
                                  fetchChatMessages(driverObj.email);
                                }}
                              >
                                <MessageSquare size={14} /> Reminder
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB: Analytics */}
          {activeTab === 'analytics' && (
            <div className="tab-pane animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              <div>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <TrendingUp size={24} color="var(--primary)" /> Business Visual Analytics
                </h2>
                <p className="tab-subtitle">Real-time revenue metrics, ride volume, and platform growth graphs.</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
                  {/* Revenue Chart Mockup */}
                  <div className="glass-card" style={{ padding: '20px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '16px' }}>Revenue (Last 7 Days)</h3>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '180px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                      {[40, 70, 50, 90, 60, 100, 80].map((h, i) => (
                        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '100%', height: `${h}%`, background: 'linear-gradient(to top, rgba(59, 130, 246, 0.2), #3b82f6)', borderRadius: '4px 4px 0 0', position: 'relative' }}>
                            <span style={{ position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)', fontSize: '10px', color: 'var(--text-muted)' }}>₹{h*120}</span>
                          </div>
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Day {i+1}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Ride Volume Chart Mockup */}
                  <div className="glass-card" style={{ padding: '20px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '16px' }}>Ride Volume (Last 7 Days)</h3>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '180px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                      {[30, 50, 45, 80, 55, 95, 75].map((h, i) => (
                        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '100%', height: `${h}%`, background: 'linear-gradient(to top, rgba(16, 185, 129, 0.2), #10b981)', borderRadius: '4px 4px 0 0', position: 'relative' }}>
                            <span style={{ position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)', fontSize: '10px', color: 'var(--text-muted)' }}>{h*2}</span>
                          </div>
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Day {i+1}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Key Metrics */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginTop: '20px' }}>
                  <div className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Total Commission</span>
                    <h3 style={{ margin: '8px 0 0 0', color: '#10b981', fontSize: '20px' }}>₹1,42,500</h3>
                  </div>
                  <div className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Active Drivers</span>
                    <h3 style={{ margin: '8px 0 0 0', color: '#3b82f6', fontSize: '20px' }}>428</h3>
                  </div>
                  <div className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Completed Trips</span>
                    <h3 style={{ margin: '8px 0 0 0', color: '#f59e0b', fontSize: '20px' }}>12,840</h3>
                  </div>
                  <div className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Avg Rating</span>
                    <h3 style={{ margin: '8px 0 0 0', color: '#8b5cf6', fontSize: '20px' }}>4.82</h3>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: Promotions */}
          {activeTab === 'promotions' && (
            <div className="tab-pane animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              <div>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Tag size={24} color="var(--primary)" /> Promotions & Offer Codes
                </h2>
                <p className="tab-subtitle">Manage discount promo codes and promotional campaigns.</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', marginTop: '20px' }}>
                  {/* Create New Promo */}
                  <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 'bold' }}>Create New Promo</h3>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '6px', display: 'block' }}>Promo Code</label>
                      <input type="text" className="input-field" placeholder="e.g. SUMMER50" style={{ textTransform: 'uppercase' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '6px', display: 'block' }}>Discount Type</label>
                      <select className="input-field">
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed Amount (INR)</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '6px', display: 'block' }}>Discount Value</label>
                      <input type="number" className="input-field" placeholder="e.g. 50" />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '6px', display: 'block' }}>Valid Until</label>
                      <input type="date" className="input-field" />
                    </div>
                    <button type="button" style={{ background: 'var(--primary)', color: '#000', padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => alert('New promo code created successfully!')}>Generate Code</button>
                  </div>

                  {/* Active Promos List */}
                  <div className="glass-card" style={{ padding: '20px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '16px' }}>Active Promotional Codes</h3>
                    <div className="table-responsive">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Code</th>
                            <th>Discount</th>
                            <th>Usage</th>
                            <th>Expires</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td><strong style={{ color: 'var(--primary)', letterSpacing: '1px' }}>HUM50</strong></td>
                            <td>50% OFF</td>
                            <td>45/100</td>
                            <td>Dec 31, 2026</td>
                            <td><span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '12px' }}>Active</span></td>
                            <td><button style={{ background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '4px', padding: '4px 8px', fontSize: '11px', cursor: 'pointer' }}>Deactivate</button></td>
                          </tr>
                          <tr>
                            <td><strong style={{ color: 'var(--primary)', letterSpacing: '1px' }}>WELCOME250</strong></td>
                            <td>₹250 OFF</td>
                            <td>912/Unlim</td>
                            <td>Never</td>
                            <td><span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '12px' }}>Active</span></td>
                            <td><button style={{ background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '4px', padding: '4px 8px', fontSize: '11px', cursor: 'pointer' }}>Deactivate</button></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: System Settings */}
          {activeTab === 'settings' && (
            <div className="tab-pane" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              <div>
                <h2>Total Control Settings</h2>
                <p className="tab-subtitle">Adjust rates, manage dynamic surges, and view active global system settings.</p>

                <form onSubmit={handleSaveSettings} className="admin-settings-form">
                  <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label>Base Ride Fare (INR)</label>
                      <input 
                        type="number" 
                        className="input-field" 
                        value={baseFare}
                        onChange={(e) => setBaseFare(e.target.value)} 
                        min="0"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Driver Min Rate/KM (INR)</label>
                      <input 
                        type="number" 
                        className="input-field" 
                        value={ratePerKm}
                        onChange={(e) => setRatePerKm(e.target.value)}
                        min="0"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Driver Min Rate/Hour (INR)</label>
                      <input 
                        type="number" 
                        className="input-field" 
                        value={minRatePerHour}
                        onChange={(e) => setMinRatePerHour(e.target.value)}
                        min="0"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Peak Surge Multiplier</label>
                      <select 
                        className="input-field"
                        value={surgeMultiplier}
                        onChange={(e) => setSurgeMultiplier(e.target.value)}
                        style={{ appearance: 'none', WebkitAppearance: 'none' }}
                      >
                        <option value="1.0">1.0x (Standard Rates)</option>
                        <option value="1.2">1.2x (Mild Demand)</option>
                        <option value="1.5">1.5x (High Surge)</option>
                        <option value="2.0">2.0x (Peak Hours)</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Global System Mode</label>
                      <select 
                        className="input-field"
                        value={systemStatus}
                        onChange={(e) => setSystemStatus(e.target.value)}
                        style={{ appearance: 'none', WebkitAppearance: 'none' }}
                      >
                        <option value="online">Online (Accepting all users)</option>
                        <option value="maintenance">Maintenance (Admins Only)</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ marginTop: '24px', borderTop: '1px solid var(--border)', paddingTop: '20px', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: '800', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MapPin size={18} color="#f59e0b" /> Dynamic Surge Geofencing Zones
                    </h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                      Define specific zones that will override the global surge multiplier during high-demand events (e.g. Airports, Stadiums).
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px', background: 'rgba(245,158,11,0.05)', padding: '16px', borderRadius: '12px', border: '1px dashed #f59e0b' }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '6px', display: 'block' }}>Active Zones</label>
                        <div style={{ background: 'var(--bg-card)', padding: '8px', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', borderBottom: '1px solid var(--border)', paddingBottom: '4px' }}>
                            <span>Kochi International Airport</span>
                            <span style={{ color: '#ef4444', fontWeight: 'bold' }}>2.0x</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                            <span>Jawaharlal Nehru Stadium</span>
                            <span style={{ color: '#ef4444', fontWeight: 'bold' }}>1.5x</span>
                          </div>
                        </div>
                        <button type="button" style={{ width: '100%', marginTop: '12px', background: 'transparent', border: '1px solid #f59e0b', color: '#f59e0b', padding: '6px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>+ Add New Zone</button>
                      </div>
                      <div style={{ background: '#121624', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '12px', minHeight: '120px' }}>
                        [Interactive Map Placeholder for Drawing Geo-Fences]
                      </div>
                    </div>
                  </div>

                  {/* NUMBER MASKING (VOIP) SETTINGS */}
                  <div style={{ marginTop: '24px', borderTop: '1px solid var(--border)', paddingTop: '20px', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: '800', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Phone size={18} color="#3b82f6" /> Number Masking (VoIP) Privacy
                    </h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                      Enforce number masking to protect passenger and driver privacy. When enabled, all calls route through the HUM PBX system.
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(59, 130, 246, 0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
                          <input 
                            type="checkbox" 
                            checked={voipMasking} 
                            onChange={(e) => setVoipMasking(e.target.checked)} 
                            style={{ width: '18px', height: '18px', accentColor: '#3b82f6', cursor: 'pointer' }}
                          />
                          Enable Global Call Masking
                        </label>
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        Status: <span style={{ color: voipMasking ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>{voipMasking ? 'ACTIVE (Calls Routed via PBX)' : 'INACTIVE (Direct Dialing)'}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: '24px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: '800', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CreditCard size={18} color="var(--primary)" /> Payment Gateway Configurations (For Driver Dues Collection)
                    </h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                      Configure the gateway details drivers will see when settling their platform commission dues.
                    </p>

                    <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
                      <div className="form-group">
                        <label>Gateway Type</label>
                        <select 
                          className="input-field"
                          value={gatewayType}
                          onChange={(e) => setGatewayType(e.target.value)}
                          style={{ appearance: 'none', WebkitAppearance: 'none' }}
                        >
                          <option value="upi">UPI Address / QR Code</option>
                          <option value="bank">Direct Bank Transfer</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Account Holder / Beneficiary Name</label>
                        <input 
                          type="text" 
                          className="input-field" 
                          value={accountHolder}
                          onChange={(e) => setAccountHolder(e.target.value)}
                          placeholder="e.g. HUM FLEET PLATFORMS PVT LTD"
                          required
                        />
                      </div>
                    </div>

                    {gatewayType === 'upi' ? (
                      <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
                        <div className="form-group">
                          <label>UPI ID (VPA)</label>
                          <input 
                            type="text" 
                            className="input-field" 
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            placeholder="e.g. humfleet@okaxis"
                            required={gatewayType === 'upi'}
                          />
                        </div>
                        <div className="form-group">
                          <label>Upload UPI QR Code (Optional Image)</label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
                            <input 
                              type="file" 
                              accept="image/*"
                              style={{ display: 'none' }}
                              id="admin-qr-upload-input"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (evt) => setQrCodeUrl(evt.target.result);
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                            <label htmlFor="admin-qr-upload-input" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '13px', background: 'rgba(255,255,255,0.02)', color: 'var(--text-main)' }}>
                              <Upload size={14} /> Choose Image
                            </label>
                            {qrCodeUrl && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ fontSize: '12px', color: 'var(--primary)' }}>✓ Uploaded</span>
                                <button type="button" onClick={() => setQrCodeUrl('')} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '11px', cursor: 'pointer', fontWeight: '700' }}>Remove</button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
                          <div className="form-group">
                            <label>Bank Name</label>
                            <input 
                              type="text" 
                              className="input-field" 
                              value={bankName}
                              onChange={(e) => setBankName(e.target.value)}
                              placeholder="e.g. HDFC Bank"
                              required={gatewayType === 'bank'}
                            />
                          </div>
                          <div className="form-group">
                            <label>Account Number</label>
                            <input 
                              type="text" 
                              className="input-field" 
                              value={accountNo}
                              onChange={(e) => setAccountNo(e.target.value)}
                              placeholder="e.g. 50100234567890"
                              required={gatewayType === 'bank'}
                            />
                          </div>
                        </div>
                        <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
                          <div className="form-group">
                            <label>IFSC Code</label>
                            <input 
                              type="text" 
                              className="input-field" 
                              value={ifscCode}
                              onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                              placeholder="e.g. HDFC0000123"
                              required={gatewayType === 'bank'}
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <Button variant="primary" type="submit" style={{ marginTop: '16px' }}>
                    Save System Configuration
                  </Button>
                </form>
              </div>

              {/* Dynamic Vehicle Categories Manager Card */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
                <h2>Vehicle Categories Manager</h2>
                <p className="tab-subtitle">Configure available vehicle classes, max passenger seats, and separate pricing rates dynamically.</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '24px', marginTop: '16px' }}>
                  {/* Category Table */}
                  <div style={{ border: '1px solid var(--border)', borderRadius: '12px', overflowX: 'auto', background: 'rgba(255,255,255,0.01)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border)' }}>
                          <th style={{ padding: '12px 16px', fontWeight: '700' }}>Class Name</th>
                          <th style={{ padding: '12px 16px', fontWeight: '700' }}>Max Passengers</th>
                          <th style={{ padding: '12px 16px', fontWeight: '700' }}>Base Fare</th>
                          <th style={{ padding: '12px 16px', fontWeight: '700' }}>Rate/KM</th>
                          <th style={{ padding: '12px 16px', fontWeight: '700', textAlign: 'center' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(Array.isArray(categories) ? categories : []).map((cat) => (
                          <tr key={cat.id} style={{ borderBottom: '1px solid var(--border)' }} className="table-row-hover">
                            <td style={{ padding: '12px 16px', fontWeight: '600' }}>{cat.name}</td>
                            <td style={{ padding: '12px 16px', color: 'var(--text-main)' }}>{cat.maxPassengers} Passengers</td>
                            <td style={{ padding: '12px 16px', fontWeight: '600', color: 'var(--primary)' }}>₹{parseFloat(cat.baseFare).toFixed(2)}</td>
                            <td style={{ padding: '12px 16px', fontWeight: '600', color: 'var(--primary)' }}>₹{parseFloat(cat.ratePerKm).toFixed(2)}</td>
                            <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                              <button 
                                onClick={() => handleStartEdit(cat)}
                                style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '12px', fontWeight: '700', marginRight: '10px' }}
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => handleDeleteCategory(cat.id)}
                                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '12px', fontWeight: '700' }}
                                disabled={(Array.isArray(categories) ? categories : []).length <= 1} // Retain at least 1 category!
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Add/Edit Class Form */}
                  <form onSubmit={handleAddCategory} className="admin-settings-form" style={{ margin: 0, padding: '20px', border: '1px solid var(--border)', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.01)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: '800' }}>
                      {editingCategory ? 'Edit Vehicle Class' : 'Add Vehicle Class'}
                    </h3>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label>Category Name</label>
                      <input 
                        type="text" 
                        className="input-field" 
                        placeholder="e.g. HUM SUV"
                        value={catName}
                        onChange={(e) => setCatName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label>Max Passengers</label>
                      <input 
                        type="number" 
                        className="input-field" 
                        min="1"
                        max="20"
                        value={catPassengers}
                        onChange={(e) => setCatPassengers(e.target.value)}
                        required
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <div className="form-group" style={{ flex: 1, margin: 0 }}>
                        <label>Base Fare (₹)</label>
                        <input 
                          type="number" 
                          className="input-field" 
                          min="0"
                          value={catBaseFare}
                          onChange={(e) => setCatBaseFare(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group" style={{ flex: 1, margin: 0 }}>
                        <label>Rate / KM (₹)</label>
                        <input 
                          type="number" 
                          className="input-field" 
                          min="0"
                          value={catRatePerKm}
                          onChange={(e) => setCatRatePerKm(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <Button variant="primary" type="submit" style={{ width: '100%' }}>
                        {editingCategory ? 'Save Changes' : 'Create Category'}
                      </Button>
                      {editingCategory && (
                        <Button 
                          variant="outline" 
                          type="button" 
                          style={{ width: '100%', borderColor: '#ef4444', color: '#ef4444' }}
                          onClick={handleCancelEdit}
                        >
                          Cancel Edit
                        </Button>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* TAB: Global Broadcasts */}
          {activeTab === 'broadcasts' && (
            <div className="admin-card fade-in">
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', fontWeight: '800' }}>
                <Send size={22} color="var(--primary)" /> Global Broadcasts
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '20px' }}>
                Send global announcements, surge alerts, or promotional offers to all users or offline drivers.
              </p>
              
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px' }}>Broadcast to Everyone</h3>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <Send size={18} color="var(--primary)" />
                  <input 
                    type="text" 
                    placeholder="Type a global offer or announcement..." 
                    value={broadcastText}
                    onChange={(e) => setBroadcastText(e.target.value)}
                    style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text-main, #000)', outline: 'none', fontSize: '13px', borderBottom: '1px solid var(--border)', paddingBottom: '4px' }}
                  />
                  <Button variant="primary" onClick={handleBroadcastAll} style={{ padding: '6px 16px', fontSize: '12px' }}>
                    Broadcast
                  </Button>
                </div>
              </div>

              <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '8px', color: '#ef4444' }}>High Demand Surge Alert</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  Instantly push an alert to all offline drivers that there is high demand in the area.
                </p>
                <Button variant="primary" onClick={handleBroadcastToOffline} style={{ padding: '8px 16px', fontSize: '12px', background: '#ef4444', color: '#fff', border: 'none' }}>
                  <AlertCircle size={14} style={{ marginRight: '6px' }} />
                  Alert All Offline Drivers
                </Button>
              </div>
            </div>
          )}

          {/* TAB 5: Security Credentials */}
          {activeTab === 'locations' && (
            <div className="admin-card fade-in">
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', fontWeight: '800' }}>
                <MapPin size={22} color="var(--primary)" /> Business / Location Listings
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '20px' }}>
                Add custom business names and coordinates (e.g. Lulu Mall, Kochi) to ensure they always appear when passengers search.
              </p>

              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px' }}>Add New Location</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', alignItems: 'end' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Business/Location Name</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      placeholder="e.g. Lulu Mall, Kochi"
                      value={newLocName}
                      onChange={(e) => setNewLocName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Latitude</label>
                    <input 
                      type="number" 
                      className="input-field" 
                      placeholder="e.g. 10.0275"
                      value={newLocLat}
                      onChange={(e) => setNewLocLat(e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Longitude</label>
                    <input 
                      type="number" 
                      className="input-field" 
                      placeholder="e.g. 76.3082"
                      value={newLocLng}
                      onChange={(e) => setNewLocLng(e.target.value)}
                    />
                  </div>
                </div>
                <button 
                  className="btn btn-primary" 
                  style={{ marginTop: '16px' }}
                  onClick={async () => {
                    if(!newLocName || !newLocLat || !newLocLng) return alert('Fill all fields');
                    const res = await fetch(`${API_BASE}/api/locations`, {
                      method: 'POST',
                      headers: {'Content-Type': 'application/json'},
                      body: JSON.stringify({ name: newLocName, lat: parseFloat(newLocLat), lng: parseFloat(newLocLng) })
                    });
                    if(res.ok) {
                      setNewLocName(''); setNewLocLat(''); setNewLocLng('');
                      fetchLocations();
                      alert('Location added!');
                    } else {
                      const data = await res.json();
                      alert(data.message || data.error || 'Error adding location');
                    }
                  }}
                >
                  <MapPin size={16} /> Add to Map Registry
                </button>
              </div>

              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Location Name</th>
                      <th>Coordinates (Lat, Lng)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {businessListings.length === 0 ? (
                      <tr><td colSpan="2" style={{ textAlign: 'center', padding: '20px' }}>No custom locations added.</td></tr>
                    ) : (
                      businessListings.map((loc, i) => (
                        <tr key={i}>
                          <td style={{ fontWeight: '700' }}>{loc.name}</td>
                          <td style={{ fontFamily: 'monospace' }}>{loc.lat}, {loc.lng}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="tab-pane">
              <h2>Admin Credentials Control</h2>
              <p className="tab-subtitle">Update your operations console username and security password.</p>

              {profileError && (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', padding: '12px', color: '#ef4444', fontSize: '14px', marginBottom: '16px' }}>
                  {profileError}
                </div>
              )}
              {profileSuccess && (
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '8px', padding: '12px', color: 'var(--primary)', fontSize: '14px', marginBottom: '16px' }}>
                  {profileSuccess}
                </div>
              )}

              <form onSubmit={handleSaveCredentials} className="admin-settings-form">
                <div className="form-group">
                  <label>Consoles Username</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)} 
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Current Security Password (Required to save changes)</label>
                    <input 
                      type="password" 
                      className="input-field" 
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)} 
                      required
                      placeholder="Enter current password to verify"
                    />
                  </div>
                  <div className="form-group">
                    <label>New Security Password (Optional)</label>
                    <input 
                      type="password" 
                      className="input-field" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)} 
                      placeholder="Leave blank to keep current"
                    />
                  </div>
                </div>

                <Button variant="primary" type="submit" style={{ marginTop: '16px' }}>
                  Update Credentials
                </Button>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* Fullscreen Preview Modal */}
      {previewFile && (
        <div className="preview-modal" onClick={() => setPreviewFile(null)}>
          <div className="preview-modal-content" onClick={e => e.stopPropagation()}>
            <div className="preview-modal-header">
              <h3>{previewTitle}</h3>
              <button className="close-preview" onClick={() => setPreviewFile(null)}><X size={20} /></button>
            </div>
            <div className="preview-modal-body">
              {previewFile.startsWith('data:image') || previewFile.startsWith('http') ? (
                <img src={previewFile} alt={previewTitle} style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain', borderRadius: '8px' }} />
              ) : previewFile.startsWith('data:application/pdf') ? (
                <embed src={previewFile} type="application/pdf" width="100%" height="500px" style={{ borderRadius: '8px' }} />
              ) : (
                <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <FileText size={64} style={{ marginBottom: '16px', color: 'var(--primary)' }} />
                  <p>Document content: {previewFile}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Live Driver GPS Location Tracking Modal */}
      {selectedMapDriver && (
        <div className="preview-modal" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '640px', padding: '24px', borderRadius: '20px', background: '#121624', border: '1px solid rgba(255,255,255,0.15)', position: 'relative' }}>
            
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border)', pb: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MapPin size={22} color="#10b981" />
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#fff' }}>Live GPS Location: {selectedMapDriver.name}</h3>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {selectedMapDriver.manufacturer} {selectedMapDriver.model} • <strong style={{ color: 'var(--text-main)', fontFamily: 'monospace' }}>{selectedMapDriver.plate}</strong>
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedMapDriver(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Live Map Iframe Embed */}
            <div style={{ position: 'relative', borderRadius: '14px', overflow: 'hidden', border: '2px solid var(--primary)', height: '340px', marginBottom: '16px', background: '#0a0d14' }}>
              <iframe
                title="Live Driver GPS Map Location"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                src={`https://maps.google.com/maps?q=${selectedMapDriver.lat || 10.0088},${selectedMapDriver.lng || 76.3606}&z=15&output=embed`}
              />
            </div>

            {/* GPS & Active Trip Details Telemetry */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12px', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <div>
                <strong style={{ color: 'var(--text-muted)' }}>Status:</strong>{' '}
                {selectedMapDriver.currentRide ? (
                  <span style={{ color: '#f59e0b', fontWeight: '800' }}>🚕 On Active Trip</span>
                ) : selectedMapDriver.isOnline ? (
                  <span style={{ color: '#10b981', fontWeight: '800' }}>🟢 Online (Idle)</span>
                ) : (
                  <span style={{ color: 'var(--text-muted)', fontWeight: '800' }}>⚪ Offline</span>
                )}
              </div>
              <div><strong style={{ color: 'var(--text-muted)' }}>Mobile:</strong> {selectedMapDriver.phone}</div>
              <div><strong style={{ color: 'var(--text-muted)' }}>Latitude:</strong> {selectedMapDriver.lat ? parseFloat(selectedMapDriver.lat).toFixed(6) : '28.4950'}° N</div>
              <div><strong style={{ color: 'var(--text-muted)' }}>Longitude:</strong> {selectedMapDriver.lng ? parseFloat(selectedMapDriver.lng).toFixed(6) : '77.0896'}° E</div>
              
              {selectedMapDriver.currentRide && (
                <div style={{ gridColumn: '1 / -1', borderTop: '1px solid var(--border)', paddingTop: '8px', marginTop: '4px', color: '#f59e0b' }}>
                  <strong>Trip Telemetry:</strong> Carrying passenger <strong>{selectedMapDriver.currentRide.passengerName || 'Customer'}</strong> from <i>{selectedMapDriver.currentRide.pickup}</i> to <i>{selectedMapDriver.currentRide.dropoff}</i> (Fare: ₹{selectedMapDriver.currentRide.fare})
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* DIRECT MESSAGING MODAL (ADMIN TO DRIVER) */}
      {messageModalDriver && (
        <div className="modal-overlay" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '560px', height: '620px', display: 'flex', flexDirection: 'column', padding: '20px', borderRadius: '20px', background: 'var(--bg-card)', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '14px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--primary)', background: '#121624', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 'bold' }}>
                  {messageModalDriver.profilePic ? <img src={messageModalDriver.profilePic} alt={messageModalDriver.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : messageModalDriver.name.charAt(0)}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800' }}>Direct Message: {messageModalDriver.name}</h3>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Plate: <strong style={{ color: 'var(--text-main)', fontFamily: 'monospace' }}>{messageModalDriver.plate}</strong> • {messageModalDriver.email}</span>
                </div>
              </div>
              <button onClick={() => setMessageModalDriver(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={22} />
              </button>
            </div>

            {/* Quick Broadcast Templates */}
            <div style={{ padding: '10px 0', borderBottom: '1px solid var(--border)', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              <span style={{ width: '100%', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)' }}>Quick Broadcast Templates:</span>
              <button onClick={() => handleSendMessage("📋 Please upload your updated vehicle documents / photos.")} style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '14px', padding: '3px 10px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>
                📋 Update Docs
              </button>
              <button onClick={() => handleSendMessage("☕ High shift hours detected. Please take a rest break.")} style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '14px', padding: '3px 10px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>
                ☕ Rest Break
              </button>
              <button onClick={() => handleSendMessage("⚡ High trip demand in your area! Go online to accept rides.")} style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '14px', padding: '3px 10px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>
                ⚡ High Demand
              </button>
              <button onClick={() => handleSendMessage("📞 Please contact HUM Fleet Admin Support immediately.")} style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '14px', padding: '3px 10px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>
                📞 Contact Support
              </button>
            </div>

            {/* Messages Thread Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '14px 0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {chatMessages.length === 0 ? (
                <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                  <MessageSquare size={36} style={{ opacity: 0.4, marginBottom: '8px' }} />
                  <p style={{ margin: 0 }}>No previous direct messages with this driver.</p>
                  <p style={{ margin: 0, fontSize: '11px' }}>Type a message below or click a quick template to send.</p>
                </div>
              ) : (
                chatMessages.map((msg) => {
                  const isAdmin = msg.sender.includes('Admin');
                  return (
                    <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isAdmin ? 'flex-end' : 'flex-start' }}>
                      <div style={{
                        maxWidth: '82%',
                        background: isAdmin ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(0, 0, 0, 0.05)',
                        color: isAdmin ? '#ffffff' : 'var(--text-main)',
                        padding: '10px 14px',
                        borderRadius: isAdmin ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                        fontSize: '13px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                        border: isAdmin ? 'none' : '1px solid var(--border)'
                      }}>
                        <div style={{ fontSize: '10px', opacity: 0.8, marginBottom: '2px', fontWeight: '700' }}>
                          {msg.sender} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div>{msg.text}</div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Message Input Box */}
            <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} style={{ display: 'flex', gap: '8px', paddingTop: '10px', borderTop: '1px solid var(--border)' }}>
              <input 
                type="text" 
                className="input-field" 
                placeholder={`Type direct message to ${messageModalDriver.name}...`}
                value={newMessageText}
                onChange={(e) => setNewMessageText(e.target.value)}
                style={{ flex: 1, padding: '10px 14px', fontSize: '13px' }}
              />
              <Button variant="primary" type="submit" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px' }}>
                <Send size={16} /> Send
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* ========== ADD EMPLOYEE MODAL ========== */}
      {showAddDriverModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-card animate-scale-in" style={{ maxWidth: '500px', width: '100%', padding: '32px' }}>
            <h3 style={{ margin: '0 0 24px 0', fontSize: '20px', fontWeight: '800' }}>Add New Driver</h3>
            <form onSubmit={handleAddDriver} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input type="text" placeholder="Full Name" className="input-field" value={newDriverData.name} onChange={(e) => setNewDriverData({...newDriverData, name: e.target.value})} required />
              <input type="email" placeholder="Email Address" className="input-field" value={newDriverData.email} onChange={(e) => setNewDriverData({...newDriverData, email: e.target.value})} required />
              <input type="tel" placeholder="Phone Number" className="input-field" value={newDriverData.phone} onChange={(e) => setNewDriverData({...newDriverData, phone: e.target.value})} required />
              <input type="text" placeholder="License Number" className="input-field" value={newDriverData.licenseNumber} onChange={(e) => setNewDriverData({...newDriverData, licenseNumber: e.target.value})} required />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <select className="input-field" value={newDriverData.vehicleType} onChange={(e) => setNewDriverData({...newDriverData, vehicleType: e.target.value})} required>
                  <option value="Sedan">Sedan</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="SUV">SUV</option>
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
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
              <Button variant="outline" onClick={() => setSelectedEmployeeForDetails(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {/* ========== COLLECT CASH MODAL ========== */}
      {showCollectCashModal && selectedLedgerDriver && (
        <div className="modal-overlay" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', position: 'fixed', inset: 0, zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
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

      {/* ========== PAYMENT RECEIVED & WATERMARKED PDF BILL MODAL ========== */}
      {showPaymentReceivedModal && paidReceiptDetails && (
        <div className="modal-overlay" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(5px)', position: 'fixed', inset: 0, zIndex: 1150, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '680px', padding: '24px', borderRadius: '24px', background: 'var(--bg-card)', border: '1.5px solid #10b981', display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '92vh', overflowY: 'auto' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', padding: '6px 12px', borderRadius: '10px', fontSize: '13px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={16} /> PAYMENT RECEIVED & VERIFIED
                </div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800' }}>Official Watermarked PDF Bill Receipt</h3>
              </div>
              <button onClick={() => setShowPaymentReceivedModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            {/* Receipt Details & Canvas Image Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: '20px', alignItems: 'center' }}>
              {/* Left Column: Driver Info & Financial Breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '11px', color: '#10b981', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Receipt ID: {paidReceiptDetails.receiptId}
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Driver Partner Name</span>
                  <strong style={{ fontSize: '15px', color: 'var(--text-main)' }}>{paidReceiptDetails.driver.name}</strong>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Mobile Number</span>
                  <span style={{ fontSize: '13px', color: 'var(--text-main)', fontWeight: '600' }}>{paidReceiptDetails.driver.phone}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Vehicle Model & License Plate</span>
                  <span style={{ fontSize: '13px', color: '#10b981', fontWeight: '700', fontFamily: 'monospace' }}>
                    {paidReceiptDetails.driver.manufacturer || ''} {paidReceiptDetails.driver.model || ''} ({paidReceiptDetails.driver.plate || 'N/A'})
                  </span>
                </div>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Payment Received</span>
                  <strong style={{ fontSize: '22px', color: '#10b981' }}>₹{parseFloat(paidReceiptDetails.amountPaid).toFixed(2)}</strong>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Remaining Dues Balance</span>
                  <strong style={{ fontSize: '13px', color: parseFloat(paidReceiptDetails.remainingBalance) > 0 ? '#ef4444' : '#10b981' }}>
                    {parseFloat(paidReceiptDetails.remainingBalance) > 0 ? `₹${parseFloat(paidReceiptDetails.remainingBalance).toFixed(2)}` : '✓ ZERO BALANCE (FULL SETTLEMENT)'}
                  </strong>
                </div>
              </div>

              {/* Right Column: Watermarked Receipt Image Preview */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', alignSelf: 'flex-start' }}>
                  📄 Watermarked Bill & PAID Seal Preview
                </div>
                {paidReceiptImageSrc ? (
                  <img 
                    src={paidReceiptImageSrc} 
                    alt="Watermarked Paid Receipt" 
                    style={{ 
                      width: '100%', 
                      maxWidth: '290px', 
                      borderRadius: '12px', 
                      border: '1.5px solid #10b981',
                      boxShadow: '0 8px 24px rgba(16,185,129,0.2)' 
                    }} 
                  />
                ) : (
                  <div style={{ width: '100%', height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.01)', border: '1px dashed var(--border)', borderRadius: '12px', color: 'var(--text-muted)' }}>
                    Generating PDF Receipt...
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons: Print PDF & Share to Driver via WhatsApp */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
              <button
                type="button"
                onClick={() => handlePrintPDFReceipt(paidReceiptDetails)}
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px',
                  fontSize: '13px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                📄 Download / Print PDF Bill
              </button>

              <button
                type="button"
                onClick={handleSharePaidReceiptWhatsApp}
                style={{
                  flex: 1,
                  background: '#25D366',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px',
                  fontSize: '13px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(37,211,102,0.25)'
                }}
              >
                💬 Share Receipt to Driver via WhatsApp
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
