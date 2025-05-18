import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AddCardOutlinedIcon from "@mui/icons-material/AddCardOutlined";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import { useTransactionTotals } from "../../../hooks/useTransactions";

function TotalIncomeCard() {
  const { data, isLoading, isError } = useTransactionTotals();
  const income = data?.current?.income ?? 0;
  const incomeChange = data?.changes?.income ?? 0;
  const isPositive = incomeChange >= 0;

  return (
    <Card sx={{ minWidth: 280, height: 160, position: "relative", pl: 2 }}>
      <CardHeader
        title={
          <Typography sx={{ fontSize: "1.2rem" }}>Monthly Income</Typography>
        }
      />
      <CardContent sx={{ display: "flex", alignItems: "center" }}>
        <Box
          sx={{
            bgcolor: "#e0f8e9",
            borderRadius: "50%",
            width: 56,
            height: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#2eca6a",
            mr: 2,
          }}
        >
          <AddCardOutlinedIcon fontSize="large" />
        </Box>
        <Box>
          {isLoading ? (
            <CircularProgress size={24} />
          ) : isError ? (
            <Typography color="error">Error loading income</Typography>
          ) : (
            <>
              <Typography variant="h6" sx={{ color: "#2eca6a" }}>
                ₱ {income.toFixed(2)}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {isPositive ? (
                  <TrendingUpIcon sx={{ color: "#2e7d32" }} />
                ) : (
                  <TrendingDownIcon sx={{ color: "#d32f2f" }} />
                )}
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: "bold",
                    color: isPositive ? "#2e7d32" : "#d32f2f",
                  }}
                >
                  {Math.abs(incomeChange).toFixed(1)}% from last month
                </Typography>
              </Box>
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

export default TotalIncomeCard;
