import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Header from "@/components/common/Header";
import Sidebar from "@/components/common/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ display: "flex" }}>
      {/* Global Header Component
        Fixed position at the top of the dashboard
      */}
      <Header />

      {/* Sidebar Navigation Component
        Fixed width drawer on the left side
      */}
      <Sidebar />

      {/* Main Content Area 
        This is where the page content (children) will be rendered
      */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {/* Toolbar spacer to prevent content from being hidden behind the fixed Header */}
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
