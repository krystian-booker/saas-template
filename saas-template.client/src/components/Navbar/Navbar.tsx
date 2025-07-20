import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

function Navbar() {
    return (
        <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}>
            <Toolbar>
                {/* Logo/Text on the left */}
                <Typography variant="h6" component={RouterLink} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
                    SaaS Admin
                </Typography>

                {/* Navigation Buttons on the right */}
                <Box>
                    <Button color="inherit" component={RouterLink} to="/register" sx={{ mr: 1 }}>
                        Register
                    </Button>
                    <Button variant="outlined" color="primary" component={RouterLink} to="/login">
                        Login
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;