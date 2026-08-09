import React, { useState } from 'react';
import { Search, Car, Check, X, AlertTriangle, Eye, MessageSquare, Tag, Users } from 'lucide-react';
import Button from '../Button';

const RegisteredPartners = ({ 
  filteredApprovedDrivers, 
  approvedDriversCount, 
  registeredDriverSearch, 
  setRegisteredDriverSearch, 
  handleUnblockDriver, 
  handleBlockDriver, 
  handleReject, 
  handleDeleteDriver, 
  setSelectedDriver, 
  setMessageModalDriver, 
  fetchChatMessages,
  page = 1,
  setPage = () => {},
  totalPages = 1,
  totalItems = 0,
  setShowAddDriverModal
}) => {
  return (
    <div className="tab-pane animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2>Registered Partners ({approvedDriversCount})</h2>
          <p className="tab-subtitle" style={{ margin: 0 }}>Manage approved drivers, vehicle info, and access.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={() => setShowAddDriverModal(true)}
            style={{ background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 16px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            + Add New Partner
          </button>
          <div className="search-box" style={{ width: '320px', position: 'relative' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Search by Name, Email, Phone, Plate..." 
              value={registeredDriverSearch}
              onChange={(e) => setRegisteredDriverSearch(e.target.value)}
              className="input-field"
              style={{ padding: '10px 14px 10px 36px', width: '100%', fontSize: '13px' }}
            />
          </div>
        </div>
      </div>

      <hr className="divider" style={{ margin: '16px 0 16px 0' }} />

      {filteredApprovedDrivers.length === 0 ? (
        <p className="empty-state">No matching registered partners found.</p>
      ) : (
        <div style={{ width: '100%', overflowX: 'auto', paddingBottom: '16px' }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            maxHeight: 'calc(100vh - 260px)',
            overflowY: 'auto',
            paddingRight: '8px',
            minWidth: '1150px'
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
                    {d.profilePic ? <img src={d.profilePic} alt={d.name || 'Driver'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (String(d.name || '').charAt(0) || 'D')}
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: 'var(--text-main)' }}>{String(d.name || 'Unknown Driver')}</h4>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px', fontWeight: '600' }}>ID: {d.id || d._id}</div>
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
                  <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{String(d.email || '')}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>📞 {String(d.phone || '')}</span>
                </div>

                {/* Column 3: Vehicle Model & Plate Number */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>{String(d.manufacturer || '')} {String(d.model || '')}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'monospace', fontWeight: '700' }}>{String(d.plate || '')}</span>
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

          {/* Pagination Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '12px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Showing Page {page} of {totalPages} (Total: {totalItems} items)
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button 
                variant="outline" 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{ opacity: page === 1 ? 0.5 : 1, padding: '6px 12px' }}
              >
                Previous
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || totalPages === 0}
                style={{ opacity: page === totalPages || totalPages === 0 ? 0.5 : 1, padding: '6px 12px' }}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
        </div>
      )}
    </div>
  );
};

export default RegisteredPartners;
