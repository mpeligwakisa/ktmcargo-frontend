// store/clientStore.js

import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE = 'http://127.0.0.1:8000/api/v1';

export const useClientStore = create((set, get) => ({
  clients: [],
  locations:[],
  isLoading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  perPage: 10,
  totalClients: 0,
  filters: {
    search: '',
    location: '',
  },
  queuedClients: [],

  // ✅ Get current filters + pagination
  getFetchParams: () => {
    const { filters, currentPage, perPage } = get();
    return { ...filters, page: currentPage, per_page: perPage };
  },

  handleChange: (e) => {
    const { name, value, type, checked, files } = e.target;
    const formData = get().formData;

    if (type === 'checkbox' && name === 'permissions') {
      const updated = checked
        ? [...formData.permissions, value]
        : formData.permissions.filter(p => p !== value);
      set({ formData: { ...formData, permissions: updated } });
    } 
    //else if (type === 'checkbox' && name === 'stations') {
    //   const updated = checked
    //     ? [...formData.stations, value]
    //     : formData.stations.filter(s => s !== value);
    //   set({ formData: { ...formData, stations: updated } });
    // } 
    else if (type === 'file') {
      set({ formData: { ...formData, photo: files[0] } });
    } else {
      set({ formData: { ...formData, [name]: value } });
    }
  },

  // ✅ Fetch clients
  fetchClients: async (params = {}) => {
    set({ isLoading: true });
    try {
      const { search, location, page, per_page } = { ...get().getFetchParams(), ...params };
      const token = localStorage.getItem('authToken');

      const response = await axios.get(`${API_BASE}/clients`, 
      {
        params: { search, location_id:location, page, per_page },
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json', },
        
      });

      console.log("Stored Token:", localStorage.getItem("authToken"));


      //const data = response.data.clients.data || {}; // Laravel response: { clients: {data, current_page, total, ...} }
      const data = response.data;
      console.log('Fetched clients list:', data.data);
      set({
        clients: data.data || [],
        currentPage: data.meta?.current_page || 1,
        totalPages: data.meta?.last_page || 1,
        perPage: data.meta?.per_page || 10,
        totalClients: data.meta?.total || 0,
        isLoading: false,
      });
    } catch (error) {
      console.error(error);
      set({ error, isLoading: false });
      toast.error('Failed to fetch clients');
    }
  },

  // ✅ Fetch locations for dropdown
  fetchLocations: async () => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await axios.get(`${API_BASE}/clients/form-options`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ locations: res.data.locations || [] });
      console.log('Fetched locations:', res.data.locations);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load locations');
    }
  },

  // ✅ Add new client
  addClient: async (clientData) => {
    console.log("Submitting clientData:", clientData);
    set({ isLoading: true });
    try {
      const token = localStorage.getItem('authToken');
      await axios.post(`${API_BASE}/clients`, clientData, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json', },
      });
      toast.success('Client added successfully');
      get().fetchClients();
      set({isLoading: false});
    } catch (error) {
      console.error(error);
      toast.error('Failed to add client');
      set({ isLoading: false });
    }
  },

  // ✅ Edit existing client
  editClient: async (id, updatedData) => {
    set({ isLoading: true });
    try {
      const token = localStorage.getItem('authToken');
      await axios.put(`${API_BASE}/clients/${id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Client updated');
      await get().fetchClients();
      return true;
    } catch (error) {
      console.error(error);
      toast.error('Failed to update client');
      set({ isLoading: false });
      return false;
    }
  },

  // ✅ Soft-delete client
  deleteClient: async (id) => {
    set({ isLoading: true });
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`${API_BASE}/clients/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Client deleted');
      await get().fetchClients();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete client');
      set({ isLoading: false });
    }
  },

  // ✅ Bulk delete
  bulkDeleteClients: async (ids) => {
    set({ isLoading: true });
    try {
      const token = localStorage.getItem('authToken');
      await axios.post(`${API_BASE}/clients/bulk-delete`, { ids }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Clients deleted');
      await get().fetchClients();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete clients');
      set({ isLoading: false });
    }
  },

  // ✅ Queue client when offline
  queueAddClient: (clientData) => {
    const { queuedClients } = get();
    set({ queuedClients: [...queuedClients, clientData] });
    toast.info('Client queued for sync');
  },

  // ✅ Sync queued clients when online
  syncQueuedClients: async () => {
    const { queuedClients } = get();
    if (!navigator.onLine || queuedClients.length === 0) return;

    set({ isLoading: true });
    try {
      const token = localStorage.getItem('authToken');
      for (const client of queuedClients) {
        await axios.post(`${API_BASE}/clients`, client, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      toast.success('Queued clients synced');
      set({ queuedClients: [] });
      await get().fetchClients();
    } catch (error) {
      console.error(error);
      toast.error('Failed to sync queued clients');
    } finally {
      set({ isLoading: false });
    }
  },

  // ✅ Update filters
  setFilters: (newFilters) => {
    set((state) => ({
      filters: {
        ...state.filters,
        ...newFilters,
      },
      currentPage: 1, // Reset to first page
    }));
  },

  // ✅ Change current page
  setCurrentPage: (page) => {
    set({ currentPage: page });
  },
}));

//Automatically sync queued clients when online
window.addEventListener('online', () => {
  const store = useClientStore.getState();
  store.syncQueuedClients();
});