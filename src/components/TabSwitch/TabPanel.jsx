import { Box, Typography } from "@mui/material";

export default function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
            {value === index && (
                // <Box sx={{ padding: "0px" }}>
                    <div>{children}</div>
                // </Box>
            )}
        </div>
    );
}
