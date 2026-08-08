import React from 'react';
import { MapPin, Navigation, Car, Users, Search, Compass, MessageSquare, Radio } from 'lucide-react';
import Button from '../Button';

const FleetMonitor = ({
  fleetEntity,
  setFleetEntity,
  fleetData,
  fleetSearch,
  setFleetSearch,
  fleetFilter,
  setFleetFilter,
  setSelectedMapDriver,
  setMessageModalDriver,
  fetchChatMessages
}) => {
  return (
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
              String(d.name || '').toLowerCase().includes(fleetSearch.toLowerCase()) ||
              String(d.phone || '').includes(fleetSearch) ||
              String(d.email || '').toLowerCase().includes(fleetSearch.toLowerCase()) ||
              (d.plate && String(d.plate).toLowerCase().replace(/\s+/g, '').includes(fleetSearch.toLowerCase().replace(/\s+/g, ''))) ||
              (d.manufacturer && String(d.manufacturer).toLowerCase().includes(fleetSearch.toLowerCase())) ||
              (d.model && String(d.model).toLowerCase().includes(fleetSearch.toLowerCase()))
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
                .filter(p => String(p.name || '').toLowerCase().includes(fleetSearch.toLowerCase()) || String(p.email || '').toLowerCase().includes(fleetSearch.toLowerCase()) || String(p.phone || '').includes(fleetSearch))
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
  );
};

export default FleetMonitor;
