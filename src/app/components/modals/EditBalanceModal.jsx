import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { useUpdateBalance } from "../../../hooks/useUpdateBalance";

export default function EditBalanceModal({ open, onClose, currentAmount }) {
  const [newBalance, setNewBalance] = useState(currentAmount);
  const updateBalanceMutation = useUpdateBalance();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (open) {
      setNewBalance(currentAmount);
    }
  }, [open, currentAmount]);

  const handleBalanceChange = (event) => {
    setNewBalance(event.target.value);
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const handleSubmit = async (event) => {
    event.preventDefault();

    const parsedAmount = parseFloat(newBalance);
    if (isNaN(parsedAmount)) {
      setSnackbar({
        open: true,
        message: "Please enter a valid number",
        severity: "error",
      });
      return;
    }

    try {
      await updateBalanceMutation.mutateAsync(parsedAmount);
      setSnackbar({
        open: true,
        message: "Balance updated successfully",
        severity: "success",
      });
      onClose();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Failed to update balance",
        severity: "error",
      });
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogTitle>Edit Balance</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent dividers>
            <TextField
              autoFocus
              margin="dense"
              label="New Balance Amount"
              type="number"
              fullWidth
              variant="outlined"
              step="0.01"
              value={newBalance}
              onChange={handleBalanceChange}
              disabled={updateBalanceMutation.isLoading}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={onClose}
              color="primary"
              disabled={updateBalanceMutation.isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={updateBalanceMutation.isLoading}
            >
              {updateBalanceMutation.isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

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
