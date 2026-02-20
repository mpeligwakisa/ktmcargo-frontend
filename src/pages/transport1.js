import React, { useEffect, useState } from "react";
import { useTransportStore } from "../store/useTransportStore";

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
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Transport Management</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-4 space-x-2">
        <input
          type="text"
          placeholder="Transport Name"
          className="border p-2 rounded"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Description"
          className="border p-2 rounded"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-3 py-2 rounded"
        >
          {isEditingId ? "Update" : "Add"}
        </button>
      </form>

      {/* Table */}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(transports) && transports.length > 0 ?(
              transports.map((t, idx) => (
              <tr key={t.id ?? `transport-${idx}`}>
                <td className="border p-2">{t.id}</td>
                <td className="border p-2">{t.name}</td>
                <td className="border p-2">{t.description}</td>
                <td className="border p-2 space-x-2">
                  <button
                    onClick={() => handleEdit(t)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTransport(t.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))):
            //transports.length === 0 && 
            (
              <tr>
                <td colSpan="4" className="text-center p-2">
                  No transports found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TransportPage;
