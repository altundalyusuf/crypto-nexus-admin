"use client";

import React, { useEffect, useMemo } from "react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUsers, setSearchQuery } from "@/store/slices/userSlice";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import LinearProgress from "@mui/material/LinearProgress";
import StatusBadge from "@/components/common/StatusBadge";

// 1. Define the interface locally if not imported.
// This prevents "any" type usage and tells DataGrid what to expect.
interface UserRow {
  id: string;
  fullName: string;
  email: string;
  status: string;
  lastLogin: string | null;
}

export default function UsersTable() {
  const dispatch = useAppDispatch();
  // Using 'any' for filteredUsers momentarily if your slice type isn't exported,
  // but ideally, this should be typed in the selector.
  const { filteredUsers, status, searchQuery } = useAppSelector(
    (state) => state.users,
  );

  // Fetch users on mount
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchUsers());
    }
  }, [status, dispatch]);

  // Handle Search Input
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(event.target.value));
  };

  // Define Columns (Memoized for performance)
  // 2. Added Generic <UserRow> to GridColDef
  const columns: GridColDef<UserRow>[] = useMemo(
    () => [
      { field: "id", headerName: "ID", width: 90 },
      { field: "fullName", headerName: "Full Name", width: 200 },
      { field: "email", headerName: "Email", width: 250 },
      {
        field: "status",
        headerName: "Status",
        width: 150,
        // 3. Typed RenderCell: <RowType, ValueType>
        renderCell: (params: GridRenderCellParams<UserRow, string>) => {
          return <StatusBadge status={params.value as string} />;
        },
      },
      {
        field: "lastLogin",
        headerName: "Last Login",
        width: 220,
        // 4. CRITICAL FIX: valueFormatter now receives the value directly, not params.
        valueFormatter: (value: string | null) => {
          // Safe date formatting check
          if (!value) return "";
          return new Date(value).toLocaleString();
        },
      },
    ],
    [],
  );

  function CustomLoadingOverlay() {
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ width: "100%", p: 2 }}>
      {/* Search Bar connected to Redux */}
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Search Users"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Type name or email..."
        />
      </Box>

      {/* Loading State */}
      <Box sx={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={filteredUsers}
          columns={columns}
          loading={status === "loading"}
          slots={{
            loadingOverlay: CustomLoadingOverlay,
          }}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10, 20]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>
    </Paper>
  );
}
