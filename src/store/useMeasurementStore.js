import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE = "http://127.0.0.1:8000/api/v1";

export const useMeasurementStore = create((set, get) => ({
  measurements: [],
  loading: false,
  error: null,

  fetchMeasurements: async () => {
    set({ loading: true, error: null });
    try {
        const token = localStorage.getItem('authToken');
        const res = await axios.get(`${API_BASE}/measurement`,{
            headers: { Authorization: `Bearer ${token}` }
        });

        set({ measurements: res.data.data, loading: false });
    } catch (err) {
      set({ error: "Failed to fetch measurements", loading: false });
      toast.error("Error fetching measurements");
    }
  },

  addMeasurement: async (data) => {
    try {
        const token = localStorage.getItem('authToken');
        const res = await axios.post(`${API_BASE}/measurement`, data,{
        headers: { Authorization: `Bearer ${token}` }
        });
        set((state) => ({
            measurements: [res.data.data, ...state.measurements],
        }));
      toast.success("Measurement added successfully");
    } catch (err) {
      toast.error("Failed to add measurement");
    }
  },

  updateMeasurement: async (id, data) => {
    try {
        const token = localStorage.getItem('authToken');
        const res = await axios.put(`${API_BASE}/measurement/${id}`, data, {
            headers: { Authorization: `Bearer ${token}` }
          });
        set((state) => ({
            measurements: state.measurements.map((m) =>
            m.id === id ? res.data.data ?? res.data : m
            ),
        }));
      toast.success("Measurement updated successfully");
    } catch (err) {
      toast.error("Failed to update measurement");
    }
  },

  deleteMeasurement: async (id) => {
    try {
        const token = localStorage.getItem('authToken');
        await axios.delete(`${API_BASE}/measurement/${id}`,{
            headers: { Authorization: `Bearer ${token}` }
          });
        set((state) => ({
            measurements: state.measurements.filter((m) => m.id !== id),
        }));
      toast.success("Measurement deleted successfully");
    } catch (err) {
      toast.error("Failed to delete measurement");
    }
  },
}));
