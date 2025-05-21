import { Box, Grid, Breadcrumbs, Typography } from "@mui/material";
import BalanceCard from "./cards/BalanceCard";
import TotalIncomeCard from "./cards/TotalIncomeCard";
import TotalExpenseCard from "./cards/TotalExpenseCard";
import RecentTransactions from "./content/RecentTransactions";
import Reminders from "./content/Reminders";
import Budgeting from "./content/Budgeting";
export default function Dashboard() {
  return (
    <Box>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Typography
          color="text.primary"
          sx={{ display: "flex", alignItems: "center" }}
        >
          Dashboard
        </Typography>
      </Breadcrumbs>

      <Grid
        container
        sx={{
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
        columnSpacing={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1 }}
        rowSpacing={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1 }}
      >
        <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 4 }}>
          <BalanceCard />
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 4 }}>
          <TotalExpenseCard />
        </Grid>

        <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 4 }}>
          <TotalIncomeCard />
        </Grid>
      </Grid>

      <Grid
        container
        columnSpacing={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1 }}
        rowSpacing={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1 }}
        sx={{ mt: 2 }}
      >
        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 4, xl: 4 }}>
          <Budgeting />
        </Grid>

        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 4, xl: 4 }}>
          <RecentTransactions />
        </Grid>

        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 4, xl: 4 }}>
          <Reminders />
        </Grid>
      </Grid>
    </Box>
  );
}
