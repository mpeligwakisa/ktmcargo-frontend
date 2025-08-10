import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE = 'http://127.0.0.1:8000/api/v1';

const initialForm = {
  firstName: '',
  middleName: '',
  lastName: '',
  gender: '',
  staffNumber: '',
  roles: '',
  status: 'Active',
  locations: '',
  mobile: '',
  personalCode: '',
  email: '',
  password: '',
  confirmPassword: '',
  permissions: [],
  //stations: [],
  photo: null
};

export const useUserManagement = create((set, get) => ({
  formData: initialForm,
  users: [],
  roles: [],
  locations: [],
  status:[],
  isLoading: false,

  // Set form values
  setFormData: (data) => set({ formData: data }),
  resetForm: () => set({ formData: initialForm }),

  // Handle input change
  handleChange: (e) => {
    const { name, value, type, checked, files } = e.target;
    const formData = get().formData;

    if (type === 'checkbox' && name === 'permissions') {
      const updated = checked
        ? [...formData.permissions, value]
        : formData.permissions.filter(p => p !== value);
      set({ formData: { ...formData, permissions: updated } });
    } else if (type === 'checkbox' && name === 'stations') {
      const updated = checked
        ? [...formData.stations, value]
        : formData.stations.filter(s => s !== value);
      set({ formData: { ...formData, stations: updated } });
    } else if (type === 'file') {
      set({ formData: { ...formData, photo: files[0] } });
    } else {
      set({ formData: { ...formData, [name]: value } });
    }
  },

  // Fetch all users
  fetchUsers: async () => {
    set({ isLoading: true });
    try {
      const res = await axios.get(`${API_BASE}/users`);
      set({ users: res.data });
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      set({ isLoading: false });
    }
  },

  fetchFormOptions: async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast.error('No authentication token found');
        return;
      }
  
      const res = await axios.get(`${API_BASE}/users/form-options`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      set({
        roles: res.data.roles,
        statuses: res.data.statuses,
        locations: res.data.locations
      });
    } catch (err) {
      toast.error('Failed to load form options');
    }
  },
  

  // Fetch user groups
//   fetchGroups: async () => {
//     try {
//       const res = await axios.get('/api/user-groups');
//       set({ groups: res.data });
//     } catch (err) {
//       toast.error('Failed to load user groups');
//     }
//   },


  // Submit user
  submitUser: async () => {
    const formData = get().formData;

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    const payload = new FormData();
    Object.keys(formData).forEach(key => {
      if (Array.isArray(formData[key])) {
        formData[key].forEach(item => payload.append(`${key}[]`, item));
      } else {
        payload.append(key, formData[key]);
      }
    });

    set({ isLoading: true });
    try {
      await axios.post(`${API_BASE}/users`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('User created successfully');
      get().resetForm();
      await get().fetchUsers();
    } catch (err) {
      toast.error('Failed to create user');
    } finally {
      set({ isLoading: false });
    }
  }
}));