import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE = 'http://127.0.0.1:8000/api/v1'; // adjust backend URL

export const useTransportStore = create((set, get) => ({
  transports: [],
  isLoading: false,
  error: null,

  fetchTransports: async () => {
    set({ isLoading: true });
    try {
        const token = localStorage.getItem('authToken');
        const res = await axios.get(`${API_BASE}/transport`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
      set({ 
        transports: res.data.data ?? res.data ?? [], 
        isLoading: false });
    } catch (err) {
      set({ error: err.message, isLoading: false });
      toast.error("Failed to load transports");
    }
  },

  addTransport: async (data) => {
    try {
        const token = localStorage.getItem('authToken');
        const res = await axios.post(`${API_BASE}/transport`, data, {
          headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
      set((state) => ({
        transports: [res.data.data ?? res.data, ...state.transports],
      }));
      toast.success("Transport added successfully");
    } catch (err) {
      toast.error("Failed to add transport");
    }
  },

  updateTransport: async (id, data) => {
    try {
        const token = localStorage.getItem('authToken');
        const res = await axios.put(`${API_BASE}/transport/${id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        set((state) => ({
            transports: state.transports.map((t) =>
            t.id === id ? (res.data.data ?? res.data) : t
        ),
        }));
        toast.success("Transport updated successfully");
    } catch (err) {
        toast.error("Failed to update transport");
    }
    },

  deleteTransport: async (id) => {
    try {
        const token = localStorage.getItem('authToken');
        const res = await axios.delete(`${API_BASE}/transport/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
      set((state) => ({
        transports: state.transports.filter((t) => t.id !== id),
      }));
      toast.success("Transport deleted successfully");
    } catch (err) {
      toast.error("Failed to delete transport");
    }
  },
}));
