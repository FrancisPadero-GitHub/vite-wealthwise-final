import React, { useState, useCallback } from "react";
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
  Box,
  TextField,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useTransactions } from "../../../hooks/useTransactions";
import { useAddTransaction } from "../../../hooks/useAddTransaction";
import { useEditTransaction } from "../../../hooks/useEditTransaction";
import { useDeleteTransaction } from "../../../hooks/useDeleteTransaction";
import TransactionFormModal from "./TransactionFormModal";
import TransactionRealtime from "../../../api/TransactionRealtime";
const defaultFormValues = {
  title: "",
  amount: "",
  category: "",
  type: "",
  account: "",
  date: "",
  description: "",
};

function TransactionTable() {
  const [loading, setLoading] = useState(false);

  const { data: transactions, isLoading, error } = useTransactions();
  const { mutateAsync: addTransaction } = useAddTransaction();
  const { mutateAsync: editTransaction } = useEditTransaction();
  const { deleteTransaction } = useDeleteTransaction();

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(defaultFormValues);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const openEditModal = useCallback((transaction) => {
    setSelectedTransaction(transaction);
    setForm(transaction);
    setModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setSelectedTransaction(null);
    setForm(defaultFormValues);
  }, []);

  const handleFormChange = useCallback((e) => {
    setForm((prevForm) => ({
      ...prevForm,
      [e.target.name]: e.target.value,
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
        if (selectedTransaction) {
          await editTransaction(form);
        } else {
          await addTransaction(form);
        }
        handleCloseModal();
      } catch (error) {
        console.error("Transaction failed:", error);
      } finally {
        setLoading(false);
      }
    },
    [
      selectedTransaction,
      form,
      addTransaction,
      editTransaction,
      handleCloseModal,
    ]
  );

  const handleDelete = useCallback(() => {
    if (selectedTransaction?.id) {
      deleteTransaction.mutateAsync(selectedTransaction.id);
      handleCloseModal();
    }
  }, [deleteTransaction, selectedTransaction, handleCloseModal]);

  const getUniqueYears = useCallback(() => {
    if (!transactions) return [];
    const years = transactions.map((tx) => new Date(tx.date).getFullYear());
    return ["all", ...new Set(years)].sort((a, b) => {
      if (a === "all") return -1;
      if (b === "all") return 1;
      return b - a;
    });
  }, [transactions]);

  const getMonthsForYear = useCallback(
    (year) => {
      if (!transactions || year === "all") return [];
      const months = transactions
        .filter((tx) => new Date(tx.date).getFullYear() === year)
        .map((tx) => new Date(tx.date).getMonth());
      return ["all", ...new Set(months)].sort((a, b) => {
        if (a === "all") return -1;
        if (b === "all") return 1;
        return a - b;
      });
    },
    [transactions]
  );

  const filteredTransactions =
    transactions?.filter((tx) => {
      const matchesType = typeFilter === "all" || tx.type === typeFilter;
      const matchesSearch = [
        tx.title,
        tx.category,
        tx.description,
        tx.account,
        tx.date,
        tx.amount.toString(),
      ].some((field) =>
        field.toLowerCase().includes(searchQuery.toLowerCase())
      );

      const txDate = new Date(tx.date);
      const matchesYear =
        yearFilter === "all" || txDate.getFullYear() === yearFilter;
      const matchesMonth =
        monthFilter === "all" || txDate.getMonth() === monthFilter;

      return matchesType && matchesSearch && matchesYear && matchesMonth;
    }) || [];

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography color="error">{error.message}</Typography>;

  return (
    <>
      <TransactionRealtime />
      <Box sx={{ gap: 2 }}>
        <Paper
          sx={{
            maxHeight: 650,
            display: "flex",
            flexDirection: "column",
            borderRadius: 2,
            boxShadow: 2,
            p: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6">💸 Transactions</Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <FormControl variant="standard" sx={{ minWidth: 120 }}>
                <InputLabel>Type</InputLabel>
                <Select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  label="Type"
                >
                  <MenuItem value="all">All Transactions</MenuItem>
                  <MenuItem value="income">Income</MenuItem>
                  <MenuItem value="expense">Expense</MenuItem>
                </Select>
              </FormControl>
              <FormControl variant="standard" sx={{ minWidth: 120 }}>
                <InputLabel>Year</InputLabel>
                <Select
                  value={yearFilter}
                  onChange={(e) => {
                    setYearFilter(e.target.value);
                    setMonthFilter("all"); // Reset month when year changes
                  }}
                  label="Year"
                >
                  {getUniqueYears().map((year) => (
                    <MenuItem key={year} value={year}>
                      {year === "all" ? "All Years" : year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl variant="standard" sx={{ minWidth: 120 }}>
                <InputLabel>Month</InputLabel>
                <Select
                  value={monthFilter}
                  onChange={(e) => setMonthFilter(e.target.value)}
                  label="Month"
                  disabled={yearFilter === "all"}
                >
                  {getMonthsForYear(yearFilter).map((month) => (
                    <MenuItem key={month} value={month}>
                      {month === "all"
                        ? "All Months"
                        : new Date(2000, month, 1).toLocaleDateString("en-US", {
                            month: "long",
                          })}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="🔍 Search transactions"
                variant="standard"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ width: 200 }}
              />
            </Box>
          </Box>
          <TableContainer
            component={Paper}
            sx={{
              flex: 1,
              overflowY: "auto",
              borderRadius: 2,
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell align="center">Amount</TableCell>
                  <TableCell align="center">Category</TableCell>
                  <TableCell align="center">Description</TableCell>
                  <TableCell align="center">Account</TableCell>
                  <TableCell align="center">Date</TableCell>
                  <TableCell align="right">Type</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        Click + to add a transaction on dashboard
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((tx, index) => (
                    <TableRow
                      key={tx.id}
                      hover
                      onClick={() => openEditModal(tx)}
                      sx={{
                        cursor: "pointer",
                        backgroundColor: index % 2 === 0 ? "#fff" : "#fafafa",
                        "&:hover": {
                          backgroundColor:
                            tx.type === "income" ? "#e8f5e9" : "#e0f7fa",
                        },
                      }}
                    >
                      <TableCell>{tx.title}</TableCell>
                      <TableCell align="center">{tx.amount}</TableCell>
                      <TableCell align="center">{tx.category}</TableCell>
                      <TableCell align="center">{tx.description}</TableCell>
                      <TableCell align="center">{tx.account}</TableCell>
                      <TableCell align="center">{tx.date}</TableCell>
                      <TableCell align="right">
                        <Chip
                          label={tx.type}
                          sx={{ fontSize: "0.7rem" }}
                          size="small"
                          color={tx.type === "income" ? "success" : "error"}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        <TransactionFormModal
          open={modalOpen}
          onClose={handleCloseModal}
          form={form}
          onFormChange={handleFormChange}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
          loading={loading}
          selectedTransaction={selectedTransaction}
        />
      </Box>
    </>
  );
}

export default TransactionTable;
