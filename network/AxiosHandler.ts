
import axios from "axios";
import {getCookie} from 'cookies-next';

const getAccessToken = () => {
    return getCookie('access_token');
}

axios.interceptors.request.use(
    async (config) => {
        const token = getAccessToken();
        if (token && config.url && !config.url.includes('/auth')) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axios;
