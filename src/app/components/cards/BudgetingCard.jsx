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
  LinearProgress,
  Divider,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  DeleteSweep as DeleteSweepIcon,
  TrendingUp as TrendingUpIcon,
  AccountBalance as AccountBalanceIcon,
} from "@mui/icons-material";
import { format } from "date-fns";

export default function BudgetingCard() {
  const theme = useTheme();
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
        minHeight="300px"
      >
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert
        severity="error"
        sx={{
          mb: 2,
          borderRadius: 2,
          boxShadow: theme.shadows[2],
        }}
      >
        Error: {error.message}
      </Alert>
    );
  }

  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        background: `linear-gradient(145deg, ${
          theme.palette.background.paper
        }, ${alpha(theme.palette.primary.main, 0.05)})`,
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <AccountBalanceIcon
              sx={{ fontSize: 32, color: theme.palette.primary.main }}
            />
            <Typography variant="h4" fontWeight="bold">
              Budget Management
            </Typography>
          </Box>
          <Box>
            <Tooltip title="Delete All Budgets">
              <IconButton
                onClick={() => setDeleteAllConfirmOpen(true)}
                disabled={!budgets?.length || operationLoading}
                color="error"
                sx={{
                  mr: 2,
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.error.main, 0.1),
                  },
                }}
              >
                <DeleteSweepIcon />
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              onClick={() => handleOpenModal()}
              disabled={operationLoading}
              startIcon={<AddIcon />}
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1,
                textTransform: "none",
                fontWeight: "bold",
                boxShadow: theme.shadows[2],
                "&:hover": {
                  boxShadow: theme.shadows[4],
                },
              }}
            >
              Add Budget
            </Button>
          </Box>
        </Box>

        {/* Remaining Budgets Section */}
        <Paper
          elevation={2}
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 3,
            background: `linear-gradient(145deg, ${
              theme.palette.background.paper
            }, ${alpha(theme.palette.primary.main, 0.05)})`,
          }}
        >
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <TrendingUpIcon color="primary" />
            <Typography variant="h5" fontWeight="bold">
              Remaining Budgets
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {remainingBudgets?.map((budget) => {
              const total = Number(budget.budgeted_amount || 0);
              const spent = Number(budget.spent_amount || 0);
              const percent = total ? Math.min((spent / total) * 100, 100) : 0;

              return (
                <Grid item xs={12} sm={6} md={4} key={budget.id}>
                  <Paper
                    elevation={2}
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      borderLeft: 4,
                      borderColor:
                        budget.remaining < 0 ? "error.main" : "success.main",
                      transition: "all 0.3s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: theme.shadows[4],
                      },
                      background: `linear-gradient(145deg, ${
                        theme.palette.background.paper
                      }, ${alpha(theme.palette.primary.main, 0.05)})`,
                    }}
                  >
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        fontWeight: "bold",
                        color: theme.palette.text.primary,
                      }}
                    >
                      {budget.category || "Uncategorized"}
                    </Typography>
                    <Typography
                      variant="h4"
                      color={budget.remaining < 0 ? "error" : "success"}
                      sx={{ fontWeight: "bold", mb: 1 }}
                    >
                      ₱ {Math.abs(budget.remaining).toLocaleString()}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {budget.remaining < 0 ? "Over Budget" : "Remaining"}
                    </Typography>
                    <Box mb={2}>
                      <Chip
                        size="small"
                        label={`Spent: ₱ ${spent.toLocaleString()}`}
                        variant="outlined"
                        sx={{
                          borderRadius: 2,
                          fontWeight: "medium",
                        }}
                      />
                    </Box>
                    <Box>
                      <LinearProgress
                        variant="determinate"
                        value={percent}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.1
                          ),
                          "& .MuiLinearProgress-bar": {
                            borderRadius: 4,
                          },
                        }}
                        color={percent >= 100 ? "error" : "primary"}
                      />
                      <Typography
                        variant="caption"
                        display="block"
                        align="right"
                        mt={1}
                        color="text.secondary"
                      >
                        {Math.round(percent)}% used
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              );
            })}
            {(!remainingBudgets || remainingBudgets.length === 0) && (
              <Grid item xs={12}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    textAlign: "center",
                    borderRadius: 3,
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  }}
                >
                  <Typography variant="h6" color="text.secondary">
                    No remaining budgets to display
                  </Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
        </Paper>

        {/* Budget List */}
        <Box>
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              fontWeight: "bold",
              mb: 3,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <AccountBalanceIcon color="primary" />
            Your Budgets
          </Typography>
          <List sx={{ p: 0 }}>
            {budgets?.map((budget) => (
              <ListItem
                key={budget.id}
                component={Paper}
                elevation={2}
                sx={{
                  mb: 2,
                  p: 3,
                  borderRadius: 3,
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    transform: "translateX(5px)",
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  },
                }}
              >
                <ListItemText
                  primary={
                    <Typography variant="h6" fontWeight="bold">
                      {budget.name}
                    </Typography>
                  }
                  secondary={
                    <Box mt={1}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 0.5 }}
                      >
                        <strong>Category:</strong>{" "}
                        {budget.category || "Uncategorized"}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 0.5 }}
                      >
                        <strong>Period:</strong>{" "}
                        {format(new Date(budget.start_date), "MMM d, yyyy")} -{" "}
                        {format(new Date(budget.end_date), "MMM d, yyyy")}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Amount: </strong>₱{" "}
                        {Number(budget.amount).toLocaleString()}
                      </Typography>
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <Tooltip title="Edit Budget">
                    <IconButton
                      edge="end"
                      onClick={() => handleOpenModal(budget)}
                      sx={{
                        mr: 1,
                        "&:hover": {
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.1
                          ),
                        },
                      }}
                      disabled={operationLoading}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Budget">
                    <IconButton
                      edge="end"
                      onClick={() => handleDeleteClick(budget)}
                      sx={{
                        "&:hover": {
                          backgroundColor: alpha(theme.palette.error.main, 0.1),
                        },
                      }}
                      disabled={operationLoading}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
            {(!budgets || budgets.length === 0) && (
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  textAlign: "center",
                  borderRadius: 3,
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                }}
              >
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No budgets found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Add a new budget to get started
                </Typography>
              </Paper>
            )}
          </List>
        </Box>
      </CardContent>

      {/* Add/Edit Modal */}
      <BudgetModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        editing={editing}
        loading={operationLoading}
      />

      {/* Confirm Delete Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the budget "{budgetToDelete?.name}"?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setDeleteConfirmOpen(false)}
            disabled={operationLoading}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={operationLoading}
            sx={{
              borderRadius: 2,
              px: 3,
              "&:hover": {
                backgroundColor: theme.palette.error.dark,
              },
            }}
          >
            {operationLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete All Dialog */}
      <Dialog
        open={deleteAllConfirmOpen}
        onClose={() => setDeleteAllConfirmOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Confirm Delete All
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete all budgets? This cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setDeleteAllConfirmOpen(false)}
            disabled={operationLoading}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteAllConfirm}
            color="error"
            variant="contained"
            disabled={operationLoading}
            sx={{
              borderRadius: 2,
              px: 3,
              "&:hover": {
                backgroundColor: theme.palette.error.dark,
              },
            }}
          >
            {operationLoading ? "Deleting..." : "Delete All"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{
            width: "100%",
            borderRadius: 2,
            boxShadow: theme.shadows[4],
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Card>
  );
}
