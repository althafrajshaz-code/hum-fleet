import React, { useState, useEffect } from 'react';
import { MapPin, Search, Plus, Trash2, Map } from 'lucide-react';

const LocationsManagement = ({ API_BASE }) => {
  const [locations, setLocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // New location form state
  const [newName, setNewName] = useState('');
  const [newLat, setNewLat] = useState('');
  const [newLng, setNewLng] = useState('');

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/locations`);
      const data = await res.json();
      setLocations(data);
    } catch (err) {
      console.error('Error fetching locations', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLocation = async (e) => {
    e.preventDefault();
    if (!newName || !newLat || !newLng) return;

    try {
      const res = await fetch(`${API_BASE}/api/locations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName, lat: parseFloat(newLat), lng: parseFloat(newLng) })
      });
      const data = await res.json();
      
      if (res.ok && !data.message) { // data.message means it already existed
        setNewName('');
        setNewLat('');
        setNewLng('');
        fetchLocations();
        alert('Location added successfully!');
      } else {
        alert(data.message || 'Failed to add location');
      }
    } catch (err) {
      console.error(err);
      alert('Network error');
    }
  };

  const handleDelete = async (name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;

    try {
      const res = await fetch(`${API_BASE}/api/locations/${encodeURIComponent(name)}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchLocations();
      } else {
        alert('Failed to delete location');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredLocations = locations.filter(loc => 
    loc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="section-content">
      <div className="section-header">
        <div className="header-title">
          <Map className="header-icon text-indigo" />
          <div>
            <h2>Locations Management</h2>
            <p>Manage dynamic search locations like Hospitals, Resorts, and Airports</p>
          </div>
        </div>
      </div>

      <div className="card mt-4 p-4">
        <h3 className="mb-4 font-semibold text-lg">Add New Location</h3>
        <form onSubmit={handleAddLocation} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input 
            type="text" 
            placeholder="Location Name (e.g. Apollo Hospital)" 
            className="input-field"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            required
          />
          <input 
            type="number" 
            step="any"
            placeholder="Latitude (e.g. 10.0543)" 
            className="input-field"
            value={newLat}
            onChange={e => setNewLat(e.target.value)}
            required
          />
          <input 
            type="number" 
            step="any"
            placeholder="Longitude (e.g. 76.2736)" 
            className="input-field"
            value={newLng}
            onChange={e => setNewLng(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary w-full flex items-center justify-center gap-2">
            <Plus size={18} /> Add Location
          </button>
        </form>
      </div>

      <div className="card mt-6">
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h3 className="font-semibold text-lg">Saved Locations ({locations.length})</h3>
          <div className="search-bar w-64">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search locations..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Location Name</th>
                <th>Latitude</th>
                <th>Longitude</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" className="text-center py-8">Loading locations...</td></tr>
              ) : filteredLocations.length === 0 ? (
                <tr><td colSpan="4" className="text-center py-8 text-gray-500">No locations found.</td></tr>
              ) : (
                filteredLocations.map((loc, idx) => (
                  <tr key={idx}>
                    <td className="font-medium flex items-center gap-2">
                      <MapPin size={16} className="text-gray-400" />
                      {loc.name}
                    </td>
                    <td className="text-sm text-gray-600">{loc.lat}</td>
                    <td className="text-sm text-gray-600">{loc.lng}</td>
                    <td>
                      <button 
                        onClick={() => handleDelete(loc.name)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        title="Delete Location"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LocationsManagement;
