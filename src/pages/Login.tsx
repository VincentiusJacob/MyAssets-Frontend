"use client";

import type React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  IconButton,
  InputAdornment,
  Divider,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  ArrowBack,
  AttachMoney,
} from "@mui/icons-material";
import axios from "axios";
import "./Login.css";
import Logo from "../assets/myassetslogo.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorLogin, setErrorLogin] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrorLogin("");

    try {
      const result = await axios.post(
        "https://myassets-backend.vercel.app/auth/login",
        {
          email: email,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (result.status === 200) {
        localStorage.setItem(
          "data",
          JSON.stringify({ email: email, username: result.data.user.username })
        );

        // Add a small delay for better UX
        setTimeout(() => {
          navigate("/Dashboard");
        }, 500);
      }
    } catch (err: any) {
      setErrorLogin(
        err.response?.data?.message || "Login failed. Please try again."
      );
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      {/* Animated Background */}
      <div className="login-background">
        <div className="login-blob login-blob-1"></div>
        <div className="login-blob login-blob-2"></div>
        <div className="login-blob login-blob-3"></div>
      </div>

      {/* Back Button */}
      <IconButton
        className="back-button"
        onClick={() => navigate("/")}
        sx={{
          position: "absolute",
          top: 24,
          left: 24,
          zIndex: 10,
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          color: "white",
          "&:hover": {
            background: "rgba(255, 255, 255, 0.2)",
            transform: "scale(1.1)",
          },
        }}
      >
        <ArrowBack />
      </IconButton>

      {/* Main Content */}
      <Box className="login-container">
        <Card className="login-card">
          <CardContent className="login-card-content">
            {/* Logo and Title */}
            <Box className="login-header">
              <img src={Logo} width={100} height={100} />
              <Typography variant="h3" className="login-title">
                Welcome Back
              </Typography>
              <Typography variant="h6" className="login-subtitle">
                Sign in to your MyAssets account
              </Typography>
            </Box>

            {/* Login Form */}
            <Box
              component="form"
              onSubmit={handleSubmit}
              className="login-form"
            >
              <TextField
                fullWidth
                type="email"
                label="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="login-input"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email className="input-icon" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    background: "rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(10px)",
                    "& fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.2)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(37, 99, 235, 0.5)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#2563eb",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "rgba(255, 255, 255, 0.7)",
                  },
                  "& .MuiOutlinedInput-input": {
                    color: "white",
                  },
                }}
              />

              <TextField
                fullWidth
                type={showPassword ? "text" : "password"}
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="login-input"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock className="input-icon" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    background: "rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(10px)",
                    "& fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.2)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(37, 99, 235, 0.5)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#2563eb",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "rgba(255, 255, 255, 0.7)",
                  },
                  "& .MuiOutlinedInput-input": {
                    color: "white",
                  },
                }}
              />

              {errorLogin && (
                <Alert severity="error" className="error-alert">
                  {errorLogin}
                </Alert>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                className="login-submit-button"
                sx={{
                  background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                  borderRadius: "12px",
                  padding: "16px",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  textTransform: "none",
                  boxShadow: "0 8px 25px rgba(37, 99, 235, 0.3)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #1d4ed8, #1e40af)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 12px 35px rgba(37, 99, 235, 0.4)",
                  },
                  "&:disabled": {
                    background: "rgba(37, 99, 235, 0.5)",
                    color: "rgba(255, 255, 255, 0.7)",
                  },
                }}
              >
                {loading ? (
                  <Box display="flex" alignItems="center" gap={1}>
                    <div className="login-spinner"></div>
                    Signing In...
                  </Box>
                ) : (
                  "Sign In"
                )}
              </Button>
            </Box>

            <Divider
              className="login-divider"
              sx={{ color: "rgba(255, 255, 255, 0.3)" }}
            >
              or
            </Divider>

            {/* Register Link */}
            <Box className="register-section">
              <Typography variant="body1" className="register-text">
                Don't have an account?{" "}
                <Link to="/register" className="register-link">
                  Create Account
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
}

export default Login;
