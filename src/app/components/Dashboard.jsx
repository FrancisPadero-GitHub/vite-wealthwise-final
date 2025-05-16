import { Box } from "@mui/material";
import BalanceCard from "./cards/balance";
import Transactions from "./cards/transactions"; // Adjust the path based on your folder structure

export default function Dashboard() {
  return (
    <Box >
      <BalanceCard />
      <Box sx={{ mt: 4 }}>
        <Transactions />
      </Box>
    </Box>
  );
}
