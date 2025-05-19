import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthProvider";
import { supabase } from "../supabase";

export function useBalance() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["balance"],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error("User ID is undefined");
      }

      // First try to fetch existing balance
      const { data, error } = await supabase
        .from("BalanceTbl")
        .select("amount")
        .eq("user_id", user.id)
        .single();

      // If no record exists (error.code === 'PGRST116'), insert a default one
      if (error?.code === "PGRST116") {
        const { data: newData, error: insertError } = await supabase
          .from("BalanceTbl")
          .insert([{ user_id: user.id, amount: 0, cash_balance: "cash" }])
          .select()
          .single();

        if (insertError) {
          throw new Error(insertError.message);
        }

        return newData;
      }

      // If there was an error other than "no rows returned", throw it
      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    enabled: !!user?.id, // only runs if user is logged in
  });
}
