import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { useUpdateBalance } from "../../../hooks/useUpdateBalance";

export default function EditBalanceModal({ open, onClose, currentAmount }) {
  const [newBalance, setNewBalance] = useState(currentAmount);
  const updateBalanceMutation = useUpdateBalance();

  // Reset input value when modal opens/closes or amount changes
  useEffect(() => {
    if (open) {
      setNewBalance(currentAmount);
    }
  }, [open, currentAmount]);

  const handleBalanceChange = (event) => {
    setNewBalance(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const parsedAmount = parseFloat(newBalance);
    if (isNaN(parsedAmount)) {
      alert("Please enter a valid number");
      return;
    }

    try {
      await updateBalanceMutation.mutateAsync(parsedAmount);
      onClose();
    } catch (error) {
      alert(error.message || "Failed to update balance");
    }
  };

  return (
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
  );
}
