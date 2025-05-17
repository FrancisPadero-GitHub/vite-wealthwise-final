import { Box, Grid } from "@mui/material";
import BalanceCard from "./cards/BalanceCard";
import TransactionsTable from "./cards/RecentTransactions";

export default function Dashboard() {
  return (
    <Box>

      <BalanceCard />
      <Box sx={{ mt: 4 }}>
        <Grid container spacing={2}>
          <TransactionsTable />
        </Grid>
      </Box>
    </Box>
  );
}
