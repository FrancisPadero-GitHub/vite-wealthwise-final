import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  IconButton,
  CircularProgress,
  Box,
} from "@mui/material";

import EditIcon from "@mui/icons-material/EditOutlined";
import AccountBalanceWallet from "@mui/icons-material/AccountBalanceWallet";

import { useBalance } from "../../../hooks/useBalance";
import EditBalanceModal from "../modals/EditBalanceModal";
import RealtimeBalanceListener from "../../../api/BalanceRealtime";

export default function BalanceCard() {
  const { data: balanceData, isLoading, isError } = useBalance();
  const amount = balanceData?.amount ?? 0;
  const status = amount >= 0 ? "Debt Free" : "In Debt";

  // Modal dialog state
  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  return (
    <>
      <RealtimeBalanceListener />
      <Card
        sx={{
          minWidth: 250,
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
            <IconButton
              color="primary"
              aria-label="edit balance"
              onClick={handleOpenModal}
            >
              <EditIcon />
            </IconButton>
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
            <AccountBalanceWallet fontSize="large" />
          </Box>
          <Box>
            {isLoading ? (
              <Box display="flex" alignItems="center">
                <CircularProgress size={24} />
              </Box>
            ) : isError ? (
              <Typography color="error">Error loading balance</Typography>
            ) : (
              <>
                <Typography
                  variant="h5"
                  color={amount >= 0 ? "primary" : "error"}
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
