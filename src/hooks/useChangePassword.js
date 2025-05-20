import { useMutation } from "@tanstack/react-query";
import { supabase } from "../supabase";
import { useAuth } from "../contexts/AuthProvider";

export const useChangePassword = () => {
  const { user } = useAuth();

  const changePassword = useMutation({
    mutationFn: async ({ currentPassword, newPassword }) => {
      // First verify the current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (signInError) {
        throw new Error("Current password is incorrect");
      }

      // If current password is correct, update to new password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        throw updateError;
      }

      return { message: "Password updated successfully" };
    },
  });

  return {
    changePassword: changePassword.mutateAsync,
    isChanging: changePassword.isPending,
    error: changePassword.error,
  };
};
