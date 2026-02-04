"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchUsers,
  setSearchQuery,
  updateUserStatusInStore,
  UserData,
} from "@/store/slices/userSlice";
import { toggleUserBanStatus } from "@/app/actions/userActions";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import StatusBadge from "@/components/common/StatusBadge";
import CustomLoadingOverlay from "../common/CustomLoadingOverlay";
import { Alert, Snackbar } from "@mui/material";

// UI Imports
import Button from "@mui/material/Button";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function UsersTable() {
  const dispatch = useAppDispatch();
  const { filteredUsers, status, searchQuery } = useAppSelector(
    (state) => state.users,
  );

  // Local state for feedback
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

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

  // 1. FIX: Wrap handleToggleBan with useCallback to make it stable across renders
  const handleToggleBan = useCallback(
    async (userId: string, currentStatus: string) => {
      const isBanned = currentStatus === "Banned";
      const shouldBan = !isBanned;

      setActionLoading(userId);

      // Call Server Action
      const result = await toggleUserBanStatus(userId, shouldBan);

      if (result.success) {
        setToast({ open: true, message: result.message, severity: "success" });
        dispatch(
          updateUserStatusInStore({
            userId,
            status: shouldBan ? "Banned" : "Active",
          }),
        );
      } else {
        setToast({ open: true, message: result.message, severity: "error" });
        dispatch(fetchUsers());
      }

      setActionLoading(null);
    },
    [dispatch],
  ); // Dispatch is stable but linter likes it listed

  const columns: GridColDef<UserData>[] = useMemo(
    () => [
      { field: "id", headerName: "ID", width: 90 },
      { field: "fullName", headerName: "Full Name", width: 200 },
      { field: "email", headerName: "Email", width: 250 },
      {
        field: "status",
        headerName: "Status",
        width: 150,
        renderCell: (params: GridRenderCellParams<UserData, string>) => {
          return <StatusBadge status={params.value as string} />;
        },
      },
      {
        field: "lastLogin",
        headerName: "Last Login",
        width: 220,
        valueFormatter: (value: string | null) => {
          if (!value) return "";
          return new Date(value).toLocaleString();
        },
      },
      {
        field: "actions",
        headerName: "Actions",
        width: 150,
        sortable: false,
        valueGetter: (_value: unknown, row: UserData) => {
          return row.status;
        },
        renderCell: (params: GridRenderCellParams<UserData>) => {
          const user = params.row;
          const isBanned = user.status === "Banned";
          const isLoading = actionLoading === user.id;

          return (
            <Button
              key={`${user.id}-${user.status}`}
              variant="contained"
              color={isBanned ? "success" : "error"}
              size="small"
              startIcon={isBanned ? <CheckCircleIcon /> : <BlockIcon />}
              onClick={(e) => {
                e.stopPropagation();
                handleToggleBan(user.id, user.status);
              }}
              disabled={isLoading}
              sx={{ textTransform: "none" }}
            >
              {isLoading ? "Wait..." : isBanned ? "Unban" : "Ban"}
            </Button>
          );
        },
      },
    ],
    [actionLoading, handleToggleBan],
  );

  return (
    <Paper sx={{ width: "100%", p: 2 }}>
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
          checkboxSelection={false}
          disableRowSelectionOnClick
        />
      </Box>

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast({ ...toast, open: false })}
      >
        <Alert severity={toast.severity} sx={{ width: "100%" }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
}
