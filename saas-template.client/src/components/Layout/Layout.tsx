import React from 'react';
import PublicNavbar from '../Navbar/PublicNavbar';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <>
            <PublicNavbar />
            <Container maxWidth={false} sx={{ height: '100vh' }}>
                <Box sx={{ my: 4 }}>
                    {children}
                </Box>
            </Container>
        </>
    );
};

export default Layout;