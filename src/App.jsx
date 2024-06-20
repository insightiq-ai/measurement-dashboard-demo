import React from 'react';
import { CssBaseline } from '@mui/material';
import { Route, Routes } from "react-router-dom";
import MeasurementDemoRoutes from "./routes/MeasurementDemoRoutes";

function App() {
    return (
        <div className={'div-app'}>
            <CssBaseline/>
            <Routes>
                <Route path="*" element={<MeasurementDemoRoutes/>}/>
            </Routes>
        </div>
    );
}

export default App;
