import React from 'react';
import { useFinancials } from '../../hooks/admin/useAdminData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, TrendingUp, Users, DollarSign } from 'lucide-react';

const AnalyticsDashboard = () => {
  const { data: financials, isLoading } = useFinancials();

  if (isLoading) {
    return <div style={{ padding: '20px', color: 'var(--text-muted)' }}>Loading analytics...</div>;
  }

  const stats = financials || { totalRevenue: 0, totalRides: 0, activeDriversCount: 0, chartData: [] };

  return (
    <div className="tab-pane" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2>Analytics & Performance</h2>
        <p className="tab-subtitle">Real-time overview of platform revenue and activity.</p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        <div className="admin-stat-card glass-card">
          <div className="stat-header">
            <span className="stat-title">Total Revenue</span>
            <DollarSign size={20} color="var(--primary)" />
          </div>
          <div className="stat-value">₹{stats.totalRevenue.toFixed(2)}</div>
          <div className="stat-trend" style={{ color: '#10b981' }}>
            <TrendingUp size={14} /> Lifetime Gross
          </div>
        </div>

        <div className="admin-stat-card glass-card">
          <div className="stat-header">
            <span className="stat-title">Completed Rides</span>
            <Activity size={20} color="#3b82f6" />
          </div>
          <div className="stat-value">{stats.totalRides}</div>
          <div className="stat-trend" style={{ color: '#3b82f6' }}>
            Lifetime Total
          </div>
        </div>

        <div className="admin-stat-card glass-card">
          <div className="stat-header">
            <span className="stat-title">Active Drivers</span>
            <Users size={20} color="#8b5cf6" />
          </div>
          <div className="stat-value">{stats.activeDriversCount}</div>
          <div className="stat-trend" style={{ color: '#8b5cf6' }}>
            Currently Online
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="glass-card" style={{ padding: '24px', marginTop: '10px' }}>
        <h3 style={{ marginBottom: '20px', fontSize: '16px' }}>Revenue Overview (Mocked 7-Days)</h3>
        <div style={{ width: '100%', height: '350px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={stats.chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#151c2c', border: '1px solid var(--border)', borderRadius: '8px' }}
                itemStyle={{ color: 'var(--text-main)' }}
              />
              <Area type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
