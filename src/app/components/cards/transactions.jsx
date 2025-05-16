import { useTransactions } from "../../../hooks/useTransactions"; // adjust path if needed
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
} from "@mui/material";

function TransactionTable() {
  const { data: transactions, isLoading, error } = useTransactions();

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography color="error">{error.message}</Typography>;

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Account</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Type</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((tx) => (
            <TableRow key={tx.id}>
              <TableCell>{tx.title}</TableCell>
              <TableCell>{tx.amount}</TableCell>
              <TableCell>{tx.category}</TableCell>
              <TableCell>{tx.account}</TableCell>
              <TableCell>{tx.date}</TableCell>
              <TableCell>{tx.type}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TransactionTable;
