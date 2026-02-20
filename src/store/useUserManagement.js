import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE = 'http://127.0.0.1:8000/api/v1';

const initialForm = {
  first_name: '',
  middle_name: '',
  last_name: '',
  gender: '',
  role_id: '',
  status_id: '',
  location_id: '',
  phone: '',
  email: '',
  password: '',
  confirmPassword: '',
  permissions: [],
  stations: null,
  photo: null
};

export const useUserManagement = create((set, get) => ({
  formData: initialForm,
  users: [],
  role: [],
  location: [],
  status:[],
  isLoading: false,
  editingUser:null,

  // Set form values
  setFormData: (data) => set({ formData: data }),
  resetForm: () => set({ formData: initialForm, editingUser:null, }),

  // Handle input change
  handleChange: (e) => {
    const { name, value, type, checked, files } = e.target;
    const formData = get().formData;

    if (type === 'checkbox' && name === 'permissions') {
      const updated = checked
        ? [...formData.permissions, value]
        : formData.permissions.filter(p => p !== value);
      set({ formData: { ...formData, permissions: updated } });
    }
    else if (type === 'file') {
      set({ formData: { ...formData, photo: files[0] } });
    } else {
      set({ formData: { ...formData, [name]: value } });
    }
  },

  //================
  // Fetch all users
  //================
  fetchUsers: async () => {
    set({ isLoading: true });
    try {
      const token = localStorage.getItem('authToken');
      const res = await axios.get(`${API_BASE}/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      set({ users: res.data || [] });
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      set({ isLoading: false });
    }
  },

  //Fetch role, status, location fro dropdowns
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
        role: res.data.role || [],
        status: res.data.status || [],
        location: res.data.location || []
      });
    } catch (err) {
      toast.error('Failed to load form options');
    }
  },

   // =========================
  // ADD USER
  // =========================
  addUser: async () => {
    const formData = get().formData;

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    const payload = {
      first_name: formData.first_name,
      middle_name: formData.middle_name,
      last_name: formData.last_name,
      gender: formData.gender,
      role_id: formData.role_id,
      status_id: formData.status_id,
      location_id: formData.location_id,
      phone: formData.phone,
      email: formData.email,
      password: formData.password,
    };

    set({ isLoading: true });
    try {
      const token = localStorage.getItem('authToken');
      await axios.post(`${API_BASE}/users`, payload, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      toast.success('User created successfully');
      await get().fetchUsers();
      get().resetForm();
    } catch (err) {
      console.error('Add User Error', err.response?.data);
      toast.error(err.response?.data?.message || 'Failed to create user');
    } finally {
      set({ isLoading: false });
    }
  },


  // =========================
  // UPDATE USER
  // =========================
  updateUser: async (id) => {
    const formData = get().formData;

    const payload = {
      first_name: formData.first_name,
      middle_name: formData.middle_name,
      last_name: formData.last_name,
      gender: formData.gender,
      role_id: formData.role_id,
      status_id: formData.status_id,
      location_id: formData.location_id,
      phone: formData.phone,
      email: formData.email,
      password: formData.password || undefined, // optional
    };

    set({ isLoading: true });
    try {
      const token = localStorage.getItem('authToken');
      await axios.put(`${API_BASE}/users/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      toast.success('User updated successfully');
      await get().fetchUsers();
      get().resetForm();
    } catch (err) {
      console.error('Update User Error', err.response?.data);
      toast.error(err.response?.data?.message || 'Failed to update user');
    } finally {
      set({ isLoading: false });
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

  // Delete user
  deleteUser: async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    set({ isLoading: true });
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`${API_BASE}/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('User deleted successfully');
      await get().fetchUsers();
    } catch (err) {
      console.error('Delete user error', err.response?.data);
      toast.error(err.response?.data?.message || 'Failed to delete user');
    } finally {
      set({ isLoading: false });
    }
  },
}));