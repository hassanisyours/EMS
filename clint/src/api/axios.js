import axios from 'axios'

const rawBase = import.meta.env.VITE_API_URL || 'http://localhost:4000'
const base = rawBase.replace(/\/$/, '')

const api = axios.create({
    baseURL: `${base}/api`
})

// Attach auth token to all network requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config;
});

export default api;

