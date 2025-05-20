import { Box, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import NotFoundImage from "../../assets/img/wealthwise.png"; // Adjust path as needed

export default function PageNotFound() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        backgroundColor: "#f5f5f5",
        p: 3,
      }}
    >
      <Container maxWidth="sm">
        <Box my={3} display="flex" justifyContent="center" alignItems="center">
          <img
            src={NotFoundImage}
            alt="Page Not Found"
            style={{ width: "50%", maxWidth: 400 }}
          />
        </Box>
        <Typography variant="h1" component="h1" gutterBottom color="primary">
          404
        </Typography>
        <Typography variant="h6" mb={5}>
          The page you're looking for doesn't exist or just a typo or under
          construction.
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/")}
        >
          Back to Home
        </Button>
      </Container>
    </Box>
  );
}
