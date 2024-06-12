import { Box, Pagination } from "@mui/material";
import React from "react";

export function CustomFooter({ pageNumber, pageSize, totalRows, handlePageChange, containerStyleProps }) {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                p: 1,
                ...containerStyleProps
            }}
        >
            {totalRows === 0 ? null : <span style={{ marginRight: 24 }}>{getFooterText(pageNumber, pageSize, totalRows)}</span>}
            <CustomPagination
                totalRows={totalRows}
                pageSize={pageSize}
                pageNumber={pageNumber}
                handlePageChange={handlePageChange}/>
        </Box>
    );
}

export function getFooterText(pageNumber, pageSize, totalRows) {
    const currentPage = pageNumber + 1; // Add 1 to convert 0-based index to 1-based index
    const startRange = currentPage === 1 ? 1 : pageNumber * pageSize + 1;
    const endRange =
        currentPage * pageSize < totalRows
            ? currentPage * pageSize
            : totalRows;
    return <span className={'subtitle-m'}>{`Showing `}{<strong>{`${startRange} - ${endRange}`}</strong>}{` of ${totalRows}`}</span>;
}

export function CustomPagination({ totalRows, pageSize, pageNumber, handlePageChange }) {
    return (
        <Pagination
            count={Math.ceil(totalRows / pageSize)}
            page={pageNumber + 1} // Adjust to 1-based indexing
            onChange={(event, newPage) => handlePageChange(newPage - 1)} // Adjust back to 0-based indexing
            size={"medium"} // Optional: Adjust size as needed
            showFirstButton // Show the "first" button
            showLastButton // Show the "last" button
            showFirstLastPageButtons // Show the "previous" and "next" buttons
            sx={{
                ".Mui-selected": {
                    backgroundColor: "var(--main-secondary) !important", // Set the circle color to purple
                    color: "var(--main-primary) !important"
                },
            }}
        />
    );
}

export function getSortedHeaderClass(sortModel, field) {
    if (!sortModel || sortModel.length === 0) {
        return '';
    }
    if (sortModel[0].field === field) {
        return 'sorted-header-special';
    }
    return '';
}