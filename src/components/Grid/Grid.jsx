import { Colors } from "../../styles/colors";
import { CustomFooter } from "../../utils/DataGridUtils";
import { DataGrid } from "@mui/x-data-grid";
import './Grid.scss';

export default function Grid({ gridProps }) {
    const {
        rowCount,
        rows,
        page,
        sortModel,
        onPageChange,
        pageSize,
        customProps,
        getRowHeight,
    } = gridProps;
    const { noDataMessage } = customProps || {};
    const allowedSorts = ["desc", "asc"];
    // Base height for headers, footers, etc.
    const baseHeight = 128;
    // Set at least 1 row height
    const totalRowHeight = Math.max(rows.length, 1) * getRowHeight();
    const totalGridHeight = totalRowHeight + baseHeight;
    // It shows a maximum of 10 rows
    const maxHeight = (10 * getRowHeight()) + baseHeight;
    // Determine the actual height of the DataGrid
    const dataGridHeight = Math.min(totalGridHeight, maxHeight);

    return (
        <div className={"grid-container"}
             // style={{ height: `${dataGridHeight}px` }}
        >
            <DataGrid
                className={"mui-data-grid"}
                components={{
                    Footer: (props) => <CustomFooter totalRows={rowCount} pageSize={pageSize}
                                                     handlePageChange={onPageChange} pageNumber={page}/>,
                }}
                disableColumnMenu
                disableSelectionOnClick
                getRowId={(row) => row.id}
                initialState={{
                    sorting: { sortModel },
                }}
                pagination
                paginationMode={"server"}
                sortingMode={"server"}
                sortingOrder={allowedSorts}
                sx={{
                    '& .hideRightSeparator > .MuiDataGrid-columnSeparator': {
                        display: 'none',
                    }
                }}
                localeText={{
                    noRowsLabel: (
                        <span className={"body-m"} style={{ color: Colors.neutralsSecondaryGrey }}>
                            {noDataMessage || "No users found"}
                        </span>
                    ),
                }}
                {...gridProps}
            />
        </div>
    )
}
