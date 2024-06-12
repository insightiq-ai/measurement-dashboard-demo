import React, { useReducer } from 'react';
import { CssBaseline, Typography } from '@mui/material';
import PerformancePage from "./pages/PerformancePage/PerformancePage";
import { WarehouseContext } from "./storage/context/index";
import { DEFAULT_WAREHOUSE_STATE, warehouseReducer } from "./storage/reducers";

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
    const [warehouse, dispatchWarehouse] = useReducer(warehouseReducer, DEFAULT_WAREHOUSE_STATE);

    return (
        <div className={'div-app'}>
            <CssBaseline/>
            <WarehouseContext.Provider value={{ warehouse, dispatchWarehouse }}>
                <PerformancePage/>
            </WarehouseContext.Provider>
        </div>
    );
}

export default App;
