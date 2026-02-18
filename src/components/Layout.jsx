import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <Navbar />
            <main className="flex-grow w-full pt-20 md:pt-24">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
