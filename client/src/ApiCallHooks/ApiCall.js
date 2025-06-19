import axios from 'axios';

const ApiCall = axios.create({
    baseURL: 'http://localhost:8000/api',
    withCredentials: true,
});

export default ApiCall;