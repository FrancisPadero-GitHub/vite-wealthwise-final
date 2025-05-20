import { useEffect } from "react";
import { supabase } from "../supabase";
import { useAuth } from "../contexts/AuthProvider";
import { useQueryClient } from "@tanstack/react-query";

const RemindersRealtimeListener = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel("realtime-reminders")
      .on(
        "postgres_changes",
        {
          event: "*", // Listen for all events (INSERT, UPDATE, DELETE)
          schema: "public",
          table: "reminders",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          // Invalidate reminders query when any change occurs
          queryClient.invalidateQueries({
            queryKey: ["reminders", user.id],
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

export default RemindersRealtimeListener;
