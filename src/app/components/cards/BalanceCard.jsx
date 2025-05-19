import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
  Box,
} from "@mui/material";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";

import { useBalance } from "../../../hooks/useBalance";
import EditBalanceModal from "../modals/EditBalanceModal";

export default function BalanceCard() {
  const { data: balanceData, isLoading, isError } = useBalance();
  const amount = balanceData?.amount ?? 0;
  const status = amount >= 0 ? "Debt Free" : "In Debt";

  // Dropdown menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  // Modal dialog state
  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => {
    setOpenModal(true);
    handleMenuClose();
  };
  const handleCloseModal = () => setOpenModal(false);

  return (
    <>
      <Card
        sx={{
          minWidth: 280,
          height: 160,
          position: "relative",
          pl: 2,
          transition: "transform 0.5s",
          "&:hover": { transform: "scale(1.02)" },
        }}
      >
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
              bgcolor: "#CBD0FB",
              borderRadius: "50%",
              width: 56,
              height: 56,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#5465F2",
              mr: 2,
            }}
          >
            <AccountBalanceWalletOutlinedIcon fontSize="large" />
          </Box>
          <Box>
            {isLoading ? (
              <CircularProgress size={24} />
            ) : isError ? (
              <Typography color="error">Error loading balance</Typography>
            ) : (
              <>
                <Typography
                  variant="h6"
                  color={amount >= 0 ? "success" : "error"}
                >
                  ₱ {amount.toFixed(2)}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: "bold",
                    color: amount >= 0 ? "#2e7d32" : "#d32f2f",
                  }}
                >
                  {status}
                </Typography>
              </>
            )}
          </Box>
        </CardContent>
      </Card>

      <EditBalanceModal
        open={openModal}
        onClose={handleCloseModal}
        currentAmount={amount}
      />
    </>
  );
}
