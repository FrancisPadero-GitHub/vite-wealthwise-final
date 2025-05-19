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
  Paper,
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
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  DeleteSweep as DeleteSweepIcon,
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
    deleteAllBudgets,
  } = useBudgeting();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteAllConfirmOpen, setDeleteAllConfirmOpen] = useState(false);
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

  const handleDeleteAllConfirm = async () => {
    try {
      setOperationLoading(true);
      await deleteAllBudgets();
      setSnackbar({
        open: true,
        message: "All budgets deleted successfully",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Failed to delete all budgets",
        severity: "error",
      });
    } finally {
      setOperationLoading(false);
      setDeleteAllConfirmOpen(false);
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
          <Box>
            <Tooltip title="Delete All Budgets">
              <IconButton
                onClick={() => setDeleteAllConfirmOpen(true)}
                disabled={!budgets?.length || operationLoading}
                color="error"
                sx={{ mr: 1 }}
              >
                <DeleteSweepIcon />
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              onClick={() => handleOpenModal()}
              disabled={operationLoading}
              startIcon={<AddIcon />}
            >
              Add Budget
            </Button>
          </Box>
        </Box>

        {/* Remaining Budgets */}
        <Typography variant="h6" gutterBottom>
          Remaining Budgets
        </Typography>
        <Grid container spacing={2} mb={4}>
          {remainingBudgets?.length > 0 ? (
            remainingBudgets.map((budget) => {
              const total = Number(budget.budgeted_amount || 0);
              const spent = Number(budget.spent_amount || 0);
              const percent = total ? Math.min((spent / total) * 100, 100) : 0;
              return (
                <Grid item xs={12} sm={6} md={4} key={budget.id}>
                  <Card
                    sx={{
                      p: 2,
                      borderLeft: 4,
                      borderColor:
                        budget.remaining < 0 ? "error.main" : "success.main",
                      transition: "transform 0.2s",
                      "&:hover": { transform: "scale(1.02)" },
                    }}
                  >
                    <CardContent>
                      <Typography variant="subtitle1">
                        {budget.category || "Uncategorized"}
                      </Typography>
                      <Typography
                        variant="h6"
                        color={budget.remaining < 0 ? "error" : "success"}
                      >
                        ₱ {Math.abs(budget.remaining).toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {budget.remaining < 0 ? "Over Budget" : "Remaining"}
                      </Typography>
                      <Box mt={1}>
                        <Chip
                          size="small"
                          label={`Spent: ₱ ${spent.toLocaleString()}`}
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
            <Grid item xs={12}>
              <Typography align="center" color="text.secondary">
                No remaining budgets to display
              </Typography>
            </Grid>
          )}
        </Grid>

        {/* All Budgets List */}
        <Typography variant="h6" gutterBottom>
          Your Budgets
        </Typography>
        <Grid container spacing={2}>
          {budgets?.length > 0 ? (
            budgets.map((budget) => (
              <Grid item xs={12} key={budget.id}>
                <Card sx={{ p: 2 }}>
                  <CardContent>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {budget.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Category: {budget.category || "Uncategorized"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Period:{" "}
                          {format(new Date(budget.start_date), "MMM d, yyyy")} -{" "}
                          {format(new Date(budget.end_date), "MMM d, yyyy")}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Amount: ₱ {Number(budget.amount).toLocaleString()}
                        </Typography>
                      </Box>

                      <Box>
                        <Tooltip title="Edit Budget">
                          <IconButton
                            onClick={() => handleOpenModal(budget)}
                            sx={{ mr: 1 }}
                            disabled={operationLoading}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Budget">
                          <IconButton
                            onClick={() => handleDeleteClick(budget)}
                            disabled={operationLoading}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                      
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography align="center" color="text.secondary">
                No budgets found. Add a new budget to get started.
              </Typography>
            </Grid>
          )}
        </Grid>
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

      <Dialog
        open={deleteAllConfirmOpen}
        onClose={() => setDeleteAllConfirmOpen(false)}
      >
        <DialogTitle>Confirm Delete All</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete all budgets? This cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteAllConfirmOpen(false)}
            disabled={operationLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteAllConfirm}
            color="error"
            variant="contained"
            disabled={operationLoading}
          >
            {operationLoading ? "Deleting..." : "Delete All"}
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
