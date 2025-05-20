import React, { useState } from "react";
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
  Autocomplete,
  InputAdornment,
  Snackbar,
  Alert,
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

const categoryOptions = [
  { label: "Food and Drinks", category: "Daily Expenses" },
  { label: "Shopping", category: "Daily Expenses" },
  { label: "House Rent", category: "Daily Expenses" },
  { label: "Transportation", category: "Daily Expenses" },
  { label: "Health & Medical", category: "Daily Expenses" },
  { label: "Education", category: "Daily Expenses" },
  { label: "Utilities", category: "Daily Expenses" },
  { label: "Personal Care", category: "Daily Expenses" },
  { label: "Entertainment", category: "Daily Expenses" },
  { label: "Dining Out", category: "Daily Expenses" },
  { label: "Travel", category: "Daily Expenses" },
  { label: "Clothing & Accessories", category: "Daily Expenses" },
  { label: "Childcare", category: "Daily Expenses" },
  { label: "Pet Care", category: "Daily Expenses" },
  { label: "Subscriptions & Memberships", category: "Daily Expenses" },
  { label: "Vehicle", category: "Assets" },
  { label: "Life and Entertainment", category: "Assets" },
  { label: "Communication & PC", category: "Assets" },
  { label: "Home", category: "Assets" },
  { label: "Furniture & Appliances", category: "Assets" },
  { label: "Electronics", category: "Assets" },
  { label: "Jewelry & Luxury Items", category: "Assets" },
  { label: "Art & Collectibles", category: "Assets" },
  { label: "Real Estate", category: "Assets" },
  { label: "Vehicles & Boats", category: "Assets" },
  { label: "Financial Expenses", category: "Financial" },
  { label: "Investments", category: "Financial" },
  { label: "Income", category: "Financial" },
  { label: "Savings", category: "Financial" },
  { label: "Debt Payments", category: "Financial" },
  { label: "Taxes", category: "Financial" },
  { label: "Insurance", category: "Financial" },
  { label: "Gifts & Donations", category: "Financial" },
  { label: "Loan Payments", category: "Financial" },
  { label: "Bank Fees", category: "Financial" },
  { label: "Retirement Contributions", category: "Financial" },
  { label: "Dividends", category: "Financial" },
  { label: "Royalties", category: "Financial" },
  { label: "Other Income", category: "Financial" },
  { label: "Other Expenses", category: "Financial" },
  { label: "Business Expenses", category: "Business Ventures" },
  { label: "Business Income", category: "Business Ventures" },
  { label: "Professional Services", category: "Business Ventures" },
  { label: "Office Supplies", category: "Business Ventures" },
  { label: "Marketing & Advertising", category: "Business Ventures" },
  { label: "Software & Subscriptions", category: "Business Ventures" },
  { label: "Legal Fees", category: "Business Ventures" },
  { label: "Consulting Fees", category: "Business Ventures" },
  { label: "Hobbies & Crafts", category: "Leisure & Lifestyle" },
  { label: "Sports & Recreation", category: "Leisure & Lifestyle" },
  { label: "Books & Magazines", category: "Leisure & Lifestyle" },
  { label: "Music & Instruments", category: "Leisure & Lifestyle" },
  { label: "Movies & Streaming", category: "Leisure & Lifestyle" },
  { label: "Concerts & Events", category: "Leisure & Lifestyle" },
  { label: "Video Games", category: "Leisure & Lifestyle" },
  { label: "Outdoor Activities", category: "Leisure & Lifestyle" },
  { label: "Others", category: "Leisure & Lifestyle" },
];

export default function TransactionFormModal({
  open,
  handleClose,
  form,
  handleChange,
  handleSubmit,
  onDelete,
  loading,
  selectedTransaction,
}) {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleSubmit();
      setSnackbar({
        open: true,
        message: selectedTransaction
          ? "Transaction updated successfully"
          : "Transaction added successfully",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Operation failed",
        severity: "error",
      });
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      await onDelete();
      setSnackbar({
        open: true,
        message: "Transaction deleted successfully",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Failed to delete transaction",
        severity: "error",
      });
    }
  };

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Box component="form" sx={modalStyle} onSubmit={handleFormSubmit}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6">
              {selectedTransaction
                ? "✏️ Edit Transaction"
                : "➕ Add Transaction"}
            </Typography>
            <IconButton aria-label="close" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Grid container columnSpacing={2}>
            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6, xl: 4 }}>
              <TextField
                id="transaction-title"
                fullWidth
                label="📝 Title"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                margin="normal"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6, xl: 4 }}>
              <TextField
                id="transaction-amount"
                fullWidth
                label="💰 Amount"
                name="amount"
                type="number"
                value={form.amount}
                onChange={handleChange}
                required
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">₱</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6, xl: 4 }}>
              <Autocomplete
                id="transaction-category"
                fullWidth
                disableClearable
                freeSolo={false}
                groupBy={(option) => option.category}
                getOptionLabel={(option) => option.label}
                options={categoryOptions.sort(
                  (a, b) => -b.category.localeCompare(a.category)
                )}
                value={
                  form.category
                    ? categoryOptions.find(
                        (option) => option.label === form.category
                      ) || null
                    : null
                }
                onChange={(event, newValue) => {
                  handleChange({
                    target: { name: "category", value: newValue?.label || "" },
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="🏷️ Category"
                    required
                    margin="normal"
                    inputProps={{
                      ...params.inputProps,
                      readOnly: true, // Disables typing
                    }}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6, xl: 4 }}>
              <TextField
                id="transaction-account"
                fullWidth
                select
                label="💳 Account"
                name="account"
                value={form.account}
                onChange={handleChange}
                required
                margin="normal"
              >
                <MenuItem value="Cash">Cash</MenuItem>
                <MenuItem value="Gcash">Gcash</MenuItem>
                <MenuItem value="Credit">Credit</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6, xl: 4 }}>
              <TextField
                id="transaction-type"
                fullWidth
                select
                label="💳 Type"
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
            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6, xl: 4 }}>
              <TextField
                id="transaction-date"
                fullWidth
                name="date"
                type="date"
                label="📅 Date"
                InputLabelProps={{ shrink: true }}
                value={form.date}
                onChange={handleChange}
                margin="normal"
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
              <TextField
                id="transaction-description"
                fullWidth
                label="📋 Description"
                name="description"
                value={form.description}
                onChange={handleChange}
                margin="normal"
                multiline
                minRows={4}
              />
            </Grid>
          </Grid>

          <Grid
            sx={{
              display: "flex",
              justifyContent: selectedTransaction
                ? "space-between"
                : "flex-end",
              alignItems: "center",
              gap: 2,
              mt: 1,
            }}
          >
            {selectedTransaction && (
              <Button
                onClick={handleDelete}
                variant="contained"
                color="error"
                sx={{ mt: 2 }}
                disabled={loading}
                startIcon={<DeleteIcon />}
              >
                Delete
              </Button>
            )}

            <Button
              type="submit"
              variant="contained"
              color="success"
              sx={{ mt: 2 }}
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
          </Grid>
        </Box>
      </Modal>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
