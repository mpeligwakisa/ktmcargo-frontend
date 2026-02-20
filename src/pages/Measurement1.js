import React, { useEffect, useState } from "react";
import { useMeasurementStore } from "../store/useMeasurementStore";

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
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Measurements</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-6 space-x-2">
        <input
          type="text"
          placeholder="Measurement Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border px-2 py-1 rounded"
          required
        />
        <input
          type="text"
          placeholder="Unit (e.g., kg, CBM)"
          value={form.unit}
          onChange={(e) => setForm({ ...form, unit: e.target.value })}
          className="border px-2 py-1 rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          {editingId ? "Update" : "Add"}
        </button>
      </form>

      {/* Table */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-3 py-2">ID</th>
              <th className="border px-3 py-2">Name</th>
              <th className="border px-3 py-2">Unit</th>
              <th className="border px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(measurements) && measurements.length > 0 ?(
              measurements.map((m) => (
              <tr key={m.id}>
                <td className="border px-3 py-2">{m.id}</td>
                <td className="border px-3 py-2">{m.name}</td>
                <td className="border px-3 py-2">{m.unit}</td>
                <td className="border px-3 py-2 space-x-2">
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                    onClick={() => handleEdit(m)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => deleteMeasurement(m.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))):
            //measurements.length === 0 &&
             (
              <tr>
                <td colSpan="4" className="text-center py-3">
                  No measurements found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Measurements;
