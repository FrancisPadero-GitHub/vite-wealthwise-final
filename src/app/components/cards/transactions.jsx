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
  const { data: transactions, isLoading, error } = useTransactions();
  const { mutate: addTransaction } = useAddTransaction();
  const { mutate: editTransaction } = useEditTransaction();
  const { mutate: deleteTransaction } = useDeleteTransaction();

  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState(defaultFormValues);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState(defaultFormValues);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const handleOpenAddModal = useCallback(() => {
    setIsAddModalOpen(true);
    setAddForm(defaultFormValues);
  }, []);

  const handleCloseAddModal = useCallback(() => {
    setIsAddModalOpen(false);
    setAddForm(defaultFormValues);
  }, []);

  const handleAddFormChange = useCallback((e) => {
    setAddForm((prevForm) => ({
      ...prevForm,
      [e.target.name]: e.target.value,
    }));
  }, []);

  const handleAddSubmit = useCallback(
    (e) => {
      e.preventDefault();
      addTransaction(addForm);
      handleCloseAddModal();
    },
    [addTransaction, addForm, handleCloseAddModal]
  );

  const handleOpenEditModal = useCallback((transaction) => {
    setSelectedTransaction(transaction);
    setEditForm(transaction);
    setIsEditModalOpen(true);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setIsEditModalOpen(false);
    setSelectedTransaction(null);
    setEditForm(defaultFormValues);
  }, []);

  const handleEditFormChange = useCallback((e) => {
    setEditForm((prevForm) => ({
      ...prevForm,
      [e.target.name]: e.target.value,
    }));
  }, []);

  const handleEditSubmit = useCallback(
    (e) => {
      e.preventDefault();
      editTransaction(editForm);
      handleCloseEditModal();
    },
    [editTransaction, editForm, handleCloseEditModal]
  );

  const handleDeleteClick = useCallback(
    (transactionId) => {
      deleteTransaction(transactionId);
      handleCloseEditModal();
    },
    [deleteTransaction, handleCloseEditModal]
  );

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
        <Button variant="contained" onClick={handleOpenAddModal}>
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

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
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
                onClick={() => handleOpenEditModal(tx)}
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

      {/* Add Transaction Modal */}
      <Modal open={isAddModalOpen} onClose={handleCloseAddModal}>
        <Box component="form" sx={modalStyle} onSubmit={handleAddSubmit}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6">Add Transaction</Typography>
            <IconButton aria-label="close" onClick={handleCloseAddModal}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Grid container spacing={2}>
            <Grid item size={6}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={addForm.title}
                onChange={handleAddFormChange}
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
                value={addForm.amount}
                onChange={handleAddFormChange}
                required
                margin="normal"
              />
            </Grid>
            <Grid item size={6}>
              <TextField
                fullWidth
                label="Category"
                name="category"
                value={addForm.category}
                onChange={handleAddFormChange}
                required
                margin="normal"
              />
            </Grid>
            <Grid item size={6}>
              <TextField
                fullWidth
                label="Account"
                name="account"
                value={addForm.account}
                onChange={handleAddFormChange}
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
                value={addForm.type}
                onChange={handleAddFormChange}
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
                value={addForm.date}
                onChange={handleAddFormChange}
                margin="normal"
                placeholder="Date"
                size="small"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item size={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={addForm.description}
                onChange={handleAddFormChange}
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

      {/* Edit Transaction Modal */}
      <Modal open={isEditModalOpen} onClose={handleCloseEditModal}>
        <Box component="form" sx={modalStyle} onSubmit={handleEditSubmit}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6">Edit Transaction</Typography>
            <IconButton aria-label="close" onClick={handleCloseEditModal}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Grid container spacing={2}>
            <Grid item size={6}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={editForm.title || ""}
                onChange={handleEditFormChange}
                required
                margin="normal"
              />
            </Grid>
            <Grid item size={6}>
              <TextField
                fullWidth
                label="Amount"
                name="amount"
                value={editForm.amount || ""}
                onChange={handleEditFormChange}
                required
                margin="normal"
              />
            </Grid>
            <Grid item size={6}>
              <TextField
                fullWidth
                label="Category"
                name="category"
                value={editForm.category || ""}
                onChange={handleEditFormChange}
                required
                margin="normal"
              />
            </Grid>
            <Grid item size={6}>
              <TextField
                fullWidth
                label="Account"
                name="account"
                value={editForm.account || ""}
                onChange={handleEditFormChange}
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
                value={editForm.type || ""}
                onChange={handleEditFormChange}
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
                value={editForm.date || ""}
                onChange={handleEditFormChange}
                margin="normal"
                placeholder="Date"
                size="small"
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item size={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={editForm.description || ""}
                onChange={handleEditFormChange}
                margin="normal"
                multiline
                minRows={4}
                required
              />
            </Grid>
          </Grid>
          <Grid>
            <Button type="submit" variant="contained" sx={{ mt: 2 }} fullWidth>
              Save
            </Button>
            <Button
              onClick={() => handleDeleteClick(selectedTransaction?.id)}
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
    </Box>
  );
}

export default TransactionTable;
