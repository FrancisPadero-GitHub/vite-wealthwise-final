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
  const [loading, setLoading] = useState(false);

  const { data: transactions, isLoading, error } = useTransactions();
  const { mutateAsync: addTransaction } = useAddTransaction();
  const { mutateAsync: editTransaction } = useEditTransaction();
  const { mutate: deleteTransaction } = useDeleteTransaction();

  const [searchQuery, setSearchQuery] = useState("");
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
      deleteTransaction(selectedTransaction.id);
      handleCloseModal();
    }
  }, [deleteTransaction, selectedTransaction, handleCloseModal]);

  const filteredTransactions =
    transactions?.filter(
      (tx) =>
        tx.type === "expense" &&
        [
          tx.title,
          tx.category,
          tx.description,
          tx.account,
          tx.date,
          tx.amount.toString(),
        ].some((field) =>
          field.toLowerCase().includes(searchQuery.toLowerCase())
        )
    ) || [];

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography color="error">{error.message}</Typography>;

  return (
    <Box sx={{ gap: 2}}>
      <Paper
        sx={{
          maxHeight: 650,
          overflowY: "auto",
          borderRadius: 2,
          boxShadow: 2,
          p: 2,
        }}
      >
        <Typography variant="h6">💸 Expenses</Typography>
        <TextField
          label="🔍 Search transactions"
          variant="standard"
          margin="normal"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 2,
            overflowY: "auto",
            backgroundColor: "#fff",
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
                      Found Nothing
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
                        backgroundColor: "#e0f7fa",
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
                      <Chip label={tx.type} size="small" color="error" />
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
  );
}

export default TransactionTable;
