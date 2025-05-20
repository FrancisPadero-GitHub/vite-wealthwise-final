import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase";
import { useAuth } from "../contexts/AuthProvider";

export function useBudgeting() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Fetch all budgets for the user
  const {
    data: budgets,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["budgets", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from("budgetingTbl")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch remaining budgets
  const { data: remainingBudgets } = useQuery({
    queryKey: ["remaining_budgets", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from("remaining_budgets")
        .select("*")
        .order("budget_id", { ascending: false })
        .eq("user_id", user.id);

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Add new budget
  const addBudgetMutation = useMutation({
    mutationFn: async (budget) => {
      if (!user?.id) throw new Error("User not authenticated");

      const { error } = await supabase.from("budgetingTbl").insert([
        {
          ...budget,
          user_id: user.id,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets", user.id] });
      queryClient.invalidateQueries({ queryKey: ["remaining_budgets", user.id] });
    },
  });

  // Update existing budget
  const updateBudgetMutation = useMutation({
    mutationFn: async ({ id, updatedData }) => {
      if (!user?.id) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("budgetingTbl")
        .update({
          ...updatedData,
        })
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets", user.id] });
      queryClient.invalidateQueries({ queryKey: ["remaining_budgets", user.id] });
    },
  });

  // Delete a budget
  const deleteBudgetMutation = useMutation({
    mutationFn: async (id) => {
      if (!user?.id) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("budgetingTbl")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets", user.id] });
      queryClient.invalidateQueries({ queryKey: ["remaining_budgets", user.id] });
    },
  });

  // Delete all budgets
  const deleteAllBudgetsMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("budgetingTbl")
        .delete()
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets", user.id] });
      queryClient.invalidateQueries({
        queryKey: ["remaining_budgets", user.id],
      });
    },
  });

  return {
    budgets,
    remainingBudgets,
    loading,
    error,
    addBudget: addBudgetMutation.mutateAsync,
    updateBudget: (id, updatedData) =>
      updateBudgetMutation.mutateAsync({ id, updatedData }),
    deleteBudget: deleteBudgetMutation.mutateAsync,
    deleteAllBudgets: deleteAllBudgetsMutation.mutateAsync,
  };
}
