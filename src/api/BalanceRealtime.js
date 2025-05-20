import { useEffect } from "react";
import { supabase } from "../supabase";
import { useAuth } from "../contexts/AuthProvider";
import { useQueryClient } from "@tanstack/react-query";

// para ni live and value mo change if naay update sa balance

const RealtimeBalanceListener = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel("realtime-balance")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "BalanceTbl",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["balance", user.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  return null; // No UI, just background listener
};

export default RealtimeBalanceListener;
