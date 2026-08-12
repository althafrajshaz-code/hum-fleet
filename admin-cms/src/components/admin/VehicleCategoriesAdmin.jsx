import React from 'react';
import Button from '../Button';

const VehicleCategoriesAdmin = ({
  categories,
  catName, setCatName,
  catPassengers, setCatPassengers,
  catBaseFare, setCatBaseFare,
  catRatePerKm, setCatRatePerKm,
  editingCategory,
  handleStartEdit,
  handleCancelEdit,
  handleDeleteCategory,
  handleAddCategory
}) => {
  return (
    <div className="tab-pane" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
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
                  <tr key={cat.id || cat._id} style={{ borderBottom: '1px solid var(--border)' }} className="table-row-hover">
                    <td style={{ padding: '12px 16px', fontWeight: '600' }}>{cat.name}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-main)' }}>{cat.maxPassengers} Passengers</td>
                    <td style={{ padding: '12px 16px', fontWeight: '600', color: 'var(--primary)' }}>₹{parseFloat(cat.baseFare).toFixed(2)}</td>
                    <td style={{ padding: '12px 16px', fontWeight: '600', color: 'var(--primary)' }}>₹{parseFloat(cat.ratePerKm).toFixed(2)}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <button 
                        onClick={() => handleStartEdit(cat)}
                        style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '12px', fontWeight: '700', marginRight: '10px' }}
                        type="button"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteCategory(cat.id || cat._id)}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '12px', fontWeight: '700' }}
                        type="button"
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
  );
};

export default VehicleCategoriesAdmin;
