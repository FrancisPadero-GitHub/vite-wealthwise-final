import React, { useState } from "react";
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
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Tooltip,
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

  const handleCloseModal = () => {
    setModalOpen(false);
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

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
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
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Error: {error.message}
      </Alert>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h5">Budget Management</Typography>
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

        {/* Remaining Budgets Section */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Remaining Budgets
          </Typography>
          <Grid container spacing={2}>
            {remainingBudgets?.map((remaining_budget) => (
              <Grid item xs={12} sm={6} md={4} key={remaining_budget.id}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    borderLeft: 4,
                    borderColor:
                      (remaining_budget.remaining || 0) < 0
                        ? "error.main"
                        : "success.main",
                    transition: "transform 0.2s ease-in-out",
                    "&:hover": {
                      transform: "scale(1.02)",
                    },
                  }}
                >
                  <Typography variant="subtitle1" gutterBottom>
                    {remaining_budget.category || "Uncategorized"}
                  </Typography>
                  <Typography
                    variant="h6"
                    color={
                      (remaining_budget.remaining || 0) < 0
                        ? "error"
                        : "success"
                    }
                  >
                    ₱{" "}
                    {Math.abs(remaining_budget.remaining || 0).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {(remaining_budget.remaining || 0) < 0
                      ? "Over Budget"
                      : "Remaining"}
                  </Typography>
                  <Box mt={1}>
                    <Chip
                      size="small"
                      label={`Total:₱ ${(
                        remaining_budget.spent_amount || 0
                      ).toLocaleString()}`}
                      variant="outlined"
                    />
                  </Box>
                </Paper>
              </Grid>
            ))}
            {(!remainingBudgets || remainingBudgets.length === 0) && (
              <Grid item xs={12}>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  align="center"
                >
                  No remaining budgets to display
                </Typography>
              </Grid>
            )}
          </Grid>
        </Paper>

        {/* Budget List */}
        <Typography variant="h6" gutterBottom>
          Your Budgets
        </Typography>
        <List>
          {budgets?.map((budget_table) => (
            <ListItem
              key={budget_table.id}
              component={Paper}
              elevation={1}
              sx={{
                mb: 2,
                p: 2,
                transition: "transform 0.2s ease-in-out",
                "&:hover": {
                  transform: "scale(1.01)",
                  backgroundColor: "action.hover",
                },
              }}
            >
              <ListItemText
                primary={budget_table.name}
                secondary={
                  <>
                    <Typography variant="body2">
                      <strong>Category:</strong>{" "}
                      {budget_table.category || "Uncategorized"}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Period:</strong>{" "}
                      {format(new Date(budget_table.start_date), "MMM d, yyyy")} -{" "}
                      {format(new Date(budget_table.end_date), "MMM d, yyyy")}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Amount: </strong>
                      <>₱ </>
                      {Number(budget_table.amount || 0).toLocaleString()}
                    </Typography>
                  </>
                }
              />
              <ListItemSecondaryAction>
                <Tooltip title="Edit Budget">
                  <IconButton
                    edge="end"
                    onClick={() => handleOpenModal(budget_table)}
                    sx={{ mr: 1 }}
                    disabled={operationLoading}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete Budget">
                  <IconButton
                    edge="end"
                    onClick={() => handleDeleteClick(budget_table)}
                    disabled={operationLoading}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
          {(!budgets || budgets.length === 0) && (
            <ListItem>
              <ListItemText
                primary="No budgets found"
                secondary="Add a new budget to get started"
              />
            </ListItem>
          )}
        </List>
      </CardContent>

      {/* Add/Edit Budget Modal */}
      <BudgetModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        editing={editing}
        loading={operationLoading}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the budget "{budgetToDelete?.name}"?
            This action cannot be undone.
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

      {/* Delete All Confirmation Dialog */}
      <Dialog
        open={deleteAllConfirmOpen}
        onClose={() => setDeleteAllConfirmOpen(false)}
      >
        <DialogTitle>Confirm Delete All</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete all budgets? This action cannot be
            undone.
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

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
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
