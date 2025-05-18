import Expenses from "./cards/ExpensesTable";
import {
  Grid,
  Box,
  Typography,
  Breadcrumbs,
  Link as MuiLink,
} from "@mui/material";
import { Link } from "react-router-dom";
import IncomeTable from "./cards/IncomeTable";
export default function Transactions() {
  return (
    <Box>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <MuiLink
          component={Link}
          to="/"
          underline="hover"
          color="inherit"
          sx={{ display: "flex", alignItems: "center" }}
        >
          Home
        </MuiLink>

        <Typography
          color="text.primary"
          sx={{ display: "flex", alignItems: "center" }}
        >
          Transactions
        </Typography>
      </Breadcrumbs>

      <Grid container
        columnSpacing={{ xs: 2, sm: 2, md: 3, lg: 3, xl: 3 }}
        rowSpacing={{ xs: 2, sm: 2, md: 3, lg: 3, xl: 3 }}
      >
        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 6 }}>
          <Expenses />
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12  , xl: 6 }}>
          <IncomeTable />
        </Grid>
      </Grid>
    </Box>
  );
}
