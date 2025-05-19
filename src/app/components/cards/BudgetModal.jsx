// /components/BudgetModal.jsx
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Grid,
  Button,
  CircularProgress,
  Modal,
  Autocomplete,
  InputAdornment,
} from "@mui/material";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";

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

export default function BudgetModal({
  open,
  onClose,
  onSubmit,
  formData,
  setFormData,
  editing,
  loading,
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form data
    if (!formData.name.trim()) {
      alert("Please enter a budget name");
      return;
    }
    if (!formData.category.trim()) {
      alert("Please enter a category");
      return;
    }
    if (!formData.start_date) {
      alert("Please select a start date");
      return;
    }
    if (!formData.end_date) {
      alert("Please select an end date");
      return;
    }
    if (!formData.amount || formData.amount <= 0) {
      alert("Please enter a valid amount greater than 0");
      return;
    }

    // Validate date range
    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);
    if (endDate < startDate) {
      alert("End date cannot be before start date");
      return;
    }

    onSubmit();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box component="form" sx={modalStyle} onSubmit={handleSubmit}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6">
            {editing ? "✏️ Edit Budget" : "💰 Add Budget"}
          </Typography>
          <IconButton aria-label="close" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Grid container spacing={1} columns={12}>
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6, xl: 6 }}>
            <TextField
              fullWidth
              label="📝 Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              margin="normal"
              disabled={loading}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6, xl: 6 }}>
            <Autocomplete
              id="transaction-category"
              fullWidth
              disableClearable
              freeSolo={false}
              options={categoryOptions.sort(
                (a, b) => -b.category.localeCompare(a.category)
              )}
              getOptionLabel={(option) => option.label}
              groupBy={(option) => option.category}
              value={
                formData.category
                  ? categoryOptions.find(
                      (option) => option.label === formData.category
                    ) || null
                  : null
              }
              onChange={(event, newValue) => {
                handleChange({
                  target: {
                    name: "category",
                    value: newValue?.label || "",
                  },
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="🏷️ Category"
                  required
                  margin="normal"
                  disabled={loading}
                  inputProps={{
                    ...params.inputProps,
                    readOnly: true, // Disables typing
                  }}
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6, xl: 6 }}>
            <TextField
              fullWidth
              type="date"
              name="start_date"
              label="📅 Start Date"
              InputLabelProps={{ shrink: true }}
              value={formData.start_date}
              onChange={handleChange}
              required
              margin="normal"
              disabled={loading}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6, xl: 6 }}>
            <TextField
              fullWidth
              type="date"
              name="end_date"
              label="📅 End Date"
              InputLabelProps={{ shrink: true }}
              value={formData.end_date}
              onChange={handleChange}
              required
              margin="normal"
              disabled={loading}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
            <TextField
              fullWidth
              label="💰 Amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleChange}
              required
              margin="normal"
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">₱</InputAdornment>
                ),
                inputProps: { min: 0, step: "0.01" },
              }}
            />
          </Grid>
        </Grid>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 2,
            mt: 2,
          }}
        >
          <Button
            type="submit"
            variant="contained"
            color="success"
            disabled={loading}
            startIcon={
              loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <SaveIcon />
              )
            }
          >
            {loading ? "Saving..." : editing ? "Update" : "Add"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
