import React, { useState, useEffect } from "react";
import { useBudgeting } from "../../../hooks/useBudgeting";
import BudgetModal from "../modals/BudgetModal";
import BudgetRealtime from "../../../api/BudgetRealtime";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Tooltip,
  LinearProgress,
} from "@mui/material";
import {
  EditOutlined,
  Add as AddIcon,
  Category as CategoryIcon,
  CalendarToday as CalendarTodayIcon,
} from "@mui/icons-material";

import { format } from "date-fns";

export default function BudgetingCard() {
  const { budgets, remainingBudgets, loading, error } = useBudgeting();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);

  const handleOpenModal = (budget = null) => {
    setSelectedBudget(budget);
    setEditing(!!budget);
    setModalOpen(true);
  };

  // For the loading animation
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
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
      <BudgetRealtime />
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            💰 Recent Budgets
          </Typography>

          <IconButton color="success" onClick={() => handleOpenModal()}>
            <AddIcon />
          </IconButton>
        </Box>

        {/* Remaining Budgets */}
        <Typography variant="body1" gutterBottom>
          Remaining Amounts
        </Typography>
        <Box sx={{ overflowX: "auto", mb: 3 }}>
          <Grid
            container
            spacing={2}
            sx={{
              minWidth: "max-content",
              pb: 2,
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
                  <Grid key={budget.budget_id}>
                    <Card
                      elevation={4}
                      sx={{
                        borderLeft: 4,
                        width: 250,
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
                          ₱ {budget.remaining.toLocaleString()}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          mb={2}
                        >
                          {budget.remaining < 0 ? "Over Budget" : "Remaining"}
                        </Typography>

                        <Box display="flex" justifyContent="center">
                          <Chip
                            size="small"
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
              <Grid mt={1}>
                <Typography
                  variant="body2"
                  align="center"
                  color="text.secondary"
                >
                  Add a budget to get started
                </Typography>
              </Grid>
            )}
          </Grid>
        </Box>

        {/* All Budgets List */}
        <Typography variant="body1" gutterBottom>
          All Budgets
        </Typography>
        <Box sx={{ overflowX: "auto" }}>
          <Grid
            container
            spacing={2}
            sx={{
              minWidth: "max-content",
              pb: 2,
            }}
          >
            {budgets?.length > 0 ? (
              budgets.map((budget) => (
                <Grid key={budget.id}>
                  <Card
                    elevation={4}
                    sx={{
                      width: 250,
                      transition: "transform 0.5s",
                      "&:hover": { transform: "scale(1.02)" },
                      background:
                        "linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)",
                      borderLeft: "4px solid #2196f3",
                    }}
                  >
                    <CardContent>
                      <Box>
                        <Box>
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                          >
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

                            <Box>
                              <Tooltip title="Edit Budget">
                                <IconButton
                                  onClick={() => handleOpenModal(budget)}
                                  sx={{
                                    color: "#2196f3",
                                    "&:hover": {
                                      backgroundColor:
                                        "rgba(33, 150, 243, 0.1)",
                                    },
                                  }}
                                >
                                  <EditOutlined />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </Box>

                          <Typography
                            variant="body1"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 1,
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
                              gap: 1,
                              mb: 1,
                            }}
                          >
                            <CategoryIcon
                              sx={{
                                color: "#4caf50",
                                fontSize: "1rem",
                                pb: 0.5,
                              }}
                            />
                            {budget.category || "Uncategorized"}
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{
                              color: "#666",
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              mb: 1,
                            }}
                          >
                            <CalendarTodayIcon
                              sx={{
                                color: "#ff9800",
                                fontSize: "1rem",
                                pb: 0.5,
                              }}
                            />
                            {format(new Date(budget.start_date), "MMM d, yyyy")}{" "}
                            - {format(new Date(budget.end_date), "MMM d, yyyy")}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid mt={1}>
                <Typography
                  variant="body2"
                  align="center"
                  color="text.secondary"
                >
                  Click the + icon to add a new budget.
                </Typography>
              </Grid>
            )}
          </Grid>
        </Box>
      </CardContent>

      <BudgetModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editing={editing}
        initialData={selectedBudget}
      />
    </Card>
  );
}
