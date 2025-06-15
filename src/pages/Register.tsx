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
  LinearProgress,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  ArrowBack,
  CheckCircle,
} from "@mui/icons-material";
import axios from "axios";
import "./Register.css";
import Logo from "../assets/myassetslogo.png";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Password strength calculation
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password);
  const getStrengthColor = () => {
    if (passwordStrength < 25) return "#ef4444";
    if (passwordStrength < 50) return "#f59e0b";
    if (passwordStrength < 75) return "#eab308";
    return "#10b981";
  };

  const getStrengthText = () => {
    if (passwordStrength < 25) return "Weak";
    if (passwordStrength < 50) return "Fair";
    if (passwordStrength < 75) return "Good";
    return "Strong";
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "https://myassets-backend.vercel.app/auth/register",
        {
          username: username,
          email: email,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        localStorage.setItem("data", JSON.stringify(response.data));

        // Add a small delay for better UX
        setTimeout(() => {
          navigate("/Dashboard", { replace: true });
        }, 500);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="register-page">
      {/* Animated Background */}
      <div className="register-background">
        <div className="register-blob register-blob-1"></div>
        <div className="register-blob register-blob-2"></div>
        <div className="register-blob register-blob-3"></div>
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
      <Box className="register-container">
        <Card className="register-card">
          <CardContent className="register-card-content">
            {/* Logo and Title */}
            <Box className="register-header">
              <img src={Logo} width={100} height={100} />
              <Typography variant="h3" className="register-title">
                Join MyAssets
              </Typography>
              <Typography variant="h6" className="register-subtitle">
                Create your account and start your financial journey
              </Typography>
            </Box>

            {/* Register Form */}
            <Box
              component="form"
              onSubmit={handleSubmit}
              className="register-form"
            >
              <TextField
                fullWidth
                type="text"
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="register-input"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person className="input-icon" />
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
                type="email"
                label="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="register-input"
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

              <Box className="password-field">
                <TextField
                  fullWidth
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="register-input"
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

                {/* Password Strength Indicator */}
                {password && (
                  <Box className="password-strength">
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={1}
                    >
                      <Typography
                        variant="caption"
                        sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                      >
                        Password Strength
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: getStrengthColor(), fontWeight: 600 }}
                      >
                        {getStrengthText()}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={passwordStrength}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: getStrengthColor(),
                          borderRadius: 3,
                        },
                      }}
                    />
                  </Box>
                )}
              </Box>

              {error && (
                <Alert severity="error" className="error-alert">
                  {error}
                </Alert>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                className="register-submit-button"
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
                    <div className="register-spinner"></div>
                    Creating Account...
                  </Box>
                ) : (
                  <>
                    <CheckCircle sx={{ mr: 1 }} />
                    Create Account
                  </>
                )}
              </Button>
            </Box>

            <Divider
              className="register-divider"
              sx={{ color: "rgba(255, 255, 255, 0.3)" }}
            >
              or
            </Divider>

            {/* Login Link */}
            <Box className="login-section">
              <Typography variant="body1" className="login-text">
                Already have an account?{" "}
                <Link to="/login" className="login-link">
                  Sign In
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
}

export default Register;
