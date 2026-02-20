import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './UserManagement.css';
import { useUserManagement } from '../store/useUserManagement';
import Locations from './Locations3';

// const availablePermissions = [
//   'Account Create', 'Account Delete', 'Account Edit', 'Account View',
//   'Activities View',
//   'Agreement Create', 'Agreement Delete', 'Agreement Edit', 'Agreement View'
// ];

// const availableStations = [
//   'Head Office', 'Location', 'Market Center', 'Warehouse', 'Buying Line'
// ];

const UserManagement = () => {
  const {
    users,
    role,
    status,
    location,
    isLoading,
    fetchUsers,
    fetchFormOptions,
    //handleChange,
    //resetForm,
    addUser,
    updateUser,
    deleteUser,
    //editUser,
    editingUser
  } = useUserManagement();
  const [isEditingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    gender: "",
    email: "",
    phone: "",
    role_id: "",
    location_id: "",
    status_id: "",
    password: "",
    confirmPassword: "",
    photo: null,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchUsers();
    fetchFormOptions();
  }, [fetchUsers, fetchFormOptions]);

  const resetForm = () => {
    setFormData({
      first_name: "",
      middle_name: "",
      last_name: "",
      gender: "",
      email: "",
      phone: "",
      role_id: "",
      location_id: "",
      status_id: "",
      password: "",
      confirmPassword: "",
      photo: null,
    });
    setEditingId(null);
    setErrors({});
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    let success = false;

    const payload = {...formData};

    if (isEditingId) {
      success = await updateUser(isEditingId, payload);
      if (success) toast.success("User updated successfully");
    } else {
      success = await addUser(payload);
      if (success) toast.success("User added successfully");
    }

    if (success) {
      await fetchUsers();
      resetForm();
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };
  

  // === Edit Handler ===
  const handleEdit = (user) => {
    setEditingId(user.id);
    setFormData({
      ...formData,
      ...user,
      first_name: user.people?.first_name || "",
      middle_name: user.people?.middle_name || "",
      last_name: user.people?.last_name || "",
      gender: user.people?.gender || "",
      email: user.email || "",
      phone: user.phone || "",
      role_id: user.role?.id || "",
      location_id: user.location?.id || "",
      status_id: user.status?.id || "",
      password:"",
      confirmPassword: "",
      photo: null,
    });
    //setIsModalOpen(true);
  };

  // === Delete Handler ===
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    const success = await deleteUser(id);
    if (success) {
      toast.success("User deleted successfully");
      fetchUsers();
    }
  };

  return (
    <div className="user-management-container">
      <ToastContainer />
      <h2>User Management</h2>
      <form onSubmit={handleSubmit} className="user-form">

        <div className="photo-upload">
          {formData.photo ? (
            <img
              src={URL.createObjectURL(formData.photo)}
              alt="Preview"
              className="avatar-preview"
            />
          ) : (
            <div className="avatar-placeholder">Photo</div>
          )}
          <input type="file" name="photo" accept="image/*" onChange={handleChange} />
        </div>

        <div className="form-row">
          <input name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} />
          <input name="middle_name" placeholder="Middle Name" value={formData.middle_name} onChange={handleChange} />
          <input name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} />
        </div>

        <div className="form-row">
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          {/* <input name="staffNumber" placeholder="Staff #" value={formData.staffNumber} onChange={handleChange} /> */}

          <select name="status_id" value={formData.status_id} onChange={handleChange}>
            <option value="">Select Status</option>
            {status.map(s =>(
              <option key={s.id} value={s.id}>{s.description}</option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <select name="role_id" value={formData.role_id} onChange={handleChange}>
            <option value="">Select Role</option>
            {role.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
          <input name="phone" placeholder="Mobile" value={formData.phone} onChange={handleChange} />
          {/* <input name="personalCode" placeholder="Personal Code" value={formData.personalCode} onChange={handleChange} /> */}
        </div>

         {/* Location */}
        <div className="form-row">
          <select name="location_id" value={formData.location_id} onChange={handleChange}>
            <option value="">Select Location</option>
            {Array.isArray(location) && location.map(loc => (
              <option key={loc.id} value={loc.id}>{loc.name}</option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <input name="email" placeholder="Email/Username" value={formData.email} onChange={handleChange} />
          <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} />
          <input name="confirmPassword" type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} />
        </div>

        {/* <div className="form-group">
          <label>Permissions:</label>
          <div className="permissions">
            {availablePermissions.map(p => (
              <label key={p}>
                <input
                  type="checkbox"
                  name="permissions"
                  value={p}
                  checked={formData.permissions.includes(p)}
                  onChange={handleChange}
                />
                {p}
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Working Stations:</label>
          <div className="stations">
            {availableStations.map(s => (
              <label key={s}>
                <input
                  type="checkbox"
                  name="stations"
                  value={s}
                  checked={formData.stations.includes(s)}
                  onChange={handleChange}
                />
                {s}
              </label>
            ))}
          </div>
        </div> */}

        <div className="form-buttons">
          <button type="submit">
            {handleEdit ? 'Update':'Save'}
            </button>
          <button type="button" onClick={resetForm}>Clear</button>
        </div>
      </form>

      {/* Users Table */}
      <table className="users-table">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Location</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {(users || []).map(u => (
            <tr key={u.id}>
              <td>{u.people?.first_name}{""} {u.people?.middle_name || ''}{""} {u.people?.last_name}</td>
              <td>{u.email}</td>
              <td>{u.role?.name || "N/A"}</td>
              <td>{u.location?.name || "N/A"}</td>
              <td>{u.status?.description || "N/A"}</td>
              <td>
                <button 
                  className="btn-edit"
                  onClick={() => handleEdit(u)
                }
                >
                  Edit
                </button>
                <button
                  className = "btn-delete"
                  onClick={() => deleteUser(u.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
