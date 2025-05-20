import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthProvider";
import { supabase } from "../supabase";

export function useBalance() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["balance", user.id],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error("User ID is undefined");
      }

      const { data, error } = await supabase
        .from("BalanceTbl")
        .select("amount")
        .eq("user_id", user.id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    enabled: !!user?.id, // only runs if user is logged in
  });
}
