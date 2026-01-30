import Chip from "@mui/material/Chip";

// Define strict types for status to prevent typos across the app
// This matches the UserData interface we defined earlier
export type StatusType = "Active" | "Banned" | "Pending" | string;

interface StatusBadgeProps {
  status: StatusType;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  // Centralized color logic
  let color:
    | "default"
    | "primary"
    | "secondary"
    | "error"
    | "success"
    | "warning" = "default";

  switch (status) {
    case "Active":
      color = "success";
      break;
    case "Banned":
      color = "error";
      break;
    case "Pending":
      color = "warning";
      break;
    default:
      color = "default";
  }

  return (
    <Chip
      label={status}
      color={color}
      size="small"
      variant="outlined"
      sx={{ fontWeight: 500 }}
    />
  );
}
