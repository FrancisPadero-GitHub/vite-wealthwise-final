import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { supabase } from "../../supabase";

export default function Register() {
  const navigate = useNavigate();

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleRegistration(event) {
    event.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    if (password !== cpassword) {
      setErrorMsg("Passwords do not match.");
      setLoading(false);
      return;
    }

    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          first_name: firstname,
          last_name: lastname,
        },
      },
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    }

    if (session) {
      setLoading(false);
      setSuccessMsg("Account created successfully!");
      setTimeout(() => {
        navigate("/login");
      }, 2500);
    }
  }

  return (
    <Box
      maxWidth={500}
      mx="auto"
      mt={8}
      p={4}
      boxShadow={3}
      borderRadius={2}
      component="form"
      onSubmit={handleRegistration}
    >
      <Typography variant="h5" mb={3} align="center">
        Create Account
      </Typography>

      {errorMsg && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMsg}
        </Alert>
      )}
      {successMsg && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMsg}
        </Alert>
      )}

      <TextField
        label="First Name"
        fullWidth
        required
        value={firstname}
        onChange={(e) => setFirstname(e.target.value)}
        margin="normal"
        disabled={loading}
      />
      <TextField
        label="Last Name"
        fullWidth
        required
        value={lastname}
        onChange={(e) => setLastname(e.target.value)}
        margin="normal"
        disabled={loading}
      />
      <TextField
        label="Email"
        type="email"
        fullWidth
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        margin="normal"
        disabled={loading}
      />
      <TextField
        label="Password"
        type={showPassword ? "text" : "password"}
        fullWidth
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        margin="normal"
        disabled={loading}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
                disabled={loading}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <TextField
        label="Confirm Password"
        type={showPassword ? "text" : "password"}
        fullWidth
        required
        value={cpassword}
        onChange={(e) => setCPassword(e.target.value)}
        margin="normal"
        disabled={loading}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
                disabled={loading}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Box mt={3} textAlign="center">
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          fullWidth
          size="large"
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? "Creating..." : "Register"}
        </Button>
      </Box>

      <Box mt={2} textAlign="center">
        <Typography variant="body2">
          Already have an account?{" "}
          <Button
            component={Link}
            to="/login"
            size="small"
            sx={{ textTransform: "none", padding: 0 }}
          >
            Login
          </Button>
        </Typography>
      </Box>
    </Box>
  );
}
