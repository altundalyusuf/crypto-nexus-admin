"use client"; // Recharts works on the client side

import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/material";

// Define the shape of data prop
interface ChartData {
  name: string;
  amount: number;
}

export default function TransactionChart({ data }: { data: ChartData[] }) {
  const theme = useTheme();

  return (
    <Paper
      elevation={2}
      sx={{ p: 3, height: "400px", display: "flex", flexDirection: "column" }}
    >
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Transaction Volume (Last 7 Days)
      </Typography>

      {/* ResponsiveContainer ensures the chart adjusts to screen size */}
      <Box sx={{ flexGrow: 1, width: "100%", minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 16, right: 16, bottom: 0, left: 24 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={theme.palette.divider}
            />
            <XAxis
              dataKey="name"
              stroke={theme.palette.text.secondary}
              style={{ fontSize: "0.875rem" }}
            />
            <YAxis
              stroke={theme.palette.text.secondary}
              style={{ fontSize: "0.875rem" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
              }}
            />
            <Line
              type="monotone"
              dataKey="amount"
              stroke={theme.palette.primary.main}
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}
