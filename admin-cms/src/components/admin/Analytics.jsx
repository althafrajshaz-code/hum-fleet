import React, { useState, useEffect } from 'react';
import { Search, X, Users, MapPin, Navigation, Car, Radio, Compass, MessageSquare, Edit2, Shield, Trash2, Phone, FileText, Check, DollarSign, Download, TrendingUp, AlertCircle, Calendar, RefreshCw, Loader } from 'lucide-react';
import Button from '../Button';

const API_BASE_FALLBACK = (typeof window !== 'undefined' && window.location.hostname.includes('loca.lt'))
  ? 'https://hum-fleet-backend.loca.lt'
  : (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))
    ? 'http://localhost:5000'
    : 'http://187.127.165.79:5000';

const Analytics = ({ activeTab, API_BASE: propApiBase }) => {
  const API_BASE = propApiBase || API_BASE_FALLBACK;
  const [revenueData, setRevenueData] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [rideVolumeData, setRideVolumeData] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [metrics, setMetrics] = useState({
    commission: 0,
    activeDrivers: 0,
    completedTrips: 0,
    avgRating: 0
  });
  const [loading, setLoading] = useState(false);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/analytics`);
      if (res.ok) {
        const data = await res.json();
        setRevenueData(data.revenueData);
        setRideVolumeData(data.rideVolumeData);
        setMetrics(data.metrics);
      }
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'analytics') {
      fetchAnalytics();
    }
  }, [activeTab]);

  const handleRefreshData = () => {
    fetchAnalytics();
  };

  const handleResetData = async () => {
    if (!window.confirm('Are you sure you want to reset analytics? All current revenue and trip counts will be set to ₹0. This cannot be undone.')) return;
    setLoading(true);
    try {
      await fetch(`${API_BASE}/api/admin/analytics/reset`, { method: 'POST' });
      // After reset, re-fetch (will return zeros)
      await fetchAnalytics();
    } catch (err) {
      console.error('Reset failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
{/* TAB: Analytics */}
          {activeTab === 'analytics' && (
            <div className="tab-pane animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <TrendingUp size={24} color="var(--primary)" /> Business Visual Analytics
                    </h2>
                    <p className="tab-subtitle">Real-time revenue metrics, ride volume, and platform growth graphs.</p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Button variant="outline" onClick={handleResetData} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', padding: '8px 12px', color: '#ef4444', borderColor: '#ef4444' }}>
                      Reset to ₹0
                    </Button>
                    <Button variant="outline" onClick={handleRefreshData} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', padding: '8px 12px' }}>
                      <RefreshCw size={14} className={loading ? "spin" : ""} /> {loading ? 'Refreshing...' : 'Refresh Data'}
                    </Button>
                  </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
                  {/* Revenue Chart Mockup */}
                  <div className="glass-card" style={{ padding: '20px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '16px' }}>Revenue (Last 7 Days)</h3>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '180px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                      {revenueData.map((h, i) => (
                        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '100%', height: `${h}%`, background: 'linear-gradient(to top, rgba(59, 130, 246, 0.2), #3b82f6)', borderRadius: '4px 4px 0 0', position: 'relative' }}>
                            <span style={{ position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)', fontSize: '10px', color: 'var(--text-muted)' }}>₹{h === 0 ? 0 : h*120}</span>
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
                      {rideVolumeData.map((h, i) => (
                        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '100%', height: `${h}%`, background: 'linear-gradient(to top, rgba(16, 185, 129, 0.2), #10b981)', borderRadius: '4px 4px 0 0', position: 'relative' }}>
                            <span style={{ position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)', fontSize: '10px', color: 'var(--text-muted)' }}>{h === 0 ? 0 : h*2}</span>
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
                    <h3 style={{ margin: '8px 0 0 0', color: '#10b981', fontSize: '20px' }}>₹{metrics.commission.toLocaleString()}</h3>
                  </div>
                  <div className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Active Drivers</span>
                    <h3 style={{ margin: '8px 0 0 0', color: '#3b82f6', fontSize: '20px' }}>{metrics.activeDrivers.toLocaleString()}</h3>
                  </div>
                  <div className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Completed Trips</span>
                    <h3 style={{ margin: '8px 0 0 0', color: '#f59e0b', fontSize: '20px' }}>{metrics.completedTrips.toLocaleString()}</h3>
                  </div>
                  <div className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Avg Rating</span>
                    <h3 style={{ margin: '8px 0 0 0', color: '#8b5cf6', fontSize: '20px' }}>{metrics.avgRating}</h3>
                  </div>
                </div>
              </div>
            </div>
          )}

          
    </>
  );
};

export default Analytics;
