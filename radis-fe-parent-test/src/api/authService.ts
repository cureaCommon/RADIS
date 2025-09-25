import axios from 'axios';
import apiClient from "./apiClient.ts";

export interface LoginCredentials {
    username: string;
    password: string;
}
const AUTH_API_URL = 'http://188.166.82.72:8090/auth/login';

export const setAuthHeader = (token: string | null) => {
    if (token) {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete apiClient.defaults.headers.common['Authorization'];
    }
};

export const login = async (credentials: LoginCredentials): Promise<string> => {
    try {
        const response = await axios.post(AUTH_API_URL, credentials);
        const {token} = response.data;

        if (token) {
            sessionStorage.setItem('authToken', token);
            setAuthHeader(token);

            return token;
        } else {
            throw new Error('Login response did not include a token.');
        }
    } catch (error) {
        console.error('Login failed:', error);
        throw error;
    }
};

export const logout = () => {
    sessionStorage.removeItem('authToken');
    setAuthHeader(null);
    window.location.reload();
};