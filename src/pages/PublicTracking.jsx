import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
// import { io } from "socket.io-client";
import { MapPin, Navigation, Car, ShieldCheck } from 'lucide-react';
import './Dashboard.css';

const API_BASE = 'https://server-ashen-beta.vercel.app';

const PublicTracking = () => {
  const { id } = useParams();
  const [rideData, setRideData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const socketRef = useRef(null);

  useEffect(() => {
    const fetchRide = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/rides/${id}/status`);
        if (response.ok) {
          const data = await response.json();
          setRideData(data);
        } else {
          setError('Ride not found or has been completed.');
        }
      } catch (err) {
        setError('Failed to fetch ride details.');
      } finally {
        setLoading(false);
      }
    };
    fetchRide();
  }, [id]);

  useEffect(() => {
    if (rideData && (rideData.status === 'Accepted' || rideData.status === 'En-route' || rideData.status === 'Arrived' || rideData.status === 'In Progress')) {
            // HTTP Polling
      const pollInterval = setInterval(async () => {
        try {
          const res = await fetch(`${API_BASE}/api/rides/${rideData.id}/location`);
          const data = await res.json();
          if (data && data.lat) {
            setDriverLocation({ lat: data.lat, lng: data.lng, bearing: data.bearing || 0 });
          }
        } catch (e) {}
      }, 3000);
      return () => clearInterval(pollInterval);
    }

    return () => {
      // disconnect
    };
  }, [rideData]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f8fafc', color: 'var(--text-main)', flexDirection: 'column', gap: '10px' }}>
        <div className="spinner" style={{ width: '40px', height: '40px', border: '3px solid rgba(59, 130, 246, 0.3)', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <h3 style={{ margin: 0 }}>Locating Ride...</h3>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error || !rideData) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f8fafc', color: '#ef4444', flexDirection: 'column', gap: '10px' }}>
        <h3 style={{ margin: 0 }}>{error}</h3>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#f8fafc' }}>
      
      {/* Header Banner */}
      <div style={{ padding: '20px', background: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: '#3b82f6', color: 'white', padding: '10px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Car size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>Live Ride Tracking</h2>
            <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>
              Tracking {rideData.passengerName}'s ride with HUM Fleet
            </p>
          </div>
          <ShieldCheck size={28} color="#10b981" />
        </div>

        <div style={{ marginTop: '20px', background: '#f1f5f9', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <MapPin size={20} color="#10b981" style={{ marginTop: '2px' }} />
            <div>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Pickup</p>
              <p style={{ margin: 0, fontSize: '14px', color: '#1e293b', fontWeight: '500' }}>{rideData.pickup.split(',')[0]}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <Navigation size={20} color="#ef4444" style={{ marginTop: '2px' }} />
            <div>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Drop-off</p>
              <p style={{ margin: 0, fontSize: '14px', color: '#1e293b', fontWeight: '500' }}>{rideData.dropoff.split(',')[0]}</p>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: '12px', color: '#3b82f6', fontWeight: 'bold' }}>Driver</p>
            <p style={{ margin: 0, fontSize: '15px', color: '#1e293b', fontWeight: '600' }}>{rideData.driverName || 'HUM Partner'}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, fontSize: '12px', color: '#3b82f6', fontWeight: 'bold' }}>Vehicle</p>
            <p style={{ margin: 0, fontSize: '14px', color: '#1e293b', fontWeight: '600' }}>{rideData.vehicleModel || 'Car'} ({rideData.vehiclePlate || 'N/A'})</p>
          </div>
        </div>
      </div>

      {/* Live Map */}
      <div style={{ flex: 1, position: 'relative' }}>
        <iframe
          id="map-iframe"
          src={`/map.html?pickup=${encodeURIComponent(rideData.pickup)}&dropoff=${encodeURIComponent(rideData.dropoff)}`}
          style={{ width: '100%', height: '100%', border: 'none' }}
          title="Live Map Tracking"
        />
        <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '8px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', backdropFilter: 'blur(4px)' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 8px #10b981' }} />
          LIVE GPS ACTIVE
        </div>
      </div>

    </div>
  );
};

export default PublicTracking;
