import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import { AppBar, Container, CssBaseline, Paper, Toolbar, Typography } from '@mui/material';
import { PerformanceMetric } from "./components";

function Home() {
    return (
        <Typography variant="h5" component="h2">
            Home Page
        </Typography>
    );
}

function About() {
    return (
        <Typography variant="h5" component="h2">
            About Page
        </Typography>
    );
}

function App() {
    return (
        <>
            <CssBaseline/>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        My React App
                    </Typography>
                    <Link to="/" style={{ color: 'inherit', textDecoration: 'none', padding: '0 10px' }}>Home</Link>
                    <Link to="/about"
                          style={{ color: 'inherit', textDecoration: 'none', padding: '0 10px' }}>About</Link>
                </Toolbar>
            </AppBar>
            <Container maxWidth="md">
                <Paper style={{ margin: '24px 0', padding: '20px' }}>
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/about" element={<About/>}/>
                    </Routes>
                </Paper>
            </Container>
        </>
    );
}

export default App;
