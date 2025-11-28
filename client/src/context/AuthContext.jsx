import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkLoggedIn = () => {
            const token = localStorage.getItem('token');
            if (token) {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    setCurrentUser(JSON.parse(storedUser));
                }
            }
            setIsLoading(false);
        };
        checkLoggedIn();
    }, []);

    const userLogin = async (email, password) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, { email, password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            setCurrentUser(response.data.user);
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    };

    const userRegister = async (name, email, password) => {
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, { name, email, password });
            return { success: true };
        } catch (error) {
            console.error('Registration Error:', error.response?.data || error.message);
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed',
                error: error.response?.data?.error
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setCurrentUser(null);
    };

    return (
        <AuthContext.Provider value={{ user: currentUser, login: userLogin, register: userRegister, logout, loading: isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
