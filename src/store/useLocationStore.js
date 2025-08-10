import { create } from 'zustand';

export const useLocationStore = create((set, get) => ({
  locations: [],
  loading: false,
  error: null,

  // Fetch all locations
  fetchLocations: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/locations');
      if (!response.ok) throw new Error('Failed to fetch locations');
      const data = await response.json();
      set({ locations: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Add new location
  addLocation: async (locationData) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/locations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(locationData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create location');
      }
      
      const data = await response.json();
      set((state) => ({
        locations: [...state.locations, data.location],
        loading: false
      }));
      return data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Update location
  updateLocation: async (id, locationData) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/locations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(locationData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update location');
      }
      
      const data = await response.json();
      set((state) => ({
        locations: state.locations.map(loc => 
          loc.id === id ? { ...loc, ...locationData } : loc
        ),
        loading: false
      }));
      return data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Delete location
  deleteLocation: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/locations/${id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete location');
      }
      
      set((state) => ({
        locations: state.locations.filter(loc => loc.id !== id),
        loading: false
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));