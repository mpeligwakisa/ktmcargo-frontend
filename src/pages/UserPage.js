import React, { useEffect, useState } from 'react';
import { useUserStore } from '../store/userStore';
import { CSVLink } from 'react-csv';
import UserModal from '../components/layout/UserModal';
//import './UsersPage.css'; // styling

export default function UsersPage() {
  const {
    users, 
    locations, 
    filters, 
    fetchUsers, 
    fetchLocations, 
    deleteUser
  } = useUserStore();

  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchLocations();
  }, [filters]);

  const handleSort = (field) => {
    const order = filters.sort_by === field && filters.sort_order === 'asc' ? 'desc' : 'asc';
    useUserStore.setState({ filters: { ...filters, sort_by: field, sort_order: order } });
  };

  return (
    <div className="users-page">
      <div className="header">
        <h2>Users</h2>
        <div className="controls">
          <input
            placeholder="Search..."
            onChange={e => useUserStore.setState({ filters: { ...filters, search: e.target.value } })}
          />
          <select
            value={filters.location_id}
            onChange={e => useUserStore.setState({ filters: { ...filters, location_id: e.target.value } })}
          >
            <option value="">All Locations</option>
            {locations.map(loc => (
              <option key={loc.id} value={loc.id}>{loc.name}</option>
            ))}
          </select>
          <button onClick={() => setShowModal(true)}>Add User</button>
          <CSVLink
            data={users}
            headers={[
              { label: 'Name', key: 'name' },
              { label: 'Email', key: 'email' },
              { label: 'Role', key: 'role' },
              { label: 'Location', key: 'location.name' },
              { label: 'Status', key: 'status' },
            ]}
            filename="users.csv"
            className="export-btn"
          >
            Export CSV
          </CSVLink>
        </div>
      </div>

      <table className="users-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('name')}>Name</th>
            <th onClick={() => handleSort('email')}>Email</th>
            <th>Role</th>
            <th>Location</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.location?.name}</td>
              <td>{u.status === 'active' ? '✅' : '❌'}</td>
              <td>
                <button onClick={() => { setEditUser(u); setShowModal(true); }}>Edit</button>
                <button onClick={() => deleteUser(u.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <UserModal
          onClose={() => { setEditUser(null); setShowModal(false); }}
          user={editUser}
        />
      )}
    </div>
  );
}
