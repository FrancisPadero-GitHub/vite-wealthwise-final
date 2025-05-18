import { useTransactions } from "../../../hooks/useTransactions";
import { PieChart } from "@mui/x-charts";
import { Box, Typography, Paper, useTheme, useMediaQuery } from "@mui/material";

export default function ExpenseChart() {
  const { data: transactions, isLoading, error } = useTransactions();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (isLoading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">Error loading data</Typography>;

  // Filter out income transactions and process expenses by category
  const categoryData = transactions
    .filter((transaction) => transaction.type !== "income")
    .reduce((acc, transaction) => {
      const category = transaction.category || "Uncategorized";
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += transaction.amount;
      return acc;
    }, {});

  // Convert to format needed for pie chart
  const pieChartData = Object.entries(categoryData).map(
    ([category, amount]) => ({
      id: category,
      value: amount,
      label: category,
    })
  );

  // Calculate total expenses
  const totalExpenses = Object.values(categoryData).reduce(
    (sum, amount) => sum + amount,
    0
  );

  return (
    <Paper
      elevation={2}
      sx={{
        p: { xs: 2, sm: 3 },
        height: { xs: "90%", sm: "90%", md: "90%", lg: "90%", xl: "91%" },
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h6" gutterBottom>
        📊 Expenses Distribution
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          flex: 1,
          justifyContent: "center",
          width: "100%",
          overflow: "hidden",
        }}
      >
        <PieChart
          series={[
            {
              innerRadius: isMobile ? 50 : 70,
              data: pieChartData,
              highlightScope: { faded: "global", highlighted: "item" },
              faded: { innerRadius: 30, additionalRadius: -30 },
            },
          ]}
          height={isMobile ? 250 : 300}
          margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
          slotProps={{
            legend: {
              direction: isMobile ? "row" : "column",
              position: {
                vertical: "middle",
                horizontal: isMobile ? "bottom" : "right",
              },
              padding: 0,
            },
          }}
        />
        <Typography
          variant="body1"
          sx={{
            mt: 2,
            color: "#ff771d",
            textAlign: "center",
            width: "100%",
          }}
        >
          Total Expenses: ₱ {totalExpenses.toFixed(2)}
        </Typography>
      </Box>
    </Paper>
  );
}
