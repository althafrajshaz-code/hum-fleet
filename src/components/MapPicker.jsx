import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin, Search } from 'lucide-react';

// Fix for default Leaflet marker icon not loading in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}

function MapController({ searchCenter }) {
  const map = useMap();
  useEffect(() => {
    if (searchCenter) {
      map.flyTo([searchCenter.lat, searchCenter.lng], 13);
    }
  }, [searchCenter, map]);
  return null;
}

export default function MapPicker({ onSelect, onCancel, defaultCenter }) {
  const center = defaultCenter || { lat: 10.8505, lng: 76.2711 }; // Default Kerala
  const [position, setPosition] = useState(center);
  const [searchCenter, setSearchCenter] = useState(null);
  const [address, setAddress] = useState('Fetching address...');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim().length > 2 && showDropdown) {
        fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=5`)
          .then(res => res.json())
          .then(data => {
            setSearchResults(data || []);
          })
          .catch(err => console.error(err));
      } else {
        setSearchResults([]);
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, showDropdown]);

  const handleSelectResult = (result) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    setSearchCenter({ lat, lng });
    setPosition({ lat, lng });
    setSearchQuery(result.display_name.replace(/, India$/i, ''));
    setShowDropdown(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`);
      const data = await res.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        setSearchCenter({ lat, lng });
        setPosition({ lat, lng });
        setShowDropdown(false);
      } else {
        alert("Location not found on map. Try a different spelling or a broader area (e.g. 'Bangalore').");
      }
    } catch (err) {
      alert("Error searching map.");
    }
    setIsSearching(false);
  };

  useEffect(() => {
    if (position) {
      setAddress('Fetching address...');
      fetch(`https://nominatim.openstreetmap.org/reverse?lat=${position.lat}&lon=${position.lng}&format=json`)
        .then(res => res.json())
        .then(data => {
          if (data && data.display_name) {
            setAddress(data.display_name.replace(/, India$/i, ''));
          } else {
            setAddress('Custom Map Location');
          }
        })
        .catch(() => setAddress('Custom Map Location'));
    }
  }, [position]);

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      padding: '20px'
    }}>
      <div style={{ flex: 1, position: 'relative', borderRadius: '12px', overflow: 'hidden' }}>
        <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker position={position} setPosition={setPosition} />
          <MapController searchCenter={searchCenter} />
        </MapContainer>
        
        {/* Search Bar Overlay */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          right: '20px',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="Search city or area to jump map..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '8px',
                border: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                fontSize: '14px',
                outline: 'none'
              }}
            />
            <button 
              type="submit"
              disabled={isSearching}
              style={{
                padding: '0 16px',
                borderRadius: '8px',
                border: 'none',
                background: '#3b82f6',
                color: 'white',
                fontWeight: 'bold',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {isSearching ? '...' : <Search size={20} />}
            </button>
          </form>

          {showDropdown && searchResults.length > 0 && (
            <div style={{
              background: 'white',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              overflow: 'hidden',
              maxHeight: '200px',
              overflowY: 'auto'
            }}>
              {searchResults.map((result, idx) => (
                <div 
                  key={idx}
                  onClick={() => handleSelectResult(result)}
                  style={{
                    padding: '12px 16px',
                    borderBottom: idx < searchResults.length - 1 ? '1px solid #f0f0f0' : 'none',
                    cursor: 'pointer',
                    fontSize: '13px',
                    color: '#333',
                    textAlign: 'left'
                  }}
                >
                  <MapPin size={14} style={{ display: 'inline', marginRight: '6px', color: '#9ca3af' }} />
                  {result.display_name.replace(/, India$/i, '')}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Instruction Overlay */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'white',
          padding: '10px 20px',
          borderRadius: '20px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          zIndex: 1000,
          fontWeight: 'bold',
          color: '#333',
          fontSize: '12px',
          whiteSpace: 'nowrap'
        }}>
          Tap anywhere to drop the pin
        </div>
      </div>

      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        marginTop: '15px',
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <MapPin size={24} color="#3b82f6" style={{ marginTop: '2px' }} />
          <div>
            <div style={{ fontSize: '12px', color: '#666', fontWeight: 'bold', textTransform: 'uppercase' }}>Selected Location</div>
            <div style={{ fontSize: '14px', color: '#111', fontWeight: '600', marginTop: '4px' }}>{address}</div>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button 
            onClick={onCancel}
            style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ccc', background: 'transparent', fontWeight: 'bold' }}
          >
            Cancel
          </button>
          <button 
            onClick={() => onSelect(address, position)}
            style={{ flex: 2, padding: '12px', borderRadius: '8px', border: 'none', background: '#3b82f6', color: 'white', fontWeight: 'bold' }}
          >
            Confirm Location
          </button>
        </div>
      </div>
    </div>
  );
}
