import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Box,
} from "@mui/material";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

import { useBalance } from "../../../hooks/useBalance";
import { useUpdateBalance } from "../../../hooks/useUpdateBalance"; // Import your mutation hook

export default function BalanceCard() {
  const { data, isLoading, isError } = useBalance();
  const amount = data?.amount ?? 0;
  const status = amount >= 0 ? "Debt Free" : "In Debt";

  // Dropdown menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  // Modal dialog state
  const [openModal, setOpenModal] = useState(false);
  const [newBalance, setNewBalance] = useState(amount);

  // Reset input value when modal opens/closes or amount changes
  useEffect(() => {
    if (openModal) {
      setNewBalance(amount);
    }
  }, [openModal, amount]);

  const handleOpenModal = () => {
    setOpenModal(true);
    handleMenuClose();
  };
  const handleCloseModal = () => setOpenModal(false);

  const handleBalanceChange = (event) => {
    setNewBalance(event.target.value);
  };

  // Use your mutation hook
  const updateBalanceMutation = useUpdateBalance();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Optional: Validate input here (e.g. ensure number)
    const parsedAmount = parseFloat(newBalance);
    if (isNaN(parsedAmount)) {
      alert("Please enter a valid number");
      return;
    }

    try {
      await updateBalanceMutation.mutateAsync(parsedAmount);
      setOpenModal(false);
    } catch (error) {
      alert(error.message || "Failed to update balance");
    }
  };

  return (
    <>
      <Card sx={{ maxWidth: 400, position: "relative" }}>
        <CardHeader
          title={<Typography variant="h6">Balance</Typography>}
          action={
            <>
              <IconButton
                aria-label="settings"
                aria-controls={openMenu ? "balance-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openMenu ? "true" : undefined}
                onClick={handleMenuOpen}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                id="balance-menu"
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <MenuItem onClick={handleOpenModal}>Edit</MenuItem>
              </Menu>
            </>
          }
        />
        <CardContent sx={{ display: "flex", alignItems: "center" }}>
          <Box
            sx={{
              bgcolor: "primary.main",
              borderRadius: "50%",
              width: 56,
              height: 56,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              mr: 2,
            }}
          >
            <AccountBalanceWalletIcon fontSize="large" />
          </Box>
          <Box>
            {isLoading ? (
              <CircularProgress size={24} />
            ) : isError ? (
              <Typography color="error">Error loading balance</Typography>
            ) : (
              <>
                <Typography variant="h6">₱ {amount.toFixed(2)}</Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: "bold",
                    color: amount >= 0 ? "success.main" : "error.main",
                  }}
                >
                  {status}
                </Typography>
              </>
            )}
          </Box>
        </CardContent>
      </Card>

      {/*Edit Modal but Dialog */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="xs"
        fullWidth
      >
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
              onClick={handleCloseModal}
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
    </>
  );
}
