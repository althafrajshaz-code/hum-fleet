import React, { useEffect } from 'react';
import { useFleetLive } from '../../hooks/admin/useAdminData';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Navigation, User } from 'lucide-react';

// Fix Leaflet's default icon path issues in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icons
const driverIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3204/3204933.png',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

const passengerIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2815/2815428.png', // Just a generic user icon
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -14]
});

const LiveMap = () => {
  const { data: fleetLive, isLoading } = useFleetLive();

  if (isLoading) {
    return <div style={{ padding: '20px', color: 'var(--text-muted)' }}>Loading live fleet data...</div>;
  }

  const { drivers = [], passengers = [] } = fleetLive || {};
  const onlineDrivers = drivers.filter(d => d.isOnline && d.lat && d.lng);
  
  // Passengers usually only have lat/lng if they are active in a ride or we track their last known location
  const activePassengers = passengers.filter(p => p.lat && p.lng);

  return (
    <div className="tab-pane" style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '80vh' }}>
      <div>
        <h2>"God's Eye" Live Fleet Map</h2>
        <p className="tab-subtitle">Real-time GPS tracking of all online drivers and active passengers.</p>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '10px' }}>
        <div className="badge" style={{ margin: 0 }}>
          <div className="dot"></div> {onlineDrivers.length} Online Drivers
        </div>
      </div>

      <div style={{ flex: 1, borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)' }}>
        <MapContainer 
          center={[8.5241, 76.9366]} // Default to Trivandrum roughly
          zoom={12} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />

          {onlineDrivers.map(driver => (
            <Marker key={driver.id || driver._id} position={[driver.lat, driver.lng]} icon={driverIcon}>
              <Popup>
                <div style={{ color: '#000' }}>
                  <strong style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Navigation size={14} /> {driver.name}
                  </strong>
                  <div style={{ fontSize: '12px', marginTop: '4px' }}>
                    Phone: {driver.phone}<br/>
                    Vehicle: {driver.vehicle?.category || 'Auto'}<br/>
                    Status: {driver.currentRide ? <b style={{ color: '#3b82f6' }}>On Trip</b> : <b style={{ color: '#10b981' }}>Available</b>}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {activePassengers.map(passenger => (
            <Marker key={passenger.id || passenger._id} position={[passenger.lat, passenger.lng]} icon={passengerIcon}>
              <Popup>
                <div style={{ color: '#000' }}>
                  <strong style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <User size={14} /> {passenger.name}
                  </strong>
                  <div style={{ fontSize: '12px', marginTop: '4px' }}>
                    Phone: {passenger.phone}<br/>
                    Status: {passenger.activeRide ? <b style={{ color: '#3b82f6' }}>In Ride</b> : 'Idle'}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default LiveMap;
