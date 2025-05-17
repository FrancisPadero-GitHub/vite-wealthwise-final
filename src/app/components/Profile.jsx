import { useEffect, useState } from "react";
import { Avatar, Box, Typography, CircularProgress } from "@mui/material";
import { supabase } from "../../supabase";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error("User fetch error:", userError.message);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Profile fetch error:", error.message);
      } else {
        setProfile(data);
      }

      setLoading(false);
    }

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="h6">Profile not found.</Typography>
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
      <Avatar
        src={profile.avatar_url}
        sx={{ width: 120, height: 120, mb: 2 }}
      />
      <Typography variant="h5">{profile.full_name}</Typography>
    </Box>
  );
}
