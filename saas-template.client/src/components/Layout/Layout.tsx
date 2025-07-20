import React from 'react';
import Navbar from '../Navbar/Navbar';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <>
            <Navbar />
            <Container maxWidth="lg">
                <Box sx={{ my: 4 }}>
                    {children}
                </Box>
            </Container>
        </>
    );
};

export default Layout;