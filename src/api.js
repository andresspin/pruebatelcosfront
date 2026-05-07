import axios from 'axios';

const api = axios.create({
    baseURL: 'http://prueba-clientes.test/api', // Adjust to your Laragon URL
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

export default api;
