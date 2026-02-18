import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
                setUser(JSON.parse(storedUser));
            } else {
                localStorage.removeItem('user');
            }
        } catch (err) {
            console.error("Failed to parse user from local storage", err);
            localStorage.removeItem('user');
        }
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        try {
            const res = await axios.post('/api/auth/login', credentials, { withCredentials: true });
            if (res.data) {
                localStorage.setItem('user', JSON.stringify(res.data));
                setUser(res.data);
                return res.data;
            } else {
                throw new Error("Invalid response from server");
            }
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    };

    const register = async (userData) => {
        const res = await axios.post('/api/auth/signup', userData, { withCredentials: true });
        if (res.data) {
            localStorage.setItem('user', JSON.stringify(res.data));
            setUser(res.data);
            return res.data;
        }
    };

    const logout = async () => {
        try {
            await axios.post('/api/auth/logout', null, { withCredentials: true });
        } catch (err) {
            console.error(err);
        }
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
