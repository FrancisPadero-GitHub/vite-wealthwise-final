// lib/hooks/useReminders.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase";
import { useAuth } from "../contexts/AuthProvider";

export const useReminders = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["reminders"],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from("reminders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Filter based on string values "true" / "false"
  const tasks = data?.filter((task) => task.is_completed !== "true") || [];
  const completedTasks =
    data?.filter((task) => task.is_completed === "true") || [];

  const addTask = useMutation({
    mutationFn: async ({ title, description, date }) => {
      if (!user?.id) throw new Error("User not authenticated");

      const { error } = await supabase.from("reminders").insert([
        {
          title,
          description,
          due_date: date,
          user_id: user.id,
          created_at: new Date().toISOString(),
          is_completed: "false", // set default as string "false"
        },
      ]);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reminders"] }),
  });

  const updateTask = useMutation({
    mutationFn: async ({ id, title, description, date }) => {
      const { error } = await supabase
        .from("reminders")
        .update({
          title,
          description,
          due_date: date,
        })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reminders"] }),
  });

  const deleteTask = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("reminders").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reminders"] }),
  });

  const toggleStatus = useMutation({
    mutationFn: async ({ id, is_completed }) => {
      // Save is_completed as string "true" or "false"
      const statusString = is_completed ? "true" : "false";

      const { error } = await supabase
        .from("reminders")
        .update({ is_completed: statusString })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reminders"] }),
  });

  return {
    tasks,
    completedTasks,
    addTask: addTask.mutateAsync,
    updateTask: updateTask.mutateAsync,
    deleteTask: deleteTask.mutateAsync,
    toggleStatus: async (id, status) => {
      await toggleStatus.mutateAsync({ id, is_completed: status });
    },
    isLoading,
  };
};
