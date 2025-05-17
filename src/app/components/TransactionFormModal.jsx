import React from "react";
import {
  Box,
  Typography,
  IconButton,
  TextField,
  MenuItem,
  Grid,
  Button,
  CircularProgress,
  Modal,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";

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

export default function TransactionFormModal({
  open,
  onClose,
  form,
  onFormChange,
  onSubmit,
  onDelete,
  loading,
  selectedTransaction,
}) {
  return (
    <Modal open={open} onClose={onClose}>
      <Box component="form" sx={modalStyle} onSubmit={onSubmit}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6">
            {selectedTransaction ? "Edit Transaction" : "Add Transaction"}
          </Typography>
          <IconButton aria-label="close" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Grid container spacing={2} columns={12}>
          <Grid size={6}>
            <TextField
              id="transaction-title"
              fullWidth
              label="Title"
              name="title"
              value={form.title}
              onChange={onFormChange}
              required
              margin="normal"
            />
          </Grid>
          <Grid size={6}>
            <TextField
              id="transaction-amount"
              fullWidth
              label="Amount"
              name="amount"
              type="number"
              value={form.amount}
              onChange={onFormChange}
              required
              margin="normal"
            />
          </Grid>
          <Grid size={6}>
            <TextField
              id="transaction-category"
              fullWidth
              label="Category"
              name="category"
              value={form.category}
              onChange={onFormChange}
              required
              margin="normal"
            />
          </Grid>
          <Grid size={6}>
            <TextField
              id="transaction-account"
              fullWidth
              select
              label="Account"
              name="account"
              value={form.account}
              onChange={onFormChange}
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
              id="transaction-type"
              fullWidth
              select
              label="Type"
              name="type"
              value={form.type}
              onChange={onFormChange}
              required
              margin="normal"
            >
              <MenuItem value="income">Income</MenuItem>
              <MenuItem value="expense">Expense</MenuItem>
            </TextField>
          </Grid>
          <Grid size={6}>
            <TextField
              id="transaction-date"
              fullWidth
              name="date"
              type="date"
              label="Date"
              InputLabelProps={{ shrink: true }}
              value={form.date}
              onChange={onFormChange}
              margin="normal"
              required
            />
          </Grid>
          <Grid size={12}>
            <TextField
              id="transaction-description"
              fullWidth
              label="Description"
              name="description"
              value={form.description}
              onChange={onFormChange}
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
            color="success"
            sx={{ mt: 2 }}
            fullWidth
            disabled={loading}
            startIcon={
              loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <SaveIcon />
              )
            }
          >
            {selectedTransaction ? "Save" : "Add"}
          </Button>

          {selectedTransaction && (
            <Button
              onClick={onDelete}
              variant="contained"
              color="error"
              sx={{ mt: 2 }}
              fullWidth
              disabled={loading}
              startIcon={
                loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <DeleteIcon />
                )
              }
            >
              Delete
            </Button>
          )}
        </Grid>
      </Box>
    </Modal>
  );
}
