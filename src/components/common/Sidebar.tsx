"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { logoutUser } from "@/store/slices/authSlice";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import ExitToAppIcon from "@mui/icons-material/ExitToApp"; // Import Logout Icon
import Box from "@mui/material/Box";
import Link from "next/link";

const drawerWidth = 240;

export default function Sidebar() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    // 1. Dispatch the logout action to clear Redux state and Supabase session
    await dispatch(logoutUser());

    // 2. Redirect to the login page
    router.push("/");
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          display: "flex", // Enable flexbox layout
          flexDirection: "column", // Stack items vertically
        },
      }}
    >
      <Toolbar />

      {/* Navigation Links */}
      <Box sx={{ overflow: "auto" }}>
        <List>
          <ListItem disablePadding>
            <ListItemButton component={Link} href="/dashboard">
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} href="/dashboard/users">
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary="Users" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>

      {/* Spacer to push the Logout button to the bottom */}
      <Box sx={{ flexGrow: 1 }} />

      {/* Logout Section */}
      <Box>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                {/* Error color indicates an exit/destructive action */}
                <ExitToAppIcon color="error" />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
}
