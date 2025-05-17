import { Box, Grid } from "@mui/material";
import BalanceCard from "./cards/BalanceCard";
import TransactionsTable from "./cards/RecentTransactions";
import Reminders from "./cards/Reminders";
export default function Dashboard() {
  return (
    <Box>
      <BalanceCard />
        <Grid container spacing={2} sx={{mt: 2}}>
          <TransactionsTable />
          <Reminders />
        </Grid>
    </Box>
  );
}
