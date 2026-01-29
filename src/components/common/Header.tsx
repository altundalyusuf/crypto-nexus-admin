"use client";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

export default function Header() {
  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} // For keeping the header above the sidebar
    >
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Crypto Nexus Admin
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
