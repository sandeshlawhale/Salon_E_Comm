// API Client for all backend communication
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

// Store auth token in localStorage
export const getAuthToken = () => {
    return localStorage.getItem('authToken');
};

export const setAuthToken = (token) => {
    if (token) {
        localStorage.setItem('authToken', token);
    }
};

export const removeAuthToken = () => {
    localStorage.removeItem('authToken');
};

// Generic fetch wrapper with error handling
const fetchAPI = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    // Add authorization token if available
    const token = getAuthToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(url, {
            ...options,
            headers,
        });

        // Handle 401 - Unauthorized
        if (response.status === 401) {
            removeAuthToken();
            window.location.href = '/login';
            throw new Error('Unauthorized. Please login again.');
        }

        // Handle other errors
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP Error: ${response.status}`);
        }

        // Return parsed JSON
        return await response.json();
    } catch (error) {
        console.error(`API Error (${endpoint}):`, error);
        throw error;
    }
};

// Authentication API calls
export const authAPI = {
    register: async (userData) => {
        const response = await fetchAPI('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
        if (response.token) {
            setAuthToken(response.token);
        }
        return response;
    },

    login: async (email, password) => {
        const response = await fetchAPI('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        if (response.token) {
            setAuthToken(response.token);
        }
        return response;
    },

    getMe: async () => {
        return fetchAPI('/auth/me', {
            method: 'GET',
        });
    },

    logout: () => {
        removeAuthToken();
    },
};

// Product API calls
export const productAPI = {
    getAll: async (filters = {}) => {
        const queryParams = new URLSearchParams(filters).toString();
        const endpoint = `/products${queryParams ? '?' + queryParams : ''}`;
        return fetchAPI(endpoint, { method: 'GET' });
    },

    getById: async (productId) => {
        return fetchAPI(`/products/${productId}`, { method: 'GET' });
    },

    create: async (productData) => {
        return fetchAPI('/products', {
            method: 'POST',
            body: JSON.stringify(productData),
        });
    },

    update: async (productId, productData) => {
        return fetchAPI(`/products/${productId}`, {
            method: 'PATCH',
            body: JSON.stringify(productData),
        });
    },

    delete: async (productId) => {
        return fetchAPI(`/products/${productId}`, { method: 'DELETE' });
    },
};

// Order API calls
export const orderAPI = {
    getAll: async (filters = {}) => {
        const queryParams = new URLSearchParams(filters).toString();
        const endpoint = `/orders${queryParams ? '?' + queryParams : ''}`;
        return fetchAPI(endpoint, { method: 'GET' });
    },

    getMyOrders: async () => {
        return fetchAPI('/orders/me', { method: 'GET' });
    },

    getById: async (orderId) => {
        return fetchAPI(`/orders/${orderId}`, { method: 'GET' });
    },

    create: async (orderData) => {
        return fetchAPI('/orders', {
            method: 'POST',
            body: JSON.stringify(orderData),
        });
    },

    update: async (orderId, orderData) => {
        return fetchAPI(`/orders/${orderId}`, {
            method: 'PATCH',
            body: JSON.stringify(orderData),
        });
    },
};

// Commission API calls
export const commissionAPI = {
    getAll: async (filters = {}) => {
        const queryParams = new URLSearchParams(filters).toString();
        const endpoint = `/commissions${queryParams ? '?' + queryParams : ''}`;
        return fetchAPI(endpoint, { method: 'GET' });
    },

    getById: async (commissionId) => {
        return fetchAPI(`/commissions/${commissionId}`, { method: 'GET' });
    },

    create: async (commissionData) => {
        return fetchAPI('/commissions', {
            method: 'POST',
            body: JSON.stringify(commissionData),
        });
    },

    update: async (commissionId, commissionData) => {
        return fetchAPI(`/commissions/${commissionId}`, {
            method: 'PATCH',
            body: JSON.stringify(commissionData),
        });
    },
};

// Cart API calls
export const cartAPI = {
    getCart: async () => {
        return fetchAPI('/cart', { method: 'GET' });
    },

    addToCart: async (productId, quantity = 1) => {
        return fetchAPI('/cart/add', {
            method: 'POST',
            body: JSON.stringify({ productId, quantity }),
        });
    },

    updateCart: async (productId, quantity) => {
        return fetchAPI(`/cart/${productId}`, {
            method: 'PATCH',
            body: JSON.stringify({ quantity }),
        });
    },

    removeFromCart: async (productId) => {
        return fetchAPI(`/cart/${productId}`, { method: 'DELETE' });
    },

    clearCart: async () => {
        return fetchAPI('/cart', { method: 'DELETE' });
    },

    getCartTotal: async () => {
        return fetchAPI('/cart/total', { method: 'GET' });
    },
};
