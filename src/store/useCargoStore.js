import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE = "http://127.0.0.1:8000/api/v1";

export const useCargoStore = create((set, get) => ({
  cargos: [],
  clients:[],
  measurements:[],
  transports:[],
  locations:[],
  selectedCargo: null,
  isLoading: false,
  error: null,
  meta: {
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  },

  // ✅ Fetch all dropdown data
  fetchDropdowns: async () => {
    const token = localStorage.getItem("authToken");
    try {
      const [clientsRes, measRes, transportRes, locRes] = await Promise.all([
        axios.get(`${API_BASE}/clients`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE}/measurement`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE}/transport`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE}/locations`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      set({
        clients: clientsRes.data.data || [],
        measurements: measRes.data.data || [],
        transportModes: transportRes.data.data || [],
        locations: locRes.data.data || [],
      });
    } catch (err) {
      console.error("Fetch dropdowns error:", err.response?.data || err.message);
      toast.error("Failed to fetch dropdown data");
    }
  },

  fetchCargos: async (page = 1, perPage = 10, search = "") => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.get(`${API_BASE}/cargo`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, per_page: perPage, search },
      });

      set({
        cargos: res.data.data || [],
        meta: res.data.meta || {
          current_page: 1,
          last_page: 1,
          per_page: 10,
          total: 0,
        },
        isLoading: false,
      });
    } catch (err) {
      console.error("Fetch cargos error:", err.response?.data || err.message);
      toast.error("Failed to fetch cargos");
      set({ isLoading: false, error: "Failed to fetch cargos" });
    }
  },

  addCargo: async (cargoData) => {
    try {
      const token = localStorage.getItem("authToken");
      // const payload = {
      //   client_id: cargoData.client_id,
      //   measurement_id: cargoData.measurement_id,
      //   transport_id: cargoData.transport_id,
      //   origin_country: cargoData.origin_loaction_id, // location id
      //   destination: cargoData.destination_location_id,       // location id
      //   cargo_name: cargoData.cargo_name,
      //   quantity: cargoData.quantity,
      //   weight: cargoData.weight,
      //   length: cargoData.length,
      //   width: cargoData.width,
      //   height: cargoData.height,
      //   value: cargoData.value,
      //   packaging: cargoData.packaging,
      //   instructions: cargoData.instructions,
      // };
      const res = await axios.post(`${API_BASE}/cargo`, cargoData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      set((state) => ({
        cargos: [res.data.data || res.data.cargo, ...state.cargos],
      }));

      toast.success("Cargo added successfully");
      get().fetchCargos();
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error("Failed to add cargo");
    }
  },

  updateCargo: async (id, cargoData) => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.put(`${API_BASE}/cargo/${id}`, cargoData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      set((state) => ({
        cargos: state.cargos.map((c) => (c.id === id ? res.data.data || res.data.cargo : c)),
      }));

      toast.success("Cargo updated successfully");
      get().fetchCargos();
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error("Failed to update cargo");
    }
  },

  deleteCargo: async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`${API_BASE}/cargo/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      set((state) => ({
        cargos: state.cargos.filter((c) => c.id !== id),
      }));

      toast.success("Cargo deleted successfully");
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error("Failed to delete cargo");
    }
  },

  setSelectedCargo: (cargo) => set({ selectedCargo: cargo }),
  //clearSelectedCargo: () => set({ selectedCargo: null }),
}));
