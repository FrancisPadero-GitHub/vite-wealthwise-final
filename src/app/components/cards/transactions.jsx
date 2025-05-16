import React, { useState } from "react";
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
  Fade,
  IconButton, // Import IconButton
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"; // Import CloseIcon
import { useTransactions } from "../../../hooks/useTransactions";
import { useAddTransaction } from "../../../hooks/useAddTransaction";
import { useEditTransaction } from "../../../hooks/useEditTransaction";
import { useDeleteTransaction } from "../../../hooks/useDeleteTransaction";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "30%", // increased width for 2 columns
  maxHeight: "80vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 3,
};

function TransactionTable() {
  const { data: transactions, isLoading, error } = useTransactions();
  const { mutate: addTransaction } = useAddTransaction();
  const { mutate: editTransaction } = useEditTransaction();
  const { mutate: deleteTransaction } = useDeleteTransaction();
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
    type: "",
    account: "",
    date: "",
    description: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addTransaction(form);
    setOpen(false);
    setForm({
      title: "",
      amount: "",
      category: "",
      type: "",
      account: "",
      date: "",
      description: "",
    });
  };

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const handleRowClick = (transaction) => {
    setSelectedTransaction(transaction);
    setEditModalOpen(true);
  };

  const handleEditClose = () => {
    setEditModalOpen(false);
    setSelectedTransaction(null);
  };

  const handleDeleteClick = (transactionId) => {
    handleDelete(transactionId);
  };

  // Define handleEdit function
  const handleEdit = (transaction) => {
    // Call editTransaction hook
    editTransaction(transaction);
    setEditModalOpen(false);
    setSelectedTransaction(null);
  };

  // Define handleDelete function
  const handleDelete = (transactionId) => {
    // Call deleteTransaction hook
    deleteTransaction(transactionId);
    setEditModalOpen(false);
  };

  // Render the edit modal
  const renderEditModal = () => (
    <Modal open={editModalOpen} onClose={handleEditClose}>
      <Box component="form" sx={modalStyle}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6">Edit Transaction</Typography>
          <IconButton aria-label="close" onClick={handleEditClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Grid container spacing={2}>
          <Grid item size={6}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={selectedTransaction?.title || ""}
              onChange={handleChange}
              required
              margin="normal"
            />
          </Grid>
          <Grid item size={6}>
            <TextField
              fullWidth
              label="Amount"
              name="amount"
              value={selectedTransaction?.amount || ""}
              onChange={handleChange}
              required
              margin="normal"
            />
          </Grid>
          {/* Row 2 */}
          <Grid item size={6}>
            <TextField
              fullWidth
              label="Category"
              name="category"
              value={selectedTransaction?.category}
              onChange={handleChange}
              required
              margin="normal"
            />
          </Grid>
          {/* Row 3 */}
          <Grid item size={6}>
            <TextField
              fullWidth
              label="Account"
              name="account"
              value={selectedTransaction?.account}
              onChange={handleChange}
              required
              margin="normal"
            />
          </Grid>
          <Grid item size={6}>
            <TextField
              fullWidth
              select
              label="Type"
              name="type"
              value={selectedTransaction?.type}
              onChange={handleChange}
              required
              margin="normal"
            >
              <MenuItem value="income">Income</MenuItem>
              <MenuItem value="expense">Expense</MenuItem>
            </TextField>
          </Grid>
          <Grid item size={6}>
            <TextField
              fullWidth
              name="date"
              type="date"
              value={selectedTransaction?.date}
              onChange={handleChange}
              margin="normal"
              placeholder="Date"
              required
            />
          </Grid>
          {/* Description spans full width */}
          <Grid item size={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={selectedTransaction?.description}
              onChange={handleChange}
              margin="normal"
              multiline
              minRows={4}
              required
            />
          </Grid>
        </Grid>
        <Grid>
          <Button
            onClick={() => handleEdit(selectedTransaction)}
            variant="contained"
            sx={{ mt: 2 }}
            fullWidth
          >
            Save
          </Button>
          <Button
            onClick={() => handleDeleteClick(selectedTransaction.id)}
            variant="contained"
            color="secondary"
            sx={{ mt: 2 }}
            fullWidth
          >
            Delete
          </Button>
        </Grid>
      </Box>
    </Modal>
  );

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography color="error">{error.message}</Typography>;

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6">My Transactions</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Add Transaction
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Account</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow
                key={tx.id}
                onClick={() => handleRowClick(tx)}
                style={{ cursor: "pointer" }}
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

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box component="form" sx={modalStyle} onSubmit={handleSubmit}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6">Add Transaction</Typography>
            <IconButton aria-label="close" onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Grid container spacing={2}>
            {/* Row 1 */}
            <Grid item size={6}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                margin="normal"
              />
            </Grid>
            <Grid item size={6}>
              <TextField
                fullWidth
                label="Amount"
                name="amount"
                type="number"
                value={form.amount}
                onChange={handleChange}
                required
                margin="normal"
              />
            </Grid>
            {/* Row 2 */}
            <Grid item size={6}>
              <TextField
                fullWidth
                label="Category"
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                margin="normal"
              />
            </Grid>
            {/* Row 3 */}
            <Grid item size={6}>
              <TextField
                fullWidth
                label="Account"
                name="account"
                value={form.account}
                onChange={handleChange}
                required
                margin="normal"
              />
            </Grid>
            <Grid item size={6}>
              <TextField
                fullWidth
                select
                label="Type"
                name="type"
                value={form.type}
                onChange={handleChange}
                required
                margin="normal"
              >
                <MenuItem value="income">Income</MenuItem>
                <MenuItem value="expense">Expense</MenuItem>
              </TextField>
            </Grid>
            <Grid item size={6}>
              <TextField
                fullWidth
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                margin="normal"
                placeholder="Date"
                required
              />
            </Grid>
            {/* Description spans full width */}
            <Grid item size={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={form.description}
                onChange={handleChange}
                margin="normal"
                multiline
                minRows={4}
                required
              />
            </Grid>
          </Grid>
          <Grid>
            <Button type="submit" variant="contained" sx={{ mt: 2 }} fullWidth>
              Add
            </Button>
          </Grid>
        </Box>
      </Modal>
      {renderEditModal()}
    </>
  );
}

export default TransactionTable;
