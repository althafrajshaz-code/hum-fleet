import React, { useState } from 'react';
import { Search, X, Users, MapPin, Navigation, Car, Radio, Compass, MessageSquare, Edit2, Shield, Trash2, Phone, FileText, Check, DollarSign, Download, TrendingUp, AlertCircle, Calendar, RefreshCw } from 'lucide-react';
import Button from '../Button';

const Analytics = ({ activeTab, platformStats, recentTrips, analyticsFilter, setAnalyticsFilter }) => {
  const [revenueData, setRevenueData] = useState([40, 70, 50, 90, 60, 100, 80]);
  const [rideVolumeData, setRideVolumeData] = useState([30, 50, 45, 80, 55, 95, 75]);
  const [metrics, setMetrics] = useState({
    commission: 142500,
    activeDrivers: 428,
    completedTrips: 12840,
    avgRating: 4.82
  });

  const handleResetData = () => {
    setRevenueData([0, 0, 0, 0, 0, 0, 0]);
    setRideVolumeData([0, 0, 0, 0, 0, 0, 0]);
    setMetrics({
      commission: 0,
      activeDrivers: 0,
      completedTrips: 0,
      avgRating: 0
    });
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
                  <Button variant="outline" onClick={handleResetData} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', padding: '8px 12px' }}>
                    <RefreshCw size={14} /> Reset Data
                  </Button>
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
