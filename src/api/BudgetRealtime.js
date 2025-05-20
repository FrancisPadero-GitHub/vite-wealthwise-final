import { useEffect } from "react";
import { supabase } from "../supabase";
import { useAuth } from "../contexts/AuthProvider";
import { useQueryClient } from "@tanstack/react-query";

const BudgetRealtimeListener = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user?.id) return;

    // Listen for changes in the main budgets table
    const budgetsChannel = supabase
      .channel("realtime-budgets")
      .on(
        "postgres_changes",
        {
          event: "*", // Listen for all events (INSERT, UPDATE, DELETE)
          schema: "public",
          table: "budgetingTbl",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          // Invalidate both budgets and remaining budgets queries
          queryClient.invalidateQueries({ queryKey: ["budgets", user.id] });
          queryClient.invalidateQueries({
            queryKey: ["remaining_budgets", user.id],
          });
        }
      )
      .subscribe();

    // Listen for changes in the remaining budgets table
    const remainingBudgetsChannel = supabase
      .channel("realtime-remaining-budgets")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "remaining_budgets",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          // Invalidate remaining budgets query
          queryClient.invalidateQueries({
            queryKey: ["remaining_budgets", user.id],
          });
        }
      )
      .subscribe();

    return () => {
      // Clean up both channels when component unmounts
      supabase.removeChannel(budgetsChannel);
      supabase.removeChannel(remainingBudgetsChannel);
    };
  }, [user, queryClient]);

  return null; // No UI, just background listener
};

export default BudgetRealtimeListener;
