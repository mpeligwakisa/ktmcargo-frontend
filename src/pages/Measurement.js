import React, { useEffect, useState } from "react";
import { useMeasurementStore } from "../store/useMeasurementStore";
import "./Measurement.css";

const Measurements = () => {
  const {
    measurements,
    fetchMeasurements,
    addMeasurement,
    updateMeasurement,
    deleteMeasurement,
    loading,
  } = useMeasurementStore();

  const [form, setForm] = useState({ name: "", unit: "" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchMeasurements();
  }, [fetchMeasurements]);

  console.log("measurement from store:", measurements);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateMeasurement(editingId, form);
      setEditingId(null);
    } else {
      addMeasurement(form);
    }
    setForm({ name: "", unit: "" });
  };

  const handleEdit = (measurement) => {
    setEditingId(measurement.id);
    setForm({ name: measurement.name, unit: measurement.unit });
  };

  return (
    <div className="measurements-page-container">
      <div className="page-header">
        <h2>Measurements</h2>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Measurement Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Unit (e.g., kg, CBM)"
          value={form.unit}
          onChange={(e) => setForm({ ...form, unit: e.target.value })}
        />
        <button type="submit">
          {editingId ? "Update" : "Add"}
        </button>
      </form>

      {/* Table */}
      {loading ? (
        <p className="loading-state">Loading...</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Unit</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(measurements) && measurements.length > 0 ? (
                measurements.map((m) => (
                  <tr key={m.id}>
                    <td>{m.id}</td>
                    <td>{m.name}</td>
                    <td>{m.unit}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(m)}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => deleteMeasurement(m.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No measurements found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Measurements;