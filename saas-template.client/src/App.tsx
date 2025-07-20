import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout/Layout';
import DashboardLayout from './components/Layout/DashboardLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ProtectedRoute from './components/ProtectedRoute';

const lightTheme = createTheme({
    palette: {
        mode: 'light'
    }
});

function App() {
    return (
        <ThemeProvider theme={lightTheme}>
            <CssBaseline />
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Layout><LandingPage /></Layout>} />
                    <Route path="/login" element={<Layout><LoginPage /></Layout>} />
                    <Route path="/register" element={<Layout><RegisterPage /></Layout>} />

                    {/* Protected Routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/home" element={<DashboardLayout><HomePage /></DashboardLayout>} />
                    </Route>
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;