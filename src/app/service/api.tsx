import axios from 'axios';

const api = axios.create({
    baseURL: "https://bubbleflow-backend.onrender.com",
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: false
});

export default api;