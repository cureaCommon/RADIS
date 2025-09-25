import axios from 'axios';
import type {LoginCredentials} from '../types';

const AUTH_API_URL = 'http://188.166.82.72:8090/auth/login';

export const login = async (credentials: LoginCredentials): Promise<string> => {
    try {
        const response = await axios.post(AUTH_API_URL, credentials);
        const {token} = response.data;

        if (token) {
            sessionStorage.setItem('authToken', token);
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
    window.location.reload();
};