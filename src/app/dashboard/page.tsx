import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import StatCard from "@/components/dashboard/StatCard";
import TransactionChart from "@/components/dashboard/TransactionChart";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";

// MOCK DATA FETCHING
// In a real app, this would be a direct database call using Supabase Admin Client
async function getDashboardData() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    stats: {
      totalUsers: 1250,
      activeSessions: 340,
      totalVolume: "$4.2M",
    },
    chartData: [
      { name: "Mon", amount: 4000 },
      { name: "Tue", amount: 3000 },
      { name: "Wed", amount: 2000 },
      { name: "Thu", amount: 2780 },
      { name: "Fri", amount: 1890 },
      { name: "Sat", amount: 2390 },
      { name: "Sun", amount: 3490 },
    ],
  };
}

export default async function DashboardPage() {
  // Fetch data on the server
  const data = await getDashboardData();

  return (
    <Box>
      {/* Grid Container
        spacing={3} adds consistent gaps between items
      */}
      <Grid container spacing={3}>
        {/* Stat Cards Row */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="Total Users"
            value={data.stats.totalUsers}
            icon={<PeopleAltIcon sx={{ color: "white" }} />}
            trend="+12% vs last month"
            trendColor="success.main"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="Active Sessions"
            value={data.stats.activeSessions}
            icon={<SwapHorizIcon sx={{ color: "white" }} />}
            trend="-5% vs yesterday"
            trendColor="error.main"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="Total Volume"
            value={data.stats.totalVolume}
            icon={<AttachMoneyIcon sx={{ color: "white" }} />}
          />
        </Grid>

        {/* Chart Row */}
        <Grid size={{ xs: 12 }}>
          {/* Pass the server-fetched data to the client component */}
          <TransactionChart data={data.chartData} />
        </Grid>
      </Grid>
    </Box>
  );
}
