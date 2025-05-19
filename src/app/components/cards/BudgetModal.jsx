// /components/BudgetModal.jsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import React from "react";

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
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{editing ? "Edit Budget" : "Add Budget"}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                name="start_date"
                label="Start Date"
                InputLabelProps={{ shrink: true }}
                value={formData.start_date}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                name="end_date"
                label="End Date"
                InputLabelProps={{ shrink: true }}
                value={formData.end_date}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Amount"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                required
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                  inputProps: { min: 0, step: "0.01" },
                }}
              />
            </Grid>
          </Grid>
          <DialogActions sx={{ mt: 2 }}>
            <Button onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? "Saving..." : editing ? "Update" : "Add"}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}
