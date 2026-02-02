import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import StatCard from "@/components/dashboard/StatCard";
import TransactionChart from "@/components/dashboard/TransactionChart";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import CryptoMarketTable from "@/components/dashboard/CryptoMarketTable";
import { getUsersFromServer } from "@/app/actions/getUsers"; // REAL DATA ACTION

// MOCK DATA FETCHING (Only for metrics we don't have a backend for)
// We keep this because we don't have a real 'Transaction' database yet.
async function getSimulatedMetrics() {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    activeSessions: 340, // Supabase doesn't provide realtime active session count easily
    totalVolume: "$4.2M", // We don't have a transaction ledger
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
  // 1. Fetch REAL User Data from Supabase
  const users = await getUsersFromServer();
  const realUserCount = users.length;

  // 2. Fetch Simulated Data (for charts/volume)
  const metrics = await getSimulatedMetrics();

  return (
    <Box>
      {/* Grid Container
        spacing={3} adds consistent gaps between items
      */}
      <Grid container spacing={3}>
        {/* 1. REAL DATA: Total Users */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="Total Users"
            value={realUserCount} // Connected to Real Supabase Data!
            icon={<PeopleAltIcon sx={{ color: "white" }} />}
            trend="+100% Real"
            trendColor="success.main"
          />
        </Grid>

        {/* 2. SIMULATED: Active Sessions */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="Active Sessions"
            value={metrics.activeSessions}
            icon={<SwapHorizIcon sx={{ color: "white" }} />}
            trend="-5% vs yesterday"
            trendColor="error.main"
          />
        </Grid>

        {/* 3. SIMULATED: Total Volume */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="Total Volume"
            value={metrics.totalVolume}
            icon={<AttachMoneyIcon sx={{ color: "white" }} />}
          />
        </Grid>

        {/* Chart Row (Simulated History) */}
        <Grid size={{ xs: 12 }}>
          {/* Pass the server-fetched data to the client component */}
          <TransactionChart data={metrics.chartData} />
        </Grid>

        {/* 4. REAL DATA: Market Table (Coinranking) */}
        <Grid size={{ xs: 12 }}>
          {/* Displays real-time data from Coinranking API */}
          <CryptoMarketTable />
        </Grid>
      </Grid>
    </Box>
  );
}
