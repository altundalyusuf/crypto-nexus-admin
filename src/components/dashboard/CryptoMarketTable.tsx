"use client";

import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchMarketData, Coin } from "@/store/slices/marketSlice";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import CustomLoadingOverlay from "@/components/common/CustomLoadingOverlay";

export default function CryptoMarketTable() {
  const dispatch = useAppDispatch();
  const { coins, status } = useAppSelector((state) => state.market);

  // Fetch data on mount
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchMarketData());
    }
  }, [status, dispatch]);

  // Define Table Columns (useMemo for performance)
  const columns: GridColDef<Coin>[] = useMemo(
    () => [
      {
        field: "rank",
        headerName: "#",
        width: 60,
        // Sıralama numarasını ortalayalım
        align: "center",
        headerAlign: "center",
      },
      {
        field: "name",
        headerName: "Coin",
        width: 240,
        renderCell: (params: GridRenderCellParams<Coin, string>) => {
          const coin = params.row;
          return (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                height: "100%",
              }}
            >
              <Avatar
                src={coin.iconUrl}
                alt={coin.name}
                sx={{ width: 32, height: 32, bgcolor: "transparent" }}
                imgProps={{ style: { objectFit: "contain" } }}
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Typography variant="body2" fontWeight="600" lineHeight={1.2}>
                  {coin.name}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  lineHeight={1.2}
                >
                  {coin.symbol}
                </Typography>
              </Box>
            </Box>
          );
        },
      },
      {
        field: "price",
        headerName: "Price (USD)",
        width: 150,
        valueFormatter: (value: string | number) => {
          if (!value) return "$0.00";
          const price = typeof value === "string" ? parseFloat(value) : value;

          return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(price);
        },
      },
      {
        field: "change",
        headerName: "24h Change",
        width: 130,
        renderCell: (params: GridRenderCellParams<Coin, string | number>) => {
          const rawValue = params.value;
          const change =
            typeof rawValue === "string"
              ? parseFloat(rawValue)
              : Number(rawValue);

          if (isNaN(change)) return <span>-</span>;

          const isPositive = change > 0;
          return (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                height: "100%",
                color: isPositive ? "success.main" : "error.main",
              }}
            >
              <Typography variant="body2" fontWeight="bold">
                {isPositive ? "+" : ""}
                {change}%
              </Typography>
            </Box>
          );
        },
      },
      {
        field: "marketCap",
        headerName: "Market Cap",
        width: 180,
        valueFormatter: (value: string | number) => {
          if (!value) return "-";
          const cap = typeof value === "string" ? parseFloat(value) : value;

          return new Intl.NumberFormat("en-US", {
            notation: "compact",
            compactDisplay: "short",
            maximumFractionDigits: 1,
          }).format(cap);
        },
      },
    ],
    [],
  );

  return (
    <Paper sx={{ width: "100%", p: 2, mt: 3 }}>
      <Typography variant="h6" component="h2" gutterBottom>
        Live Market Data (Top 10)
      </Typography>

      <Box sx={{ height: 650, width: "100%" }}>
        {" "}
        <DataGrid
          rows={coins}
          getRowId={(row) => row.uuid}
          columns={columns}
          loading={status === "loading"}
          rowHeight={72}
          slots={{
            loadingOverlay: CustomLoadingOverlay,
          }}
          disableRowSelectionOnClick
          hideFooter
          sx={{
            border: 0,
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid #f0f0f0",
            },
            "& .MuiDataGrid-columnHeaders": {
              borderBottom: "2px solid #e0e0e0",
              backgroundColor: "#f9fafb",
            },
          }}
        />
      </Box>
    </Paper>
  );
}
