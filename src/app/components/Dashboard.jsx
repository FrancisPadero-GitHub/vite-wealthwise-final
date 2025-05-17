import { Box, Grid } from "@mui/material";
import BalanceCard from "./cards/BalanceCard";
import TransactionsTable from "./cards/RecentTransactions";
import Reminders from "./cards/Reminders";
export default function Dashboard() {
  return (
    <Box>
      <BalanceCard />
      <Box sx={{ mt: 4 }}>
        <Grid container spacing={2}>
          <TransactionsTable />
          <Reminders />
        </Grid>
      </Box>
    </Box>
  );
}
