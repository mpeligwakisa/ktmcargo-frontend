import React, { useState, useEffect } from 'react';
import { useUserStore } from '../store/userStore';
import axios from 'axios';
import { toast } from 'react-toastify';
import './UserModal.css';

const API = 'http://127.0.0.1:8000/api/v1';

const defaultPermissions = {
  clients: { create: false, read: true, update: false, delete: false },
  cargo: { create: false, read: true, update: false, delete: false },
  users: { create: false, read: true, update: false, delete: false },
};

export default function UserModal({ user, onClose }) {
  const isEdit = !!user;
  const { fetchUsers, locations } = useUserStore();

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: '',
    mobile: '',
    role: '',
    location_id: '',
    status: 'active',
    permissions: defaultPermissions,
    photo: null,
  });

  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    if (isEdit) {
      const {
        first_name, last_name, email, mobile, role, location_id, status, permissions
      } = user;
      setForm(prev => ({
        ...prev,
        first_name,
        last_name,
        email,
        mobile,
        role,
        location_id,
        status,
        permissions: permissions || defaultPermissions,
      }));
      if (user.photo_url) {
        setPhotoPreview(user.photo_url);
      }
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePermissionChange = (module, action) => {
    setForm(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [module]: {
          ...prev.permissions[module],
          [action]: !prev.permissions[module][action],
        },
      },
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm(prev => ({ ...prev, photo: file }));
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEdit && form.password !== form.confirm_password) {
      toast.error("Passwords do not match");
      return;
    }

    const formData = new FormData();
    for (const key in form) {
      if (key === 'permissions') {
        formData.append('permissions', JSON.stringify(form.permissions));
      } else if (key === 'photo' && form.photo) {
        formData.append('photo', form.photo);
      } else {
        formData.append(key, form[key]);
      }
    }

    try {
      if (isEdit) {
        await axios.post(`${API}/users/${user.id}?_method=PUT`, formData);
        toast.success("User updated");
      } else {
        await axios.post(`${API}/users`, formData);
        toast.success("User added");
      }
      fetchUsers();
      onClose();
    } catch (err) {
      toast.error("Failed to save user");
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="user-modal">
        <h3>{isEdit ? 'Edit User' : 'Add User'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <input type="text" name="first_name" value={form.first_name} onChange={handleChange} placeholder="First Name" required />
            <input type="text" name="last_name" value={form.last_name} onChange={handleChange} placeholder="Last Name" required />
          </div>

          <div className="form-row">
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
            <input type="text" name="mobile" value={form.mobile} onChange={handleChange} placeholder="Mobile Number" />
          </div>

          {!isEdit && (
            <div className="form-row">
              <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password" required />
              <input type="password" name="confirm_password" value={form.confirm_password} onChange={handleChange} placeholder="Confirm Password" required />
            </div>
          )}

          <div className="form-row">
            <select name="role" value={form.role} onChange={handleChange} required>
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="employee">Employee</option>
            </select>

            <select name="location_id" value={form.location_id} onChange={handleChange} required>
              <option value="">Select Location</option>
              {locations.map(loc => (
                <option key={loc.id} value={loc.id}>{loc.name}</option>
              ))}
            </select>

            <select name="status" value={form.status} onChange={handleChange}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="form-photo">
            <label>Profile Photo:</label>
            <input type="file" accept="image/*" onChange={handlePhotoChange} />
            {photoPreview && <img src={photoPreview} alt="Preview" className="photo-preview" />}
          </div>

          <div className="permissions-section">
            <h4>Permissions:</h4>
            {Object.keys(defaultPermissions).map(module => (
              <div key={module} className="permission-row">
                <strong>{module.toUpperCase()}</strong>
                {['create', 'read', 'update', 'delete'].map(action => (
                  <label key={action}>
                    <input
                      type="checkbox"
                      checked={form.permissions[module]?.[action] || false}
                      onChange={() => handlePermissionChange(module, action)}
                    />
                    {action}
                  </label>
                ))}
              </div>
            ))}
          </div>

          <div className="form-actions">
            <button type="submit">{isEdit ? 'Update' : 'Create'}</button>
            <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
