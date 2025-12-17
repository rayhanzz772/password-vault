import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

const clearAuthAndRedirect = () => {
  localStorage.removeItem("jwt_token");
  if (
    !window.location.pathname.includes("/login") &&
    !window.location.pathname.includes("/register")
  ) {
    window.location.href = "/login";
  }
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (
      error.response?.data?.message?.includes("JWT") ||
      error.response?.data?.message?.includes("jwt") ||
      error.response?.data?.error?.includes("JWT") ||
      error.response?.data?.error?.includes("jwt")
    ) {
      clearAuthAndRedirect();
    }

    if (error.response?.status === 401) {
      clearAuthAndRedirect();
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: async (email, masterPassword) => {
    const response = await api.post("/auth/register", {
      email,
      password: masterPassword,
    });
    return response.data;
  },

  login: async (email, masterPassword) => {
    const response = await api.post("/auth/login", {
      email,
      password: masterPassword,
    });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("jwt_token");
  },

  checkPassword: async (masterPassword) => {
    const response = await api.post("/api/users/check-password", {
      password: masterPassword,
    });
    return response.data;
  },
};

export const categoriesAPI = {
  getAll: async () => {
    const response = await api.get("/api/categories");
    return response.data;
  },
};

export const vaultAPI = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.category) {
      params.append("category", filters.category);
    }

    if (filters.search || filters.q) {
      params.append("q", filters.search || filters.q);
    }

    if (filters.favorites !== undefined) {
      params.append("favorites", filters.favorites ? "true" : "false");
    }

    // Add pagination parameters
    if (filters.page) {
      params.append("page", filters.page);
    }

    if (filters.per_page) {
      params.append("per_page", filters.per_page);
    }

    const queryString = params.toString();
    const url = queryString ? `/api/vault?${queryString}` : "/api/vault";

    const response = await api.get(url);
    return response.data;
  },

  create: async (vaultData, masterPassword) => {
    const response = await api.post("/api/vault", {
      ...vaultData,
      master_password: masterPassword,
    });
    return response.data;
  },

  decrypt: async (id, masterPassword) => {
    const response = await api.post(`/api/vault/${id}/decrypt`, {
      master_password: masterPassword,
    });
    return response.data;
  },

  update: async (id, vaultData, masterPassword) => {
    const response = await api.put(`/api/vault/${id}/update`, {
      ...vaultData,
      master_password: masterPassword,
    });
    return response.data;
  },

  delete: async (id, masterPassword) => {
    const response = await api.delete(`/api/vault/${id}/delete`, {
      data: { master_password: masterPassword },
    });
    return response.data;
  },

  toggleFavorite: async (targetId) => {
    const response = await api.post("/api/vault/favorite", {
      target_id: targetId,
      type: "password",
    });
    return response.data;
  },
};

// Logs API endpoints
export const logsAPI = {
  create: async (action) => {
    const response = await api.post("/api/vault/logs", {
      action: action,
    });
    return response.data;
  },

  getAll: async () => {
    const response = await api.get("/api/vault/logs");
    return response.data;
  },

  getSummary: async () => {
    const response = await api.get("/api/vault/recent-activity");
    return response.data;
  },
};

// Notes API endpoints
export const notesAPI = {
  // Get all notes
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.category) {
      params.append("category", filters.category);
    }

    if (filters.search || filters.q) {
      params.append("q", filters.search || filters.q);
    }

    // Add pagination parameters
    if (filters.page) {
      params.append("page", filters.page);
    }

    if (filters.per_page) {
      params.append("per_page", filters.per_page);
    }

    const queryString = params.toString();
    const url = queryString ? `/api/notes?${queryString}` : "/api/notes";

    const response = await api.get(url);
    return response.data;
  },

  // Get single note by ID
  getById: async (id) => {
    const response = await api.get(`/api/notes/${id}`);
    return response.data;
  },

  // Create new note
  create: async (noteData, masterPassword) => {
    // Encrypt the note content client-side (if encryption is enabled)
    // For now, send to server as is - server will handle encryption
    const response = await api.post("/api/notes", {
      title: noteData.title,
      note: noteData.note,
      category_id: noteData.category, // Send as category_id to match database schema
      tags: noteData.tags || [],
      master_password: masterPassword,
    });

    return response.data;
  },

  // Update existing note
  update: async (id, noteData, masterPassword) => {
    const response = await api.put(`/api/notes/${id}/update`, {
      title: noteData.title,
      note: noteData.note,
      category_id: noteData.category, // Send as category_id to match database schema
      tags: noteData.tags || [],
      master_password: masterPassword,
    });

    return response.data;
  },

  // Delete note
  delete: async (id, masterPassword) => {
    const response = await api.delete(`/api/notes/${id}/delete`, {
      data: { master_password: masterPassword },
    });
    return response.data;
  },

  // Decrypt note content
  decrypt: async (id, masterPassword) => {
    const response = await api.post(`/api/notes/${id}/decrypt`, {
      master_password: masterPassword,
    });
    return response.data;
  },

  toggleFavorite: async (targetId) => {
    const response = await api.post("/api/vault/favorite", {
      target_id: targetId,
      type: "note",
    });
    return response.data;
  },
};

export default api;
