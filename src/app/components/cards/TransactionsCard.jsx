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
  Modal,
  Box,
  TextField,
  MenuItem,
  Grid,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTransactions } from "../../../hooks/useTransactions";
import { useAddTransaction } from "../../../hooks/useAddTransaction";
import { useEditTransaction } from "../../../hooks/useEditTransaction";
import { useDeleteTransaction } from "../../../hooks/useDeleteTransaction";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "30%",
  maxHeight: "80vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 3,
};

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
        <Typography variant="h6">My Transactions</Typography>
        <Button variant="contained" onClick={openAddModal}>
          Add Transaction
        </Button>
      </Box>

      <TextField
        label="Search transactions"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <TableContainer component={Paper} sx={{ maxHeight: 300, borderRadius: 2, boxShadow: 3, overflowY: "auto" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell>
                <strong>Title</strong>
              </TableCell>
              <TableCell>
                <strong>Amount</strong>
              </TableCell>
              <TableCell>
                <strong>Category</strong>
              </TableCell>
              <TableCell>
                <strong>Description</strong>
              </TableCell>
              <TableCell>
                <strong>Account</strong>
              </TableCell>
              <TableCell>
                <strong>Date</strong>
              </TableCell>
              <TableCell>
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
                  backgroundColor: index % 2 === 0 ? "white" : "#fafafa",
                  transition: "background-color 0.3s",
                  "&:hover": { backgroundColor: "#e0f7fa" },
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

      {/* Merged Add/Edit Modal */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box component="form" sx={modalStyle} onSubmit={handleSubmit}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6">
              {selectedTransaction ? "Edit Transaction" : "Add Transaction"}
            </Typography>
            <IconButton aria-label="close" onClick={handleCloseModal}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Grid container spacing={2}>
            <Grid size={6}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={form.title || ""}
                onChange={handleFormChange}
                required
                margin="normal"
              />
            </Grid>
            <Grid size={6}>
              <TextField
                fullWidth
                label="Amount"
                name="amount"
                type="number"
                value={form.amount || ""}
                onChange={handleFormChange}
                required
                margin="normal"
              />
            </Grid>
            <Grid size={6}>
              <TextField
                fullWidth
                label="Category"
                name="category"
                value={form.category || ""}
                onChange={handleFormChange}
                required
                margin="normal"
              />
            </Grid>
            <Grid size={6}>
              <TextField
                fullWidth
                select
                label="Account"
                name="account"
                value={form.account || ""}
                onChange={handleFormChange}
                required
                margin="normal"
              >
                <MenuItem value="Cash">Cash</MenuItem>
                <MenuItem value="Gcash">Gcash</MenuItem>
                <MenuItem value="Credit">Credit</MenuItem>
              </TextField>
            </Grid>
            <Grid size={6}>
              <TextField
                fullWidth
                select
                label="Type"
                name="type"
                value={form.type || ""}
                onChange={handleFormChange}
                required
                margin="normal"
              >
                <MenuItem value="income">Income</MenuItem>
                <MenuItem value="expense">Expense</MenuItem>
              </TextField>
            </Grid>
            <Grid size={6}>
              <TextField
                fullWidth
                name="date"
                type="date"
                value={form.date || ""}
                onChange={handleFormChange}
                margin="normal"
                placeholder="Date"
                required
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={form.description || ""}
                onChange={handleFormChange}
                margin="normal"
                multiline
                minRows={4}
                required
              />
            </Grid>
          </Grid>

          <Grid>
            <Button
              type="submit"
              variant="contained"
              sx={{ mt: 2 }}
              fullWidth
              disabled={loading}
              startIcon={
                loading ? <CircularProgress size={20} color="inherit" /> : null
              }
            >
              {selectedTransaction ? "Save" : "Add"}
            </Button>

            {selectedTransaction && (
              <Button
                onClick={handleDelete}
                variant="contained"
                color="secondary"
                sx={{ mt: 2 }}
                fullWidth
                disabled={loading}
                startIcon={
                  loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : null
                }
              >
                Delete
              </Button>
            )}
          </Grid>
        </Box>
      </Modal>
    </Box>
  );
}

export default TransactionTable;
