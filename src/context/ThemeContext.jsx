import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // Force light theme
    const theme = 'light';

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('dark');
        root.classList.add('light');
        localStorage.setItem('theme', 'light');
    }, []);

    const toggleTheme = () => {
        // No-op
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
