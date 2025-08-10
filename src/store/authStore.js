import { create } from 'zustand';
import axios from 'axios';

const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('authToken') || null,
  profile: JSON.parse(localStorage.getItem('profile')) || null,
  // isAuthenticated: false,
  isLoading: false, // Initialize as false, assuming no initial loading


  // Getter to check authentication status
  isAuthenticated: () => !!get().token,

  // Getter for current user role
  role: () => get().user?.role || get().profile?.role || null,

  // Role check helper
  hasRole: (requiredRole) => {
    const role = get().user?.role || get().profile?.role;
    return role === requiredRole;
  },

  // Setters
  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },

  setToken: (token) => {
    localStorage.setItem('authToken', token);
    set({ token });
  },

  setProfile: (profile) => {
    localStorage.setItem('profile', JSON.stringify(profile));
    set({ profile });
  },


  login: async (email, password) => {
    set({ isLoading: true });
    try {
      // **Replace this with your actual authentication logic**
      // This is a placeholder for where you would call your API
      // or handle your authentication mechanism.

      const response = await axios.post('http://127.0.0.1:8000/api/v1/auth/login', {
        email,
        password,
      });

      const { token, user } = response.data;

      set({ user, token, isAuthenticated: true, isLoading: false });
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));

      return true;

      // **Simulate a successful login after a delay**
      
    } catch (error) {
      console.log('Attempting login with:', email, password);
      console.error('Login error:', error);
      set({ user: null, profile: null, isAuthenticated: false, isLoading: false });
      return false;
      console.log('Attempting login with:', email, password);
      console.error('Login error:', error);
    }
  },

  logout: async () => {
    // **Replace this with your actual logout logic**
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    localStorage.removeItem('profile');
    set({ user: null, token: null, profile: null, isAuthenticated: false, isLoading: false });
    // You might want to clear local storage or session storage here
  },
}));

export { useAuthStore };