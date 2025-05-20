import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase";
import { useAuth } from "../contexts/AuthProvider";

export const useProfile = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["profile", user.id],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });
};
