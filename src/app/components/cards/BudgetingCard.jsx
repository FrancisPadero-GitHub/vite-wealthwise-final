import React, { useState } from "react";
import { useBudgeting } from "../../../hooks/useBudgeting";
import { format } from "date-fns";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  CircularProgress,
  Alert,
  Divider,
  Chip,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";

function BudgetingCard() {
  const {
    budgets,
    remainingBudgets,
    loading,
    error,
    addBudget,
    updateBudget,
    deleteBudget,
  } = useBudgeting();

  const [formData, setFormData] = useState({
    category: "",
    name: "",
    start_date: "",
    end_date: "",
    amount: "",
  });

  const [editingId, setEditingId] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateBudget(editingId, formData);
      setEditingId(null);
    } else {
      await addBudget(formData);
    }
    setFormData({
      category: "",
      name: "",
      start_date: "",
      end_date: "",
      amount: "",
    });
  };

  const handleEdit = (budget) => {
    setEditingId(budget.id);
    setFormData({
      category: budget.category,
      name: budget.name,
      start_date: format(new Date(budget.start_date), "yyyy-MM-dd"),
      end_date: format(new Date(budget.end_date), "yyyy-MM-dd"),
      amount: budget.amount,
    });
  };

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

  if (error)
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Error: {error.message}
      </Alert>
    );

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          Budget Management
        </Typography>

        {/* Remaining Budgets Summary */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Remaining Budgets
          </Typography>
          <Grid container spacing={2}>
            {remainingBudgets?.map((budget) => (
              <Grid item xs={12} sm={6} md={4} key={budget.id}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    borderLeft: 4,
                    borderColor:
                      (budget.remaining_amount || 0) < 0
                        ? "error.main"
                        : "success.main",
                  }}
                >
                  <Typography variant="subtitle1" gutterBottom>
                    {budget.category || "Uncategorized"}
                  </Typography>
                  <Typography
                    variant="h6"
                    color={
                      (budget.remaining_amount || 0) < 0 ? "error" : "success"
                    }
                  >
                    ${Math.abs(budget.remaining_amount || 0).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {(budget.remaining_amount || 0) < 0
                      ? "Over Budget"
                      : "Remaining"}
                  </Typography>
                  <Box mt={1}>
                    <Chip
                      size="small"
                      label={`Total: $${(
                        budget.total_amount || 0
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

        {/* Budget Form */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Start Date"
                  name="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="End Date"
                  name="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Amount"
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                >
                  {editingId ? "Update Budget" : "Add Budget"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>

        {/* Budget List */}
        <Typography variant="h6" gutterBottom>
          Your Budgets
        </Typography>
        <List>
          {budgets?.map((budget) => (
            <ListItem
              key={budget.id}
              component={Paper}
              elevation={1}
              sx={{ mb: 2, p: 2 }}
            >
              <ListItemText
                primary={budget.name}
                secondary={
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      Category: {budget.category || "Uncategorized"}
                    </Typography>
                    <br />
                    <Typography component="span" variant="body2">
                      Period:{" "}
                      {format(new Date(budget.start_date), "MMM d, yyyy")} -{" "}
                      {format(new Date(budget.end_date), "MMM d, yyyy")}
                    </Typography>
                    <br />
                    <Typography component="span" variant="body2">
                      Amount: ${(budget.amount || 0).toLocaleString()}
                    </Typography>
                  </>
                }
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => handleEdit(budget)}
                  sx={{ mr: 1 }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => deleteBudget(budget.id)}
                >
                  <DeleteIcon />
                </IconButton>
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
    </Card>
  );
}

export default BudgetingCard;
