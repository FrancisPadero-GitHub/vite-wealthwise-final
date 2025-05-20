import { useEffect } from "react";
import { supabase } from "../supabase";
import { useAuth } from "../contexts/AuthProvider";
import { useQueryClient } from "@tanstack/react-query";

const TransactionRealtimeListener = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel("realtime-transactions")
      .on(
        "postgres_changes",
        {
          event: "*", // Listen for all events (INSERT, UPDATE, DELETE)
          schema: "public",
          table: "TransactionTbl",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          // Invalidate both transactions and balance queries when any change occurs
          queryClient.invalidateQueries({ queryKey: ["transactions", user.id] });
          queryClient.invalidateQueries({ queryKey: ["balance", user.id] });
          queryClient.invalidateQueries({ queryKey: ["budgets", user.id] });
          queryClient.invalidateQueries({
            queryKey: ["remaining_budgets", user.id],
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  return null; // No UI, just background listener
};

export default TransactionRealtimeListener;
