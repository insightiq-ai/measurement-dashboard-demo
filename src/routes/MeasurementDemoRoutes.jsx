import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { PerformancePage } from "../pages";
import UserJourneyPage from "../pages/UserJourneyPage/UserJourneyPage";

export default function MeasurementDemoRoutes() {
    return (
        <>
            <Routes path="">
                <Route path="home" element={<PerformancePage />}/>
                <Route path="*" element={<Navigate to={'home'}/>}/>
                <Route path={"user-journey/:userId"} element={<UserJourneyPage />}/>
                <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
        </>
    );
}
