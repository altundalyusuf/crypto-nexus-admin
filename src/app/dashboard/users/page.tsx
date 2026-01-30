import Typography from "@mui/material/Typography";
import UsersTable from "@/components/users/UsersTable";
import Box from "@mui/material/Box";

export default function UsersPage() {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        User Management
      </Typography>

      {/* The Complex Client Component */}
      <UsersTable />
    </Box>
  );
}
