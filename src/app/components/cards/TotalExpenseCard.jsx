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
import CreditCardOffOutlinedIcon from "@mui/icons-material/CreditCardOffOutlined";
import { useTransactionTotals } from "../../../hooks/useTransactions";

function TotalExpenseCard() {
  const { data, isLoading, isError } = useTransactionTotals();
  const expense = data?.current?.expense ?? 0;
  const expenseChange = data?.changes?.expense ?? 0;
  const isPositive = expenseChange <= 0; // For expenses, a decrease is positive

  return (
    <Card sx={{ minWidth: 280, position: "relative" }}>
      <CardHeader
        title={
          <Typography sx={{ fontSize: "1.2rem" }}>Monthly Expenses</Typography>
        }
      />
      <CardContent sx={{ display: "flex", alignItems: "center" }}>
        <Box
          sx={{
            bgcolor: "#ffecdf",
            borderRadius: "50%",
            width: 56,
            height: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ff771d",
            mr: 2,
          }}
        >
          <CreditCardOffOutlinedIcon fontSize="large" />
        </Box>
        <Box>
          {isLoading ? (
            <CircularProgress size={24} />
          ) : isError ? (
            <Typography color="error">Error loading expenses</Typography>
          ) : (
            <>
              <Typography variant="h6">₱ {expense.toFixed(2)}</Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {isPositive ? (
                  <TrendingDownIcon sx={{ color: "#2e7d32" }} />
                ) : (
                  <TrendingUpIcon sx={{ color: "#d32f2f" }} />
                )}
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: "bold",
                    color: isPositive ? "#2e7d32" : "#d32f2f",
                  }}
                >
                  {Math.abs(expenseChange).toFixed(1)}% from last month
                </Typography>
              </Box>
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

export default TotalExpenseCard;
