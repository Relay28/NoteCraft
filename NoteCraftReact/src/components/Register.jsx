import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import axios from 'axios';

export default function SignIn() {
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    birthdate: "",
    email: "",
    username: "",
    password: "",
  });
  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.height = "100vh";
    document.body.style.width = "100vw";
    document.body.style.backgroundColor = "#fafafa";
    document.body.style.overflow = "hidden";

    return () => {
      // Clean up styles when component unmounts
      document.body.style.margin = "";
      document.body.style.padding = "";
      document.body.style.height = "";
      document.body.style.width = "";
      document.body.style.backgroundColor = "";
      document.body.style.overflow = "";
    };
  }, []);
  const [showPassword, setShowPassword] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");  // Error state for password
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Password validation regex
  const passwordValidationRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUsernameError("");
    setEmailError("");
    setPasswordError(""); // Reset password error
  
    const { password } = personalInfo;
  
    // Password validation regex (at least 8 characters, 1 number, 1 special character)
    const passwordValidationRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;
  
    // Check if password meets the criteria
    if (!passwordValidationRegex.test(password)) {
      setPasswordError("Password must be at least 8 characters long, contain one number and one special character.");
      return; // Prevent form submission if password is invalid
    }
  
    try {
      // Check username availability
      const usernameResponse = await axios.get(
        "http://localhost:8081/api/user/checkAvailability",
        {
          params: { username: personalInfo.username },
        }
      );
  
      // Check email availability
      const emailResponse = await axios.get(
        "http://localhost:8081/api/user/checkAvailability",
        {
          params: { email: personalInfo.email },
        }
      );
  
      if (!usernameResponse.data.available) {
        setUsernameError("Username is taken");
      }
  
      if (!emailResponse.data.available) {
        setEmailError("Email is taken");
      }
  
      // If both username and email are available, create the user
      if (usernameResponse.data.available && emailResponse.data.available) {
        const response = await axios.post(
          "http://localhost:8081/api/user/insertUserRecord",
          personalInfo
        );
        navigate("/login", { state: { account: response.data } });
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <Grid
      container
      sx={{
        height: "100vh", 
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        padding: 2,
        boxSizing: "border-box",
        overflow: "hidden", 
      }}
    >
      <Box
        sx={{
          width: "360px", // Control form width
          padding: "20px",
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          boxShadow: "0px 4px 24px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: '30px'
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, marginBottom: 2, color: "#333", fontSize: "20px" }}
        >
          Register
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "#555", marginBottom: 3, fontSize: "12px" }}
        >
          Please fill in the details below to create your account.
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="First Name"
            name="firstName"
            value={personalInfo.firstName}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            required
            sx={{ marginBottom: 2, fontSize: "12px" }}
            size="small"
          />
          <TextField
            label="Last Name"
            name="lastName"
            value={personalInfo.lastName}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            required
            sx={{ marginBottom: 2, fontSize: "12px" }}
            size="small"
          />
          <TextField
            label="Birthdate"
            name="birthdate"
            type="date"
            value={personalInfo.birthdate}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            required
            sx={{ marginBottom: 2, fontSize: "12px" }}
            size="small"
          />
          <TextField
            label="Email"
            name="email"
            value={personalInfo.email}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            type="email"
            required
            error={!!emailError}
            helperText={emailError}
            sx={{ marginBottom: 2, fontSize: "12px" }}
            size="small"
          />
          <TextField
            label="Username"
            name="username"
            value={personalInfo.username}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            required
            error={!!usernameError}
            helperText={usernameError}
            sx={{ marginBottom: 2, fontSize: "12px" }}
            size="small"
          />
          <TextField
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={personalInfo.password}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            required
            error={!!passwordError}
            helperText={passwordError || "Password must be at least 8 characters long, contain one number and one special character."}
            InputProps={{
              endAdornment: (
                <IconButton sx={{ height:"12px", width:"12px" }} onClick={togglePasswordVisibility}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
            sx={{ marginBottom: 3 , fontSize: "12px"}}
            size="small"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: "#579A59",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "14px",
              padding: "10px 0",
              borderRadius: "8px",
              "&:hover": { backgroundColor: "#1da23d" },
            }}
          >
            Sign Up
          </Button>
        </form>
        <Typography
          variant="body2"
          sx={{ marginTop: 2, color: "#888", fontSize: "12px" }}
        >
          Already have an account?{" "}
          <span
            style={{
              color: "#579A59",
              cursor: "pointer",
              textDecoration: "underline",
            }}
            onClick={() => navigate("/login")}
          >
            Sign in
          </span>
        </Typography>
      </Box>
    </Grid>
  );
}
