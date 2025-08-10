import React, { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './UserManagement.css';
import { useUserManagement } from '../store/useUserManagement';

const availablePermissions = [
  'Account Create', 'Account Delete', 'Account Edit', 'Account View',
  'Activities View',
  'Agreement Create', 'Agreement Delete', 'Agreement Edit', 'Agreement View'
];

const availableStations = [
  'Head Office', 'Location', 'Market Center', 'Warehouse', 'Buying Line'
];

const UserManagement = () => {
  const {
    formData,
    users,
    roles,
    status,
    locations,
    isLoading,
    setFormData,
    fetchUsers,
    fetchFormOptions,
    handleChange,
    submitUser,
    resetForm
  } = useUserManagement();

  useEffect(() => {
    fetchUsers();
    fetchFormOptions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitUser();
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
          <input name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} />
          <input name="middleName" placeholder="Middle Name" value={formData.middleName} onChange={handleChange} />
          <input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} />
        </div>

        <div className="form-row">
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <input name="staffNumber" placeholder="Staff #" value={formData.staffNumber} onChange={handleChange} />

          <select name="status_id" value={formData.status_id} onChange={handleChange}>
            <option value="">Select Status</option>
            {status.map(status =>(
              <option key={status.id} value={status.id}>{status.description}</option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <select name="roles_id" value={formData.role_id} onChange={handleChange}>
            <option value="">Select Role</option>
            {roles.map(role => (
              <option key={role.id} value={role.id}>{role.name}</option>
            ))}
          </select>
          <input name="mobile" placeholder="Mobile" value={formData.mobile} onChange={handleChange} />
          <input name="personalCode" placeholder="Personal Code" value={formData.personalCode} onChange={handleChange} />
        </div>

         {/* Location */}
        <div className="form-row">
          <select name="location_id" value={formData.location_id} onChange={handleChange}>
            <option value="">Select Location</option>
            {locations.map(loc => (
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
          <button type="submit">Save</button>
          <button type="button" onClick={resetForm}>Clear</button>
        </div>
      </form>

      {/* Users Table */}
      <table className="users-table">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Staff #</th>
            <th>Email</th>
            <th>Role</th>
            <th>Location</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.firstName} {u.middleName} {u.lastName}</td>
              <td>{u.staffNumber}</td>
              <td>{u.email}</td>
              <td>{u.groupName}</td>
              <td>{u.location?.name}</td>
              <td>{u.status?.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
