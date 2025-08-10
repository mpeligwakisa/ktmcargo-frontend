import axios from 'axios';

// Set your backend API base URL
const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

/**
 * Fetch dashboard metrics from the Laravel backend.
 * This should match the route defined in your Laravel controller.
 */
export const fetchDashboardMetrics = async () => {
  try {
    const token = localStorage.getItem('authToken');

    const response = await axios.get(`${API_BASE_URL}/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Failed to fetch dashboard metrics:', error);
    throw error;
  }
};
