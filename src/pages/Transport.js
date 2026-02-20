import React, { useEffect, useState } from "react";
import { useTransportStore } from "../store/useTransportStore";
import "./Transport.css";

const TransportPage = () => {
  const {
    transports,
    isLoading,
    fetchTransports,
    addTransport,
    updateTransport,
    deleteTransport,
  } = useTransportStore();

  const [form, setForm] = useState({ name: "", description: "" });
  const [isEditingId, setIsEditingId] = useState(false);

  useEffect(() => {
    fetchTransports();
  }, [fetchTransports]);

  console.log("Transports from store:", transports);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditingId) {
      updateTransport(isEditingId, form);
      setIsEditingId(null);
    } else {
      addTransport(form);
    }
    setForm({ name: "", description: "" });
  };

  const handleEdit = (transport) => {
    setForm({ name: transport.name, description: transport.description });
    setIsEditingId(transport.id);
  };

  return (
    <div className="transport-page-container">
      <div className="page-header">
        <h2>Transport Management</h2>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Transport Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <button type="submit">
          {isEditingId ? "Update" : "Add"}
        </button>
      </form>

      {/* Table */}
      {isLoading ? (
        <p className="loading-state">Loading...</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(transports) && transports.length > 0 ? (
                transports.map((t, idx) => (
                  <tr key={t.id ?? `transport-${idx}`}>
                    <td>{t.id}</td>
                    <td>{t.name}</td>
                    <td>{t.description}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => handleEdit(t)}
                          className="edit-btn"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteTransport(t.id)}
                          className="delete-btn"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No transports found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TransportPage;