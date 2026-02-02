import { Box, LinearProgress } from "@mui/material";

function CustomLoadingOverlay() {
  return (
    <Box sx={{ width: "100%" }}>
      <LinearProgress />
    </Box>
  );
}

export default CustomLoadingOverlay;
