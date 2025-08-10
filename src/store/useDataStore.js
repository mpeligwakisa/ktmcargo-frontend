import { create } from 'zustand';
import { useAuthStore } from './authStore';
import { fetchDashboardMetrics } from '../api/dashboardMetrics';
import { toast } from 'react-toastify';
import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000/api/v1';

const useDataStore = create((set, get) => ({
  clients: [],
  cargo: [],
  users: [],
  locations: [],
  monthlyData: [],
  dashboardMetrics: null,
  isLoading: false,

  // Actions
  fetchDashboardMetrics: async (location = 'All') => {
    set({ isLoading: true });
    try {
      // **Replace this with your actual API call to fetch locations**
      console.log('Fetching...');
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${API_BASE}/dashboard?location=${location}`,{
        headers:{
          Authorization: `Bearer ${token}`,
          Accept: `application/json`,
        }
      });

      set({
        dashboardMetrics: response.data.metrics,
        monthlyData: response.data.monthlyData || [],
        isLoading: false
      });
    }catch(error){
      console.error('Error fetching Dashboard metrics:', error);
      toast.error('Failed to load dashboard metrics');
      set({isLoading: false});
    }
  },

  //Fetch Clients
  fetchClients: async (location = 'All') => {
    set({ isLoading: true});
    try{
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${API_BASE}/clients?location=${location}`,{
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        }
      });
      console.log('Fetched clients:', response.data);
      set({
        clients: Array.isArray(response.data.clients) ? response.data.clients : [], 
        isLoading:false
      });
    } catch(error){
      console.error('Error fetching clients:', error);
      toast.error('Failed to load clients');
      set({ isLoading: false});
    }
  },

  // Add Client
  addClient: async (clientData) => {
    set({ isLoading: true });
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(`${API_BASE}/clients`, clientData, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        }
      });
      const newClient = response.data.client;
      set((state) => ({
      //const safeClients = Array.isArray(state.clients) ? state.clients : [];
        
          clients: Array.isArray(state.clients) ? [...state.clients, newClient] : [newClient],
          isLoading: false,
      }));
      toast.success('Client added successfully');
      return true;
    } catch (error) {
      console.error('Error adding client:', error);
      if (error.response?.data?.errors) {
        Object.values('Validation errors:', error.response.data.errors).flat().forEach(msg => toast.error(msg));
      }
      toast.error('Failed to add Client');
      set({isLoading: false});
      //return null;
    }
  },

  // Edit client
  editClient: async (id, updatedData) => {
    set({ isLoading: true });
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.put(`${API_BASE}/clients/${id}`, updatedData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      const updateClient = response.data.client;
      set((state) => ({
        clients: Array.isArray(state.clients) 
        ? state.clients.map((c) =>
        (c.id === id ? updateClient : c)
        ) : [],
        isLoading: false,
      }));
      toast.success('Client updated successfully!');
      return true;

    } catch (error) {
      toast.error('Failed to update client.');
      console.error('Edit error:', error);
      set({ isLoading: false });
      return false;
    }
  },

  // Delete client
  deleteClient: async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`${API_BASE}/clients/${id}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          Accept: 'application/json', 
        },
      });

      set((state) => ({
        clients: Array.isArray(state.clients) ? state.clients.filter((c) => c.id !== id) : [],
        isLoading: false,
      }));

      toast.success('Client deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete client.');
      console.error('Delete error:', error);
      set({ isLoading: false});
    }
  },

  //Fetch Cargo
  fetchCargo: async (location = 'All') => {
    set({ isLoading: true });
    try{
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${API_BASE}/cargo?location=${location}`,{
        headers: { 
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        }
      });
      set({ cargo: response.data.cargo || [], 
        isLoading: false});
    }catch (error){
      console.error('Error fetching cargo:', error);
      toast.error('Failed to load cargo');
      set({ isLoading: false});
    }
  },

  // Add Cargo
  addCargo: async (cargoData) => {
    set({ isLoading: true});
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(`${API_BASE}/cargo`, cargoData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        }
      });
      const newCargo = response.data.cargo;
      //const newCargo = { id: Math.random().toString(36).substring(2, 15), cargoNumber: `CARGO-${Math.floor(Math.random() * 10000)}`, trackingNumber: `TRK-${Math.floor(Math.random() * 100000)}`, createdAt: new Date().toISOString(), ...cargoData };
      set((state) => ({ 
        cargo: [...(state.cargo || []), newCargo],
        isLoading: false
      }));
      toast.success('Cargo added succesfully');
    } catch (error) {
      console.error('Error adding cargo:', error);
      toast.error('Failed to add cargo');
      set({ isLoading: false });
    }
  },

  // Edit Cargo
  editCargo: async (id, updatedData) => {
    set({ isLoading: true });
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.put(`${API_BASE}/cargo/${id}`, updatedData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      const updateCargo = response.data.cargo;
      set((state) => ({
        cargo: Array.isArray(state.cargo) 
        ? state.cargo.map((c) =>
        (c.id === id ? updateCargo : c)
        ) : [],
        isLoading: false,
      }));
      toast.success('Cargo updated successfully!');
      return true;

    } catch (error) {
      toast.error('Failed to update cargo.');
      console.error('Edit error:', error);
      set({ isLoading: false });
      return false;
    }
  },

  // Delete Cargo
  deleteCargo: async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`${API_BASE}/cargo/${id}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          Accept: 'application/json', 
        },
      });
      set((state) => ({
        cargo: Array.isArray(state.cargo) ? state.cargo.filter((c) => c.id !== id) : [],
        isLoading: false,
      }));
      toast.success('Cargo deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete cargo.');
      console.error('Delete error:', error);
      set({ isLoading: false });
    }
  },

  // Fetch users
  fetchUsers: async () => {
    set({ isLoading: true });
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${API_BASE}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        }
      });
      set({ users: response.data.users || [], isLoading: false });
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
      set({ isLoading: false });
    }
  },

  // Add User
  addUser: async (userData) => {
    set({ isLoading: true });
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(`${API_BASE}/users`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        }
      });
      const newUser = response.data.user;
      set((state) => ({
      //const safeClients = Array.isArray(state.clients) ? state.clients : [];
        
          users: Array.isArray(state.users) ? [...state.users, newUser] : [newUser],
          isLoading: false,
      }));
      toast.success('User added successfully');
      return true;
    } catch (error) {
      console.error('Error adding user:', error);
      if (error.response?.data?.errors) {
        Object.values('Validation errors:', error.response.data.errors).flat().forEach(msg => toast.error(msg));
      }
      toast.error('Failed to add User');
      set({isLoading: false});
      //return null;
    }
  },

  // Edit users
  editUser: async (id, updatedData) => {
    set({ isLoading: true });
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.put(`${API_BASE}/users/${id}`, updatedData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      const updateUser = response.data.user;
      set((state) => ({
        users: Array.isArray(state.users) 
        ? state.users.map((u) =>
        (u.id === id ? updateUser : u)
        ) : [],
        isLoading: false,
      }));
      toast.success('User updated successfully!');
      return true;

    } catch (error) {
      toast.error('Failed to update user.');
      console.error('Edit error:', error);
      set({ isLoading: false });
      return false;
    }
  },

  // Delete user
  deleteUser: async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`${API_BASE}/users/${id}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          Accept: 'application/json', 
        },
      });

      set((state) => ({
        users: Array.isArray(state.users) ? state.users.filter((u) => u.id !== id) : [],
        isLoading: false,
      }));

      toast.success('User deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete user.');
      console.error('Delete error:', error);
      set({ isLoading: false});
    }
  },

  // Fetch locations
  fetchLocations: async () => {
    set({ isLoading: true });
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${API_BASE}/locations`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        }
      });
      set({ locations: response.data.locations || [], isLoading: false });
    } catch (error) {
      console.error('Error fetching locations:', error);
      toast.error('Failed to load locations');
      set({ isLoading: false });
    }
  },

  // Add Location
  addLocation: async (locationData) => {
    set({ isLoading: true });
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(`${API_BASE}/locations`, locationData, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        }
      });
      const newLocation = response.data.location;
      set((state) => ({
        locations: Array.isArray(state.locations) ? [...state.locations, newLocation] : [newLocation],
        isLoading: false,
      }));
      toast.success('Location added successfully');
      return true;
    } catch (error) {
      console.error('Error adding location:', error);
      if (error.response?.data?.errors) {
        Object.values('Validation errors:', error.response.data.errors).flat().forEach(msg => toast.error(msg));
      }
      toast.error('Failed to add Location');
      set({ isLoading: false });
    }
  },

  // Edit Location
  editLocation: async (id, updatedData) => {
    set({ isLoading: true });
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.put(`${API_BASE}/locations/${id}`, updatedData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      const updateLocation = response.data.location;
      set((state) => ({
        locations: Array.isArray(state.locations) 
        ? state.locations.map((l) =>
        (l.id === id ? updateLocation : l)
        ) : [],
        isLoading: false,
      }));
      toast.success('Location updated successfully!');
      return true;

    } catch (error) {
      toast.error('Failed to update location.');
      console.error('Edit error:', error);
      set({ isLoading: false });
      return false;
    }
  },

  // Delete Location
  deleteLocation: async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`${API_BASE}/locations/${id}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          Accept: 'application/json', 
        },
      });

      set((state) => ({
        locations: Array.isArray(state.locations) ? state.locations.filter((l) => l.id !== id) : [],
        isLoading: false,
      }));

      toast.success('Location deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete location.');
      console.error('Delete error:', error);
      set({ isLoading: false });
    }
  },
  
})
);
export { useDataStore };