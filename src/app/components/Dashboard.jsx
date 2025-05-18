import { Box, Grid } from "@mui/material";
import BalanceCard from "./cards/BalanceCard";
import TransactionsTable from "./cards/RecentTransactions";
import Reminders from "./cards/Reminders";
export default function Dashboard() {
  return (
    <Box>
      <BalanceCard />
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
          <TransactionsTable />
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
          <Reminders />
        </Grid>
      </Grid>
    </Box>
  );
}
