import React from "react";
import { DEFAULT_WAREHOUSE_STATE } from "../reducers";

const WarehouseContext = React.createContext({
  warehouse: DEFAULT_WAREHOUSE_STATE,
  dispatchWarehouse: () => {},
});

export const WarehouseContextProvider = WarehouseContext.Provider;
export default WarehouseContext;
