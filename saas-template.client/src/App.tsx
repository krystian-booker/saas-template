import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout/Layout';
import DashboardLayout from './components/Layout/DashboardLayout';
import LandingPage from './pages/LandingPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
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
                    <Route path="/sign-in" element={<Layout><SignInPage /></Layout>} />
                    <Route path="/sign-up" element={<Layout><SignUpPage /></Layout>} />

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