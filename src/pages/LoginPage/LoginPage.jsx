import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        if (password === process.env.REACT_APP_DEMO_PASSWORD) {
            localStorage.setItem('isAuthenticated', 'true');
            navigate('/home');
        } else {
            alert('Incorrect password!');
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
            />
            <button type="submit">Login</button>
        </form>
    );
};

export default LoginPage;
