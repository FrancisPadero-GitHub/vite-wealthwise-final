import { useState, useEffect } from "react";
import { supabase } from "../supabase";

export const useBudgeting = () => {
  const [budgets, setBudgets] = useState([]);
  const [remainingBudgets, setRemainingBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch budgets
  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("budgetingTbl")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBudgets(data || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch remaining budgets
  const fetchRemainingBudgets = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user?.id) return;

      const { data, error } = await supabase
        .from("remaining_budgets")
        .select("*")
        .eq("user_id", userData.user.id);

      if (error) throw error;
      setRemainingBudgets(data || []);
      console.log(data);
    } catch (error) {
      setError(error.message);
    }
  };

  // Add new budget
  const addBudget = async (budgetData) => {
    try {
      const { data, error } = await supabase
        .from("budgetingTbl")
        .insert([
          {
            ...budgetData,
            amount: parseInt(budgetData.amount),
            user_id: (await supabase.auth.getUser()).data.user.id,
          },
        ])
        .select();

      if (error) throw error;
      setBudgets((prev) => [data[0], ...prev]);
      await fetchRemainingBudgets(); // Refresh remaining budgets
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Update budget
  const updateBudget = async (id, budgetData) => {
    try {
      const { data, error } = await supabase
        .from("budgetingTbl")
        .update({
          ...budgetData,
          amount: parseInt(budgetData.amount),
        })
        .eq("id", id)
        .select();

      if (error) throw error;
      setBudgets((prev) =>
        prev.map((budget) => (budget.id === id ? data[0] : budget))
      );
      await fetchRemainingBudgets(); // Refresh remaining budgets
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Delete budget
  const deleteBudget = async (id) => {
    try {
      const { error } = await supabase
        .from("budgetingTbl")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setBudgets((prev) => prev.filter((budget) => budget.id !== id));
      await fetchRemainingBudgets(); // Refresh remaining budgets
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchBudgets();
    fetchRemainingBudgets();
  }, []);

  return {
    budgets,
    remainingBudgets,
    loading,
    error,
    addBudget,
    updateBudget,
    deleteBudget,
    refreshBudgets: fetchBudgets,
    refreshRemainingBudgets: fetchRemainingBudgets,
  };
};
