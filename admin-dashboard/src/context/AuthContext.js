import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing auth on mount
        const storedToken = localStorage.getItem('adminToken');
        const storedUser = localStorage.getItem('adminUser');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await apiClient.post('/auth/admin-login', {
                email,
                password,
            });

            if (response.success) {
                const { token, admin } = response;
                setToken(token);
                setUser(admin);
                localStorage.setItem('adminToken', token);
                localStorage.setItem('adminUser', JSON.stringify(admin));
                return { success: true };
            }
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Login failed',
            };
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
    };

    const value = {
        user,
        token,
        loading,
        isAuthenticated: !!token,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
