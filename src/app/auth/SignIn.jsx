import { useState } from "react";
import wealthwise from "../../assets/img/wealthwise.png";
import { useNavigate, Link } from "react-router-dom";
import {
  Card,
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { supabase } from "../../supabase";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (!value) {
      setEmailError("Email is required");
    } else if (!validateEmail(value)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (!value) {
      setPasswordError("Password is required");
    } else {
      setPasswordError("");
    }
  };

  async function handleSubmit(event) {
    event.preventDefault();

    if (emailError || passwordError) {
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
    } else {
      navigate("/");
    }
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="80vh"
    >
      <Card
        elevation={3}
        sx={{
          maxWidth: 380,
          p: 3,
          borderRadius: 2,
          bgcolor: "#ffffff",
          "& .MuiTextField-root": {
            bgcolor: "#ffffff",
          },
        }}
        component="form"
        onSubmit={handleSubmit}
      >
        <Box display="flex" alignItems="center" justifyContent="center">
          <img
            src={wealthwise}
            alt="logo"
            style={{
              width: "90px",
              height: "90px",
              marginRight: "10px",
              marginBottom: "10px",
            }}
          />
          <Typography variant="h2" color="primary" sx={{ marginTop: "6%" }}>
            WealthWise
          </Typography>
        </Box>
        <Typography variant="body1" fontWeight="bold" align="center">
          🔐 Login
        </Typography>

        <FormControl fullWidth margin="normal" error={!!emailError}>
          <InputLabel htmlFor="email-input">📧 Email</InputLabel>
          <OutlinedInput
            id="email-input"
            type="email"
            value={email}
            onChange={handleEmailChange}
            label="📧 Email"
            disabled={loading}
            required
          />
          {emailError && <FormHelperText>{emailError}</FormHelperText>}
        </FormControl>

        <FormControl fullWidth margin="normal" error={!!passwordError}>
          <InputLabel htmlFor="password-input">🔑 Password</InputLabel>
          <OutlinedInput
            id="password-input"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={handlePasswordChange}
            label="🔑 Password"
            disabled={loading}
            required
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  disabled={loading}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          {passwordError && <FormHelperText>{passwordError}</FormHelperText>}
        </FormControl>

        {errorMsg && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {errorMsg}
          </Alert>
        )}
        <Box mt={2} textAlign="center">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading || !!emailError || !!passwordError}
            fullWidth
            size="large"
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? "Logging in..." : "Login 🔑"}
          </Button>
        </Box>
        <Box mt={2} textAlign="center">
          <Typography variant="body2">
            Don&apos;t have an account?{" "}
            <Button
              component={Link}
              to="/register"
              size="small"
              sx={{ textTransform: "none", padding: 0 }}
            >
              Create an account ✨
            </Button>
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}
