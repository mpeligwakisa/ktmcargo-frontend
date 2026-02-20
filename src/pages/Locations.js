import React, { useEffect, useState } from 'react';
import { useLocationStore } from '../store/useLocationStore';
import { toast } from 'react-toastify';
import './Locations.css';

const Locations = () => {
  const {
    locations,
    fetchLocations,
    addLocation,
    updateLocation,
    deleteLocation,
    loading,
    error,
  } = useLocationStore();

  const [showModal, setShowModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [formData, setFormData] = useState({ name: '', code: '', description: '' });

  // Fetch data on mount
  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  console.log("Locations from store:", locations);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Open modal for add
  const handleAdd = () => {
    setEditingLocation(null);
    setFormData({ name: '', code: '', description: '' });
    setShowModal(true);
  };

  // Open modal for edit
  const handleEdit = (location) => {
    setEditingLocation(location);
    setFormData({
      name: location.name || '',
      code: location.code || '',
      description: location.description || '',
    });
    setShowModal(true);
  };

  // Save data (create or update)
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingLocation) {
        await updateLocation(editingLocation.id, formData);
      } else {
        await addLocation(formData);
      }

      setFormData({ name: '', code: '', description: '' });
      setEditingLocation(null);
      setShowModal(false);
    } catch {
      toast.error('Failed to save location');
    }
  };

  // Delete location
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this location?')) {
      try {
        await deleteLocation(id);
        toast.success('Location deleted successfully');
      } catch {
        toast.error('Failed to delete location');
      }
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Locations</h2>
        <button className="btn btn-primary" onClick={handleAdd}>
          + Add Location
        </button>
      </div>

      {/* Error */}
      {error && <p className="error-text">{error}</p>}

      {/* Table */}
      <div className="table-container">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Code</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(locations) && locations.length > 0 ? (
                locations.map((loc) => (
                  <tr key={loc.id}>
                    <td>{loc.name}</td>
                    <td>{loc.code}</td>
                    <td>{loc.description}</td>
                    <td>
                      <button className="btn btn-edit" onClick={() => handleEdit(loc)}>
                        Edit
                      </button>
                      <button className="btn btn-delete" onClick={() => handleDelete(loc.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No locations found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editingLocation ? 'Edit Location' : 'Add Location'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                ✖
              </button>
            </div>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Code</label>
                <input type="text" name="code" value={formData.code} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingLocation ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Locations;
