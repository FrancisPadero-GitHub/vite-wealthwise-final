import { Box, Grid, Breadcrumbs, Typography } from "@mui/material";
import BalanceCard from "./cards/BalanceCard";
import RecentTransactions from "./content/RecentTransactions";
import Reminders from "./content/Reminders";
import TotalIncomeCard from "./cards/TotalIncomeCard";
import TotalExpenseCard from "./cards/TotalExpenseCard";
import BudgetingCard from "./cards/BudgetingCard";
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
        columnSpacing={{ xs: 2, sm: 2, md: 2, lg: 2, xl: 2 }}
        rowSpacing={{ xs: 2, sm: 2, md: 2, lg: 2, xl: 3 }}
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
        columnSpacing={{ xs: 2, sm: 2, md: 2, lg: 2, xl: 2 }}
        rowSpacing={{ xs: 2, sm: 2, md: 2, lg: 2, xl: 3 }}
        sx={{ mt: 2 }}
      >
        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
          <BudgetingCard />
        </Grid>

        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 6 }}>
          <RecentTransactions />
        </Grid>

        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 6 }}>
          <Reminders />
        </Grid>
      </Grid>
    </Box>
  );
}
