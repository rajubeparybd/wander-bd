import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../pages/shared/Navbar/Navbar';
import Footer from '../pages/shared/Footer/Footer';

const RootLayout = () => {
    return (
        <div>
            <Navbar />
            <div className='w-full mx-auto pt-20'>
                <Outlet />
            </div>

            <Footer />
        </div>
    );
};

export default RootLayout;