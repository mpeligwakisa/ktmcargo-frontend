import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./UserManagement.css";
import { useUserManagement } from "../store/useUserManagement";

const UserManagement = () => {
  const {
    users,
    role,
    status,
    location,
    fetchUsers,
    fetchFormOptions,
    addUser,
    updateUser,
    deleteUser,
    isLoading,
  } = useUserManagement();

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
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

  useEffect(() => {
    fetchUsers();
    fetchFormOptions();
  }, [fetchUsers, fetchFormOptions]);

  // === Handle Change ===
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  // === Handle Add ===
  const handleAdd = () => {
    setEditingUser(null);
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
    setShowModal(true);
  };

  // === Handle Edit ===
  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      first_name: user.people?.first_name || "",
      middle_name: user.people?.middle_name || "",
      last_name: user.people?.last_name || "",
      gender: user.people?.gender || "",
      email: user.email || "",
      phone: user.phone || "",
      role_id: user.role?.id || "",
      location_id: user.location?.id || "",
      status_id: user.status?.id || "",
      password: "",
      confirmPassword: "",
      photo: null,
    });
    setShowModal(true);
  };

  // === Handle Save (Add or Update) ===
  const handleSave = async (e) => {
    e.preventDefault();
    let success = false;

    if (editingUser) {
      success = await updateUser(editingUser.id, formData);
      if (success) toast.success("User updated successfully");
    } else {
      success = await addUser(formData);
      if (success) toast.success("User added successfully");
    }

    if (success) {
      await fetchUsers();
      setShowModal(false);
      setEditingUser(null);
    }
  };

  // === Handle Delete ===
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    const success = await deleteUser(id);
    if (success) {
      toast.success("User deleted successfully");
      fetchUsers();
    }
  };

  return (
    <div className="page-container">
      <ToastContainer />
      <div className="page-header">
        <h2>User Management</h2>
        <button className="btn btn-primary" onClick={handleAdd}>
          + Add User
        </button>
      </div>

      {/* Table */}
      <div className="table-container">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <table className="data-table">
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
              {Array.isArray(users) && users.length > 0 ? (
                users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      {u.people?.first_name} {u.people?.middle_name || ""}{" "}
                      {u.people?.last_name}
                    </td>
                    <td>{u.email}</td>
                    <td>{u.role?.name || "N/A"}</td>
                    <td>{u.location?.name || "N/A"}</td>
                    <td>{u.status?.description || "N/A"}</td>
                    <td>
                      <button
                        className="btn btn-edit"
                        onClick={() => handleEdit(u)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-delete"
                        onClick={() => handleDelete(u.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No users found</td>
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
              <h3>{editingUser ? "Edit User" : "Add User"}</h3>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ✖
              </button>
            </div>
            <form onSubmit={handleSave}>
              {/* Photo */}
              <div className="form-group">
                <label>Photo</label>
                <input
                  type="file"
                  name="photo"
                  accept="image/*"
                  onChange={handleChange}
                />
              </div>

              <div className="form-row">
                <input
                  name="first_name"
                  placeholder="First Name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
                <input
                  name="middle_name"
                  placeholder="Middle Name"
                  value={formData.middle_name}
                  onChange={handleChange}
                />
                <input
                  name="last_name"
                  placeholder="Last Name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row">
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                <select
                  name="status_id"
                  value={formData.status_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Status</option>
                  {status.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.description}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <select
                  name="role_id"
                  value={formData.role_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Role</option>
                  {role.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
                <input
                  name="phone"
                  placeholder="Mobile"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-row">
                <select
                  name="location_id"
                  value={formData.location_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Location</option>
                  {location.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <input
                  name="email"
                  placeholder="Email/Username"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingUser ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;