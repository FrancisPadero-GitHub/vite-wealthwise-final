import React, { useState, useCallback } from "react";
import {
  Chip,
  Typography,
  CircularProgress,
  Button,
  Modal,
  Box,
  TextField,
  MenuItem,
  Grid,
  IconButton,
  Card,
  CardContent,
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

export default function TransactionTable() {
  const [loading, setLoading] = useState(false);

  const { data: transactions, isLoading, error } = useTransactions();
  const { mutateAsync: addTransaction } = useAddTransaction();
  const { mutateAsync: editTransaction } = useEditTransaction();
  const { mutate: deleteTransaction } = useDeleteTransaction();

  const [searchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(defaultFormValues);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Open modal in Add mode (no selectedTransaction)
  const handleOpenAddModal = useCallback(() => {
    setSelectedTransaction(null);
    setForm(defaultFormValues);
    setModalOpen(true);
  }, []);

  // Open modal in Edit mode with existing transaction
  const handleOpenEditModal = useCallback((transaction) => {
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
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
  }, [selectedTransaction, deleteTransaction, handleCloseModal]);

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
    <Grid size={7}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6">Recent Transactions</Typography>
        <Button variant="contained" onClick={handleOpenAddModal}>
          Add
        </Button>
      </Box>

      <Grid container spacing={2}>
        {filteredTransactions.map((tx) => (
          <Grid size={12} key={tx.id}>
            <Card
              onClick={() => handleOpenEditModal(tx)}
              sx={{
                borderRadius: 2,
                boxShadow: 3,
                cursor: "pointer",
                transition: "transform 0.2s ease-in-out",
                "&:hover": {
                  transform: "scale(1.02)",
                  backgroundColor: "#e0f7fa",
                },
              }}
            >
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1}
                >
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {tx.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      gutterBottom
                    >
                      {tx.category}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {tx.description}
                    </Typography>
                  </Box>

                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="flex-end"
                    width="50%"
                  >
                    <Box
                      display="flex"
                      flexDirection="column"
                      justifyContent="center"
                      alignItems="center"
                      gap={1}
                    >
                      <Typography variant="subtitle1">₱ {tx.amount}</Typography>
                      {tx.type === "income" ? (
                        <Chip label="Income" size="small" color="success" />
                      ) : (
                        <Chip label="Expense" size="small" color="error" />
                      )}
                      <Typography variant="caption" color="textSecondary">
                        {tx.account}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Typography variant="caption" color="textSecondary">
                  {tx.date}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Single Modal for Add & Edit */}
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
                value={form.title}
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
                value={form.amount}
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
                value={form.category}
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
                value={form.account}
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
                value={form.type}
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
                value={form.date}
                onChange={handleFormChange}
                margin="normal"
                required
                placeholder="Date"
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={form.description}
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
    </Grid>
  );
}
