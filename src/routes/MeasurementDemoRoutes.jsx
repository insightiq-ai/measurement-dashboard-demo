import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { PerformancePage } from "../pages";
import UserJourneyPage from "../pages/UserJourneyPage/UserJourneyPage";
import LoginPage from "../pages/LoginPage/LoginPage"; // Ensure LoginPage is correctly imported

const RequireAuth = ({ children }) => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default function MeasurementDemoRoutes() {
    return (
        <>
            <Routes>
                <Route path="login" element={<LoginPage />} />
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="home" element={<RequireAuth><PerformancePage /></RequireAuth>} />
                <Route path="user-journey/:userId" element={<RequireAuth><UserJourneyPage /></RequireAuth>} />
                <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
        </>
    );
}
