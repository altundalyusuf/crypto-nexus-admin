import * as React from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode; // Icon can be any React component
  trend?: string; // Optional: e.g., "+5% vs last week"
  trendColor?: "success.main" | "error.main";
}

export default function StatCard({
  title,
  value,
  icon,
  trend,
  trendColor,
}: StatCardProps) {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-between",
        // Hover effect for better UX
        transition: "transform 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 4,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 2,
        }}
      >
        <Typography
          color="text.secondary"
          variant="subtitle2"
          sx={{ fontWeight: "bold" }}
        >
          {title.toUpperCase()}
        </Typography>
        <Box
          sx={{
            color: "primary.main",
            p: 1,
            borderRadius: 1,
            bgcolor: "primary.light",
            opacity: 0.8,
          }}
        >
          {/* Clone the icon to enforce color if needed, or wrap in a Box */}
          {icon}
        </Box>
      </Box>

      <Typography
        variant="h4"
        component="div"
        sx={{ fontWeight: "bold", mb: 1 }}
      >
        {value}
      </Typography>

      {trend && (
        <Typography variant="body2" color={trendColor || "text.secondary"}>
          {trend}
        </Typography>
      )}
    </Paper>
  );
}
