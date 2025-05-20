import React, { useState, useEffect } from "react";
import { useBudgeting } from "../../../hooks/useBudgeting";
import BudgetModal from "./BudgetModal";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Tooltip,
  LinearProgress,
} from "@mui/material";
import {
  EditOutlined,
  DeleteOutline,
  Add as AddIcon,
  Category as CategoryIcon,
  CalendarToday as CalendarTodayIcon,
  AttachMoney as AttachMoneyIcon,
} from "@mui/icons-material";

import { format } from "date-fns";

export default function BudgetingCard() {
  const {
    budgets,
    remainingBudgets,
    loading,
    error,
    addBudget,
    updateBudget,
    deleteBudget,
  } = useBudgeting();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState(null);
  const [operationLoading, setOperationLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [formData, setFormData] = useState({
    category: "",
    name: "",
    start_date: "",
    end_date: "",
    amount: "",
  });

  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleOpenModal = (budget = null) => {
    if (budget) {
      setFormData({
        category: budget.category,
        name: budget.name,
        start_date: format(new Date(budget.start_date), "yyyy-MM-dd"),
        end_date: format(new Date(budget.end_date), "yyyy-MM-dd"),
        amount: budget.amount,
      });
      setEditing(true);
      setEditingId(budget.id);
    } else {
      setFormData({
        category: "",
        name: "",
        start_date: "",
        end_date: "",
        amount: "",
      });
      setEditing(false);
      setEditingId(null);
    }
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      setOperationLoading(true);
      if (editing && editingId) {
        await updateBudget(editingId, formData);
        setSnackbar({
          open: true,
          message: "Budget updated successfully",
          severity: "success",
        });
      } else {
        await addBudget(formData);
        setSnackbar({
          open: true,
          message: "Budget added successfully",
          severity: "success",
        });
      }
      setModalOpen(false);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Operation failed",
        severity: "error",
      });
    } finally {
      setOperationLoading(false);
    }
  };

  const handleDeleteClick = (budget) => {
    setBudgetToDelete(budget);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setOperationLoading(true);
      await deleteBudget(budgetToDelete.id);
      setSnackbar({
        open: true,
        message: "Budget deleted successfully",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Failed to delete budget",
        severity: "error",
      });
    } finally {
      setOperationLoading(false);
      setDeleteConfirmOpen(false);
      setBudgetToDelete(null);
    }
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  if (!hasMounted) return null;
  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  if (error) return <Alert severity="error">Error: {error.message}</Alert>;

  return (
    <Card>
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            💰 Budget Management
          </Typography>

          <IconButton color="success" onClick={() => handleOpenModal()}>
            <AddIcon />
          </IconButton>
        </Box>

        {/* Remaining Budgets */}
        <Typography variant="body1" gutterBottom>
          Remaining Funds
        </Typography>
        <Box sx={{ overflowX: "auto", mb: 3 }}>
          <Grid
            container
            spacing={2}
            sx={{
              minWidth: "max-content",
              pb: 2,
              px: 2,
            }}
          >
            {remainingBudgets?.length > 0 ? (
              remainingBudgets.map((budget) => {
                const total = Number(budget.budgeted_amount || 0);
                const spent = Number(budget.spent_amount || 0);
                const percent = total
                  ? Math.min((spent / total) * 100, 100)
                  : 0;
                return (
                  <Grid item key={budget.budget_id}>
                    <Card
                      elevation={4}
                      sx={{
                        borderLeft: 4,
                        width: 425,
                        borderColor:
                          budget.remaining <= 0 ? "error.main" : "success.main",
                        transition: "transform 0.5s",
                        "&:hover": { transform: "scale(1.02)" },
                      }}
                    >
                      <CardContent>
                        <Box mb={1}>
                          <Typography variant="h6">
                            {budget.name || "Untitled"}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <CategoryIcon fontSize="small" />
                            {budget.category || "Uncategorized"}
                          </Typography>
                        </Box>

                        <Typography
                          variant="h6"
                          color={budget.remaining <= 0 ? "error" : "success"}
                        >
                          {/* budget_amount */}₱{" "}
                          {budget.remaining.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {budget.remaining < 0 ? "Over Budget" : "Remaining"}
                        </Typography>

                        <Box display="flex" justifyContent="center">
                          <Chip
                            size="medium"
                            color={percent >= 100 ? "error" : "primary"}
                            variant="outlined"
                            label={`Total Spent: ₱ ${spent.toLocaleString()}`}
                          />
                        </Box>

                        <Box mt={2}>
                          <LinearProgress
                            variant="determinate"
                            value={percent}
                            sx={{ height: 10, borderRadius: 5 }}
                            color={percent >= 100 ? "error" : "primary"}
                          />

                          <Typography
                            variant="caption"
                            align="right"
                            display="block"
                          >
                            {Math.round(percent)}% used
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })
            ) : (
              <Grid xs={12} mt={1}>
                <Typography variant="body2" align="center" color="text.secondary">
                  Add a budget to get started
                </Typography>
              </Grid>
            )}
          </Grid>
        </Box>

        {/* All Budgets List */}
        <Typography variant="body1" gutterBottom>
          Budgets
        </Typography>
        <Box sx={{ overflowX: "auto" }}>
          <Grid
            container
            spacing={2}
            sx={{
              minWidth: "max-content",
              pb: 2,
              px: 2,
            }}
          >
            {budgets?.length > 0 ? (
              budgets.map((budget) => (
                <Grid item key={budget.id}>
                  <Card
                    elevation={4}
                    sx={{
                      width: 425,
                      transition: "transform 0.5s",
                      "&:hover": { transform: "scale(1.02)" },
                      background:
                        "linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)",
                      borderLeft: "4px solid #2196f3",
                    }}
                  >
                    <CardContent>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="end"
                      >
                        <Box>
                          <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                            sx={{
                              color: "#1976d2",
                              fontSize: "1.2rem",
                              mb: 1,
                            }}
                          >
                            {budget.name}
                          </Typography>

                          <Typography
                            variant="body1"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            ₱ {Number(budget.amount).toLocaleString()}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#666",
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                              mb: 0.5,
                            }}
                          >
                            <CategoryIcon
                              sx={{ color: "#4caf50", fontSize: "1rem" }}
                            />
                            {budget.category || "Uncategorized"}
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{
                              color: "#666",
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                              mb: 0.5,
                            }}
                          >
                            <CalendarTodayIcon
                              sx={{ color: "#ff9800", fontSize: "1rem" }}
                            />
                            {format(new Date(budget.start_date), "MMM d, yyyy")}{" "}
                            - {format(new Date(budget.end_date), "MMM d, yyyy")}
                          </Typography>
                        </Box>

                        <Box>
                          <Tooltip title="Edit Budget">
                            <IconButton
                              onClick={() => handleOpenModal(budget)}
                              sx={{
                                mr: 1,
                                color: "#2196f3",
                                "&:hover": {
                                  backgroundColor: "rgba(33, 150, 243, 0.1)",
                                },
                              }}
                              disabled={operationLoading}
                            >
                              <EditOutlined />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Delete Budget">
                            <IconButton
                              onClick={() => handleDeleteClick(budget)}
                              sx={{
                                color: "#f44336",
                                "&:hover": {
                                  backgroundColor: "rgba(244, 67, 54, 0.1)",
                                },
                              }}
                              disabled={operationLoading}
                            >
                              <DeleteOutline />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid xs={12} mt={1}>
                <Typography variant="body2" align="center" color="text.secondary">
                  Click the + icon to add a new budget.
                </Typography>
              </Grid>
            )}
          </Grid>
        </Box>
      </CardContent>

      {/* Modals and Snackbars */}
      <BudgetModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        editing={editing}
        loading={operationLoading}
      />

      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the budget "{budgetToDelete?.name}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteConfirmOpen(false)}
            disabled={operationLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={operationLoading}
          >
            {operationLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Card>
  );
}
