import React from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router-dom';

function LandingPage() {
    return (
        <Container maxWidth="md">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    mt: 8,
                }}
            >
                <Typography variant="h2" component="h1" gutterBottom>
                    Welcome to Your SaaS Platform
                </Typography>
                <Typography variant="h5" color="text.secondary" paragraph>
                    The all-in-one solution for managing your business. Streamline your workflow, boost productivity, and drive growth.
                </Typography>
                <Box sx={{ mt: 4 }}>
                    <Button variant="contained" color="primary" size="large" component={RouterLink} to="/register">
                        Get Started for Free
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}

export default LandingPage;