import React from 'react';
import DashboardNavbar from '../Navbar/DashboardNavbar';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

interface LayoutProps {
    children: React.ReactNode;
}

const DashboardLayout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <>
            <DashboardNavbar />
            <Container maxWidth={false} sx={{ height: '100vh' }}>
                <Box sx={{ my: 4 }}>
                    {children}
                </Box>
            </Container>
        </>
    );
};

export default DashboardLayout;