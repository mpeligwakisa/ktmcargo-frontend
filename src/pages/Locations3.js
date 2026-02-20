import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, MapPin, Code, FileText } from 'lucide-react';
import { useLocationStore } from '../store/useLocationStore';
import './Locations.css';

// Location Form Component
const LocationForm2 = ({ location, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: location?.name || '',
    code: location?.code || '',
    description: location?.description || '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Location name is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{location ? 'Edit Location' : 'Add New Location'}</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              setIsModalOpen(false);
            }}
            className="modal-close-btn"
          >
            <X className="h-4 w-4" />
           </Button>
        </div>
        
        <div className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">
              <MapPin size={16} />
              Location Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
              placeholder="Enter location name"
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="code">
              <Code size={16} />
              Location Code
            </label>
            <input
              type="text"
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="Enter location code (optional)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">
              <FileText size={16} />
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Enter location description (optional)"
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" >
              {locations ? 'Update Location' : 'Create Location'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Locations Component
const Locations3 = () => {
  const {
    locations,
    loading,
    error,
    fetchLocations,
    addLocation,
    updateLocation,
    deleteLocation,
    clearError
  } = useLocationStore();

  const [showForm, setShowForm] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  const handleAddLocation = async (formData) => {
    const success = await addLocation(formData);
    if (success) setShowForm(false);
  };

  const handleUpdateLocation = async (formData) => {
    const success = await updateLocation(editingLocation.id, formData);
    if (success) {
      setEditingLocation(null);
      setShowForm(false);
    }
  };

  const handleDeleteLocation = async (id) => {
    const success = await deleteLocation(id);
    if (success) setDeleteConfirm(null);
  };

  const openEditForm = (location) => {
    setEditingLocation(location);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingLocation(null);
  };

  return (
    <div className="locations-container">
      <div className="header">
        <h1>Locations Management</h1>
        <p>Manage your organization's locations efficiently</p>
      </div>

      <div className="content-wrapper">
        {error && (
          <div className="error">
            {error}
            <button 
              onClick={clearError} 
              style={{ marginLeft: '1rem', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}
            >
              ×
            </button>
          </div>
        )}

        <div className="actions-bar">
          <div className="locations-count">
            {locations.length} location{locations.length !== 1 ? 's' : ''} total
          </div>
          <button 
            onClick={() => setShowForm(true)} 
            className="btn btn-primary"
            disabled={loading}
          >
            <Plus size={20} />
            Add New Location
          </button>
        </div>

        {loading && (
          <div className="loading">
            <div>Loading locations...</div>
          </div>
        )}

        {!loading && Array.isArray(locations) && locations.length === 0 && (
          <div className="empty-state">
            <MapPin size={48} style={{ margin: '0 auto 1rem', opacity: 0.6 }} />
            <h3>No locations yet</h3>
            <p>Get started by adding your first location</p>
            <button onClick={() => setShowForm(true)} className="btn btn-primary">
              <Plus size={20} />
              Add First Location
            </button>
          </div>
        )}
        {!loading && Array.isArray(locations) &&locations.length > 0 && (
          <div className="locations-grid">
            {locations.map((loc) => (
              <div key={loc.id} className="location-card">
                <div className="location-header">
                  <div className="location-title">
                    <div className="location-name">
                      <MapPin size={20} />
                      {loc.name}
                    </div>
                    {loc.code &&
                      <div className="location-code">{loc.code}</div>
                    }
                  </div>
                  <div className="location-actions">
                    <button
                      onClick={() => openEditForm(loc)}
                      className="btn btn-edit"
                      title="Edit location"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(loc)}
                      className="btn btn-delete"
                      title="Delete location"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                {loc.description && (
                  <div className="location-description">
                    {loc.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && 
        <LocationForm
          location={editingLocation}
          onSubmit={editingLocation ? handleUpdateLocation : handleAddLocation}
          onCancel={closeForm}
        />
      }

      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="confirm-dialog">
            <h3>Delete Location</h3>
            <p>Are you sure you want to delete "{deleteConfirm.name}"? This action cannot be undone.</p>
            <div className="confirm-actions">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteLocation(deleteConfirm.id)}
                className="btn btn-confirm"
                disabled={loading}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Locations3;