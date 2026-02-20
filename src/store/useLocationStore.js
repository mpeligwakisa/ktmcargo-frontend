import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE = 'http://127.0.0.1:8000/api/v1';

export const useLocationStore = create((set, get) => ({
  locations: [],
  loading: false,
  error: null,

  // Fetch all locations
  fetchLocations: async () => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast.error('No authentication token found');
        set({ loading: false });
        return;
      }

      const response = await axios.get(`${API_BASE}/locations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const locations = response.data.data ?? response.data;
      set({ 
        locations,
        loading: false
      });
    } catch (error) {
      console.error(error);
      set({ error: error.message, loading: false });
      toast.error('Failed to fetch locations');
    }
  },

  // Add new location
  addLocation: async (locationData) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(`${API_BASE}/locations`, locationData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      const newLocation = response.data.data ?? response.data;
      set((state) => ({
        locations: [...state.locations, newLocation],
        loading: false
      }));

      await get().fetchLocations();
      toast.success("Location created successfully");
      return true;
    } catch (error) {
      set({ error: error.message, loading: false });
      toast.error("Failed to create location");
      return false;
    }
  },

  // Update location
  updateLocation: async (id, locationData) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.put(`${API_BASE}/locations/${id}`, locationData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const updated = response.data ?? response.data;
      set((state) => ({
        locations: state.locations.map(loc =>
          loc.id === id ? updated : loc
        ),
        loading: false
      }));

      await get().fetchLocations();
      toast.success("Location updated successfully");
      return true;
    } catch (error) {
      console.error(error);
      set({ error: error.message, loading: false });
      toast.error("Failed to update location");
      return false;
    }
  },

  // Delete location
  deleteLocation: async (id) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`${API_BASE}/locations/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set((state) => ({
        locations: state.locations.filter(loc => loc.id !== id),
        loading: false
      }));
      toast.success("Location deleted successfully");
      return true;
    } catch (error) {
      console.error(error);
      set({ error: error.message, loading: false });
      toast.error("Failed to delete location");
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));