"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import {
  Button,
  TextField,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Box,
  IconButton,
} from "@mui/material";
import {
  ArrowForward,
  AttachMoney,
  TrendingUp,
  Security,
  BarChart,
  AccountBalanceWallet,
  CreditCard,
  PieChart,
  GitHub,
  Instagram,
  Email,
  Phone,
} from "@mui/icons-material";
import "./Lobby.css";
import Lady from "./assets/lady.jpg";
import AnalyticsPage from "./assets/analyticsPage.png";
import WalletPage from "./assets/walletPage.png";
import DashboardPage from "./assets/dashboardPage.png";
import TransactionsPage from "./assets/transactions.png";
import Logo from "./assets/myassetslogo.png";
import { useNavigate } from "react-router-dom";

interface VisibilityState {
  [key: string]: boolean;
}

function Lobby() {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [loginLoading, setLoginLoading] = useState(false);
  const [getStartedLoading, setGetStartedLoading] = useState(false);
  const [isVisible, setIsVisible] = useState<VisibilityState>({});
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible((prev) => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting,
          }));
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll("[data-animate]");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="landing-page">
      {/* Animated Background */}
      <div className="animated-background">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      {/* Custom Cursor */}
      <div
        className="custom-cursor"
        style={{
          left: mousePosition.x - 8,
          top: mousePosition.y - 8,
        }}
      />

      {/* Navigation */}
      <AppBar position="fixed" className="navbar">
        <Toolbar>
          <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
            <img src={Logo} width={70} height={70} />
            <Typography variant="h5" component="div" className="logo-text">
              MyAssets
            </Typography>
          </Box>

          <Box
            className="nav-links"
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            <Button
              color="inherit"
              onClick={() => scrollToSection(heroRef)}
              className="nav-button"
            >
              Home
            </Button>
            <Button
              color="inherit"
              onClick={() => scrollToSection(featuresRef)}
              className="nav-button"
            >
              Features
            </Button>
            <Button
              color="inherit"
              onClick={() => scrollToSection(aboutRef)}
              className="nav-button"
            >
              About
            </Button>
            <Button
              color="inherit"
              onClick={() => scrollToSection(contactRef)}
              className="nav-button"
            >
              Contact
            </Button>
          </Box>

          <Button
            variant="contained"
            className="login-button"
            onClick={() => {
              setLoginLoading(true);
              setTimeout(() => {
                navigate("/login");
                setLoginLoading(false);
              }, 1500);
            }}
            disabled={loginLoading}
          >
            {loginLoading ? (
              <Box display="flex" alignItems="center" gap={1}>
                <div className="spinner"></div>
                Loading...
              </Box>
            ) : (
              "Login"
            )}
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <section ref={heroRef} className="hero-section">
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} lg={6}>
              <Box className="hero-content">
                <Typography variant="h1" className="hero-title">
                  MyAssets
                </Typography>
                <Typography variant="h3" className="hero-subtitle">
                  Take Control of Your Financial Journey: Master Your
                  Investments, and Build an{" "}
                  <span className="highlight">Unstoppable Legacy</span> of
                  Wealth and Wisdom
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  className="cta-button"
                  endIcon={!getStartedLoading && <ArrowForward />}
                  onClick={() => {
                    setGetStartedLoading(true);
                    setTimeout(() => {
                      navigate("/register");
                      setGetStartedLoading(false);
                    }, 1500);
                  }}
                  disabled={getStartedLoading}
                >
                  {getStartedLoading ? (
                    <Box display="flex" alignItems="center" gap={1}>
                      <div className="spinner"></div>
                      Getting Started...
                    </Box>
                  ) : (
                    "Get Started"
                  )}
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12} lg={6}>
              <Box className="hero-card-container">
                <Card className="hero-card">
                  <CardContent>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={3}
                    >
                      <Typography variant="h6">Portfolio Overview</Typography>
                      <TrendingUp className="trend-icon" />
                    </Box>
                    <Box mb={2}>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={1}
                      >
                        <Typography color="textSecondary">
                          Total Balance
                        </Typography>
                        <Typography variant="h4" className="balance-amount">
                          $124,567
                        </Typography>
                      </Box>
                      <Box className="progress-bar">
                        <Box className="progress-fill"></Box>
                      </Box>
                    </Box>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Card className="mini-card">
                          <CardContent>
                            <Typography variant="caption" color="textSecondary">
                              Stocks
                            </Typography>
                            <Typography variant="h6" className="stocks-amount">
                              $67,890
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={6}>
                        <Card className="mini-card">
                          <CardContent>
                            <Typography variant="caption" color="textSecondary">
                              Bonds
                            </Typography>
                            <Typography variant="h6" className="bonds-amount">
                              $56,677
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </section>

      {/* About Section */}
      <section
        ref={aboutRef}
        id="about"
        data-animate
        className={`about-section ${isVisible.about ? "visible" : ""}`}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center" sx={{ mb: 8 }}>
            <Grid item xs={12} lg={6}>
              <Box className="about-image-container">
                <img
                  src={Lady}
                  alt="Financial Management"
                  className="about-image"
                />
                <Box className="floating-icon">
                  <BarChart />
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} lg={6}>
              <Box className="about-content">
                <Typography variant="h2" className="section-title">
                  All-in-One Financial Solution
                </Typography>
                <Typography variant="h6" className="section-description">
                  MyAssets provides an all-in-one solution for managing your
                  money with ease. The platform offers powerful tools to help
                  you track expenses, monitor income, and gain valuable insights
                  through interactive charts and analytics.
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Grid container spacing={4}>
            {[
              {
                icon: TrendingUp,
                title: "Smart Tracking",
                description:
                  "Simplifies spending tracking with real-time updates and easy categorization.",
                color: "blue",
              },
              {
                icon: Security,
                title: "Personalized Insights",
                description:
                  "Offers personalized insights and actionable recommendations.",
                color: "slate",
              },
              {
                icon: AttachMoney,
                title: "Confidence Building",
                description:
                  "Boosts your confidence by making financial management intuitive and accessible.",
                color: "green",
              },
            ].map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card className={`feature-card feature-card-${feature.color}`}>
                  <CardContent>
                    <Box
                      className={`feature-icon feature-icon-${feature.color}`}
                    >
                      <feature.icon />
                    </Box>
                    <Typography variant="h5" className="feature-title">
                      {feature.title}
                    </Typography>
                    <Typography className="feature-description">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </section>

      {/* Features Section */}
      <section
        ref={featuresRef}
        id="features"
        data-animate
        className={`features-section ${isVisible.features ? "visible" : ""}`}
      >
        <Container maxWidth={false}>
          <Box textAlign="center" mb={8}>
            <Typography variant="h2" className="section-title">
              Key Features
            </Typography>
            <Typography variant="h6" className="section-description">
              Discover the powerful tools that make MyAssets the ultimate
              financial management platform
            </Typography>
          </Box>

          <Grid container spacing={3} className="features-container">
            {[
              {
                icon: BarChart,
                title: "Dashboard",
                description: "Comprehensive overview of your financial health",
                color: "blue",
                image: DashboardPage,
              },
              {
                icon: CreditCard,
                title: "Transactions",
                description: "Track and categorize all your transactions",
                color: "green",
                image: TransactionsPage,
              },
              {
                icon: AccountBalanceWallet,
                title: "Wallet",
                description: "Manage multiple accounts and payment methods",
                color: "slate",
                image: WalletPage,
              },
              {
                icon: PieChart,
                title: "Analytics",
                description:
                  "Deep insights with interactive charts and reports",
                color: "indigo",
                image: AnalyticsPage,
              },
            ].map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  className={`main-feature-card main-feature-card-${feature.color}`}
                >
                  <CardContent>
                    <Box
                      className={`main-feature-icon main-feature-icon-${feature.color}`}
                    >
                      <feature.icon />
                    </Box>
                    <Typography variant="h4" className="main-feature-title">
                      {feature.title}
                    </Typography>
                    <Typography className="main-feature-description">
                      {feature.description}
                    </Typography>
                    <Box className="feature-preview-large">
                      <img
                        src={feature.image}
                        alt={`${feature.title} Preview`}
                        className="preview-image"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </section>

      {/* Footer */}
      <footer
        ref={contactRef}
        id="contact"
        data-animate
        className={`footer-section ${isVisible.contact ? "visible" : ""}`}
      >
        <Container maxWidth="lg">
          <Grid container spacing={8}>
            <Grid item xs={12} lg={6}>
              <Box className="footer-content">
                <Typography variant="h3" className="footer-title">
                  MyAssets
                </Typography>
                <Typography variant="h6" className="footer-description">
                  Empowering your financial future with intelligent tools and
                  insights.
                </Typography>

                <Box className="contact-info">
                  <Box display="flex" alignItems="center" mb={2}>
                    <Email className="contact-icon" />
                    <Typography>icencodes@gmail.com</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Phone className="contact-icon" />
                    <Typography>(+62) 812-9203-9645</Typography>
                  </Box>
                </Box>

                <Box className="social-section">
                  <Typography variant="h6" className="social-title">
                    Follow Me
                  </Typography>
                  <Box className="social-links">
                    <IconButton
                      href="https://github.com/VincentiusJacob"
                      className="social-button"
                    >
                      <GitHub />
                    </IconButton>
                    <IconButton
                      href="https://www.instagram.com/vincentiusjg"
                      className="social-button"
                    >
                      <Instagram />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} lg={6}>
              <Box className="newsletter-section">
                <Typography variant="h4" className="newsletter-title">
                  Stay Updated!
                </Typography>
                <Typography variant="h6" className="newsletter-description">
                  Enter your email to receive the latest news and updates from
                  us.
                </Typography>

                <Box className="newsletter-form">
                  <TextField
                    type="email"
                    placeholder="Email Address..."
                    variant="outlined"
                    className="email-input"
                    fullWidth
                  />
                  <Button variant="contained" className="send-button">
                    Send
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </footer>
    </div>
  );
}

export default Lobby;
