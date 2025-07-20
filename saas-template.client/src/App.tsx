import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Register from './components/Register';
import Login from './components/Login';

function App() {
    return (
        <Router>
            <div>
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/register">Register</Link>
                        </li>
                        <li>
                            <Link to="/login">Login</Link>
                        </li>
                    </ul>
                </nav>

                <hr />

                <Routes>
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<Home />} />
                </Routes>
            </div>
        </Router>
    );
}

function Home() {
    return <h2>Home</h2>;
}

export default App;