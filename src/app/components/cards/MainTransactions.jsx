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
  Button,
  Box,
  TextField,
  useTheme,
} from "@mui/material";
import { useTransactions } from "../../../hooks/useTransactions";
import { useAddTransaction } from "../../../hooks/useAddTransaction";
import { useEditTransaction } from "../../../hooks/useEditTransaction";
import { useDeleteTransaction } from "../../../hooks/useDeleteTransaction";
import TransactionFormModal from "../TransactionFormModal";

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
  const theme = useTheme();
  const [loading, setLoading] = useState(false);

  const { data: transactions, isLoading, error } = useTransactions();
  const { mutateAsync: addTransaction } = useAddTransaction();
  const { mutateAsync: editTransaction } = useEditTransaction();
  const { mutate: deleteTransaction } = useDeleteTransaction();

  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(defaultFormValues);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const openAddModal = useCallback(() => {
    setSelectedTransaction(null);
    setForm(defaultFormValues);
    setModalOpen(true);
  }, []);

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
      deleteTransaction(selectedTransaction.id);
      handleCloseModal();
    }
  }, [deleteTransaction, selectedTransaction, handleCloseModal]);

  const filteredTransactions =
    transactions?.filter((tx) =>
      [
        tx.title,
        tx.category,
        tx.description,
        tx.account,
        tx.date,
        tx.type,
        tx.amount.toString(),
      ].some((field) => field.toLowerCase().includes(searchQuery.toLowerCase()))
    ) || [];

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography color="error">{error.message}</Typography>;

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6">💸 My Transactions</Typography>
        <Button variant="contained" onClick={openAddModal}>
          Add Transaction
        </Button>
      </Box>

      <TextField
        label="🔍 Search transactions"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <TableContainer
        component={Paper}
        sx={{
          maxHeight: 650,
          borderRadius: 2,
          boxShadow: 3,
          overflowY: "auto",
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.05)"
                    : "#f5f5f5",
              }}
            >
              <TableCell sx={{ color: theme.palette.text.primary }}>
                <strong>Title</strong>
              </TableCell>
              <TableCell sx={{ color: theme.palette.text.primary }}>
                <strong>Amount</strong>
              </TableCell>
              <TableCell sx={{ color: theme.palette.text.primary }}>
                <strong>Category</strong>
              </TableCell>
              <TableCell sx={{ color: theme.palette.text.primary }}>
                <strong>Description</strong>
              </TableCell>
              <TableCell sx={{ color: theme.palette.text.primary }}>
                <strong>Account</strong>
              </TableCell>
              <TableCell sx={{ color: theme.palette.text.primary }}>
                <strong>Date</strong>
              </TableCell>
              <TableCell sx={{ color: theme.palette.text.primary }}>
                <strong>Type</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTransactions.map((tx, index) => (
              <TableRow
                key={tx.id}
                hover
                onClick={() => openEditModal(tx)}
                sx={{
                  cursor: "pointer",
                  backgroundColor:
                    index % 2 === 0
                      ? theme.palette.background.paper
                      : theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.05)"
                      : "#fafafa",
                  transition: "background-color 0.3s",
                  "&:hover": {
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.1)"
                        : "#e0f7fa",
                  },
                  "& td": {
                    color: theme.palette.text.primary,
                  },
                }}
              >
                <TableCell>{tx.title}</TableCell>
                <TableCell>{tx.amount}</TableCell>
                <TableCell>{tx.category}</TableCell>
                <TableCell>{tx.description}</TableCell>
                <TableCell>{tx.account}</TableCell>
                <TableCell>{tx.date}</TableCell>
                <TableCell>{tx.type}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
  );
}

export default TransactionTable;
