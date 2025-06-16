"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  DollarSign,
  CreditCard,
  PiggyBank,
  Settings,
  LogOut,
  User,
  Calendar,
  Download,
  RefreshCw,
  ShoppingCart,
  Wallet,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Avatar,
  Chip,
  LinearProgress,
  Menu,
  MenuItem,
  IconButton,
  Box,
  Grid,
  Tabs,
  Tab,
  Container,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

// Cards Component
interface CardsProps {
  name: string;
  icon: React.ReactNode;
}

const Cards: React.FC<CardsProps> = ({ name, icon }) => {
  const [amount, setAmount] = useState<number>(0);
  const [showValue, setShowValue] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [change, setChange] = useState<number>(0);
  const [trend, setTrend] = useState<"up" | "down">("up");

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchAmount = async () => {
      const getUser = localStorage.getItem("data");
      if (getUser) {
        const parseData = JSON.parse(getUser);
        const username = parseData.username;

        try {
          let apiEndpoint = "";

          // Set the correct API endpoint based on card name
          switch (name) {
            case "Balance":
              apiEndpoint = `https://myassets-backend.vercel.app/api/balance/${username}`;
              break;
            case "Investment":
              apiEndpoint = `https://myassets-backend.vercel.app/api/invest/${username}`;
              break;
            case "Expenses":
              apiEndpoint = `https://myassets-backend.vercel.app/api/expenseData/${username}`;
              break;
            case "Savings":
              apiEndpoint = `https://myassets-backend.vercel.app/api/savings/${username}`;
              break;
            default:
              apiEndpoint = `https://myassets-backend.vercel.app/api/balance/${username}`;
          }

          // Fetch current amount
          const response = await axios.get(apiEndpoint);
          let currentAmount = 0;

          // Handle different API response structures
          if (name === "Balance") {
            currentAmount = response.data.totalBalance || 0;
          } else if (name === "Investment") {
            currentAmount = response.data.total || response.data.amount || 0;
          } else if (name === "Expenses") {
            // For expenses, sum up all amounts from the array
            if (Array.isArray(response.data)) {
              currentAmount = response.data.reduce(
                (sum: number, expense: any) => sum + (expense.amount || 0),
                0
              );
            } else {
              currentAmount = response.data.total || response.data.amount || 0;
            }
          } else if (name === "Savings") {
            currentAmount = response.data.total || response.data.amount || 0;
          }

          setAmount(currentAmount);
          console.log(`${name} API Response:`, response.data);
          console.log(`${name} Current Amount:`, currentAmount);

          // Calculate trend (simplified for now)
          setChange(Math.floor(Math.random() * 15) + 1); // Random change for demo
          setTrend(Math.random() > 0.5 ? "up" : "down");
        } catch (error) {
          console.error(`Error fetching ${name} amount:`, error);
          setAmount(0);
          setChange(0);
          setTrend("up");
        }
      }
    };

    fetchAmount();
  }, [name]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Card
        className="group"
        sx={{
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          borderRadius: "16px",
          boxShadow: "0 25px 50px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
          position: "relative",
          "&:hover": {
            boxShadow: "0 35px 70px rgba(0, 0, 0, 0.15)",
            transform: "translateY(-5px) scale(1.02)",
          },
          transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          height: "100%",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(147, 51, 234, 0.05))",
            opacity: 0,
            transition: "opacity 0.5s",
            ".group:hover &": { opacity: 1 },
          }}
        />
        <CardHeader
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            pb: 1,
            position: "relative",
            zIndex: 1,
          }}
        >
          <Box>
            <Typography
              variant="body2"
              sx={{ color: "#64748b", fontWeight: 600, fontSize: "0.875rem" }}
            >
              {name}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "#94a3b8", fontSize: "0.75rem" }}
            >
              {name === "Balance" && "Total available funds"}
              {name === "Investment" && "Portfolio value"}
              {name === "Expenses" && "Monthly spending"}
              {name === "Savings" && "Saved amount"}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              size="small"
              onClick={() => setShowValue(!showValue)}
              sx={{
                opacity: 0,
                transition: "opacity 0.3s",
                ".group:hover &": { opacity: 1 },
                width: 28,
                height: 28,
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                },
              }}
            >
              {showValue ? <Eye size={14} /> : <EyeOff size={14} />}
            </IconButton>
            <Tooltip
              title={
                name === "Balance"
                  ? "Your total available balance across all accounts"
                  : name === "Investment"
                  ? "Total value of your investment portfolio"
                  : name === "Expenses"
                  ? "Total expenses for this month"
                  : "Total amount saved this month"
              }
              arrow
              placement="top"
            >
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: "12px",
                  background:
                    name === "Balance"
                      ? "linear-gradient(135deg, #3b82f6, #2563eb)"
                      : name === "Investment"
                      ? "linear-gradient(135deg, #10b981, #059669)"
                      : name === "Expenses"
                      ? "linear-gradient(135deg, #ef4444, #dc2626)"
                      : "linear-gradient(135deg, #f59e0b, #d97706)",
                  color: "white",
                  boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "help",
                }}
              >
                {icon}
              </Box>
            </Tooltip>
          </Box>
        </CardHeader>
        <CardContent sx={{ position: "relative", zIndex: 1 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#1e293b",
              mb: 1.5,
              fontSize: "1.75rem",
            }}
          >
            {showValue ? (
              <motion.span
                key={amount}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                ${amount.toLocaleString()}
              </motion.span>
            ) : (
              "••••••"
            )}
          </Typography>

          {amount === 0 ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                variant="body2"
                sx={{ color: "#64748b", fontWeight: 600, fontSize: "0.875rem" }}
              >
                {amount > 0 && name}
                {amount === 0 && name === "Balance" && "Balance"}
                {amount === 0 &&
                  name === "Investment" &&
                  "Start Investing Today"}
                {amount === 0 && name === "Expenses" && "No Expenses Recorded"}
                {amount === 0 &&
                  name === "Savings" &&
                  "Begin Your Savings Journey"}
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  color: trend === "up" ? "#10b981" : "#ef4444",
                  backgroundColor:
                    trend === "up"
                      ? "rgba(16, 185, 129, 0.1)"
                      : "rgba(239, 68, 68, 0.1)",
                  px: 1,
                  py: 0.5,
                  borderRadius: "6px",
                }}
              >
                {trend === "up" ? (
                  <ArrowUpRight size={12} />
                ) : (
                  <ArrowDownRight size={12} />
                )}
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 700, fontSize: "0.75rem" }}
                >
                  {change}%
                </Typography>
              </Box>
              <Typography
                variant="caption"
                sx={{ color: "#64748b", fontSize: "0.75rem" }}
              >
                vs last month
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

interface IncomeTrendData {
  month: string;
  income: number;
  savings: number;
  investment: number;
  expense: number;
}

interface TransactionItemProps {
  transaction: any;
  index: number;
}

interface PaymentItemProps {
  payment: any;
  index: number;
}

const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  index,
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.4, delay: index * 0.1 }}
  >
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: 2,
        borderRadius: "12px",
        background: "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        "&:hover": {
          background: "rgba(255, 255, 255, 0.9)",
          transform: "translateY(-2px)",
        },
        transition: "all 0.3s ease",
        mb: 1.5,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              transaction.category === "Income"
                ? "linear-gradient(135deg, #10b981, #059669)"
                : transaction.category === "Expense"
                ? "linear-gradient(135deg, #ef4444, #dc2626)"
                : transaction.category === "Investment"
                ? "linear-gradient(135deg, #f59e0b, #d97706)"
                : "linear-gradient(135deg, #3b82f6, #2563eb)",
            color: "white",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          }}
        >
          {transaction.category === "Income" && <DollarSign size={18} />}
          {transaction.category === "Expense" && <ShoppingCart size={18} />}
          {transaction.category === "Investment" && <TrendingUp size={18} />}
          {transaction.category === "Savings" && <PiggyBank size={18} />}
        </Box>
        <Box>
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, color: "#1e293b", mb: 0.5 }}
          >
            {transaction.title}
          </Typography>
          <Typography variant="caption" sx={{ color: "#64748b" }}>
            {transaction.category}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ textAlign: "right" }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 700,
            color:
              transaction.category === "Expense"
                ? "#ef4444"
                : transaction.category === "Income"
                ? "#10b981"
                : transaction.category === "Savings"
                ? "#3b82f6"
                : "#f59e0b",
            mb: 0.5,
          }}
        >
          {transaction.category === "Expense"
            ? `-$${transaction.amount}`
            : `+$${transaction.amount}`}
        </Typography>
        <Chip
          label={transaction.category}
          size="small"
          sx={{
            fontSize: "0.7rem",
            height: "20px",
            backgroundColor:
              transaction.category === "Income"
                ? "#dcfce7"
                : transaction.category === "Expense"
                ? "#fee2e2"
                : transaction.category === "Investment"
                ? "#fef3c7"
                : "#dbeafe",
            color:
              transaction.category === "Income"
                ? "#059669"
                : transaction.category === "Expense"
                ? "#dc2626"
                : transaction.category === "Investment"
                ? "#d97706"
                : "#2563eb",
          }}
        />
      </Box>
    </Box>
  </motion.div>
);

const PaymentItem: React.FC<PaymentItemProps> = ({ payment, index }) => {
  const progress = (payment.amount_paid / payment.amount_due) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Box
        sx={{
          p: 2.5,
          borderRadius: "12px",
          background: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          "&:hover": {
            background: "rgba(255, 255, 255, 0.9)",
            transform: "translateY(-2px)",
          },
          transition: "all 0.3s ease",
          mb: 2,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, color: "#1e293b" }}
          >
            {payment.payment_name}
          </Typography>
          <Chip
            label="Due Soon"
            size="small"
            sx={{
              backgroundColor: "#fef3c7",
              color: "#d97706",
              fontSize: "0.7rem",
              height: "20px",
            }}
          />
        </Box>
        <Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body2" sx={{ color: "#64748b" }}>
              ${payment.amount_paid.toLocaleString()} / $
              {payment.amount_due.toLocaleString()}
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, color: "#1e293b" }}
            >
              {Math.round(progress)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: "rgba(0, 0, 0, 0.08)",
              "& .MuiLinearProgress-bar": {
                borderRadius: 4,
                background:
                  progress >= 80
                    ? "linear-gradient(90deg, #10b981, #059669)"
                    : progress >= 50
                    ? "linear-gradient(90deg, #f59e0b, #d97706)"
                    : "linear-gradient(90deg, #ef4444, #dc2626)",
              },
            }}
          />
        </Box>
      </Box>
    </motion.div>
  );
};

function Dashboard() {
  const [paymentData, setPaymentData] = useState([]);
  const [transactionData, setTransactionData] = useState([]);
  const [earning, setEarning] = useState<any[]>([]);
  const [overviewSeries, setOverviewSeries] = useState<
    { name: string; data: number[] }[]
  >([]);
  const [currentUserProfile, setCurrentUserProfile] = useState<any>(null);
  const [overviewCategories, setOverviewCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const getUser = localStorage.getItem("data");
  const parsedCurrentUsername = getUser ? JSON.parse(getUser) : null;
  const currentUsername = parsedCurrentUsername?.username || "User";

  useEffect(() => {
    const fetchData = async () => {
      let username;
      if (getUser) {
        const parseData = JSON.parse(getUser);
        username = parseData.username;
        try {
          // Fetch user profile
          const userData = await axios.get(
            `https://myassets-backend.vercel.app/getUserProfile/${username}`
          );
          setCurrentUserProfile(userData.data[0]);

          // Fetch payments data
          const paymentResult = await axios.get(
            `https://myassets-backend.vercel.app/getPayments/${username}`
          );
          const filteredPayment = paymentResult.data.slice(0, 4);
          setPaymentData(filteredPayment);

          // Fetch transactions data
          const transactionResult = await axios.get(
            `https://myassets-backend.vercel.app/getTransaction/${username}`
          );
          const filteredTransaction = transactionResult.data.slice(0, 4);
          setTransactionData(filteredTransaction);

          // Fetch overview data for the main chart
          const responseOverview = await axios.get(
            `https://myassets-backend.vercel.app/api/overview/${username}`
          );
          const overviewData: IncomeTrendData[] = responseOverview.data;

          const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];

          const formattedOverviewData = months.map((month) => {
            const monthData = overviewData.find(
              (item) =>
                new Date(item.month).toLocaleString("default", {
                  month: "short",
                }) === month
            );
            return {
              month,
              income: monthData?.income || 0,
              savings: monthData?.savings || 0,
              investment: monthData?.investment || 0,
              expense: monthData?.expense || 0,
            };
          });

          setOverviewCategories(
            formattedOverviewData.map((item: any) => item.month)
          );
          setOverviewSeries([
            {
              name: "Income",
              data: formattedOverviewData.map((item: any) => item.income),
            },
            {
              name: "Savings",
              data: formattedOverviewData.map((item: any) => item.savings),
            },
            {
              name: "Investment",
              data: formattedOverviewData.map((item: any) => item.investment),
            },
            {
              name: "Expense",
              data: formattedOverviewData.map((item: any) => item.expense),
            },
          ]);

          // Fetch income trends data for activity chart
          const incomeTrendsResult = await axios.get(
            `https://myassets-backend.vercel.app/api/incomeTrends/${username}`
          );
          const incomeTrendsData = incomeTrendsResult.data;

          const activitySeries = incomeTrendsData.map((item: any) => ({
            month: new Date(item.month).toLocaleString("default", {
              month: "short",
            }),
            income: Number.parseFloat(item.income || 0),
            expense: Number.parseFloat(item.expense || 0),
            investment: Number.parseFloat(item.investment || 0),
            payment: Number.parseFloat(item.payment || 0),
          }));

          setEarning(activitySeries);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, []);

  const navigate = useNavigate();

  const clickProfile = () => {
    navigate("/personal");
    setAnchorEl(null);
  };

  const handleLogOut = async () => {
    const getUser = localStorage.getItem("data");
    if (getUser) {
      const user = JSON.parse(getUser);
      const username = user.username;

      try {
        const result = await axios.post(
          `https://myassets-backend.vercel.app/auth/logout`,
          { username }
        );

        if (result.status === 200) {
          // Clear all user data from localStorage
          localStorage.removeItem("data");
          // Navigate to login/home page
          navigate("/");
        }
      } catch (error) {
        console.error("Logout failed", error);
        // Even if API call fails, still clear local data and redirect
        localStorage.removeItem("data");
        navigate("/");
      }
    } else {
      // If no user data exists, just redirect to home
      navigate("/");
    }
    setAnchorEl(null);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Prepare chart data
  const chartData = overviewCategories.map((month, index) => ({
    month,
    income: overviewSeries.find((s) => s.name === "Income")?.data[index] || 0,
    expense: overviewSeries.find((s) => s.name === "Expense")?.data[index] || 0,
    savings: overviewSeries.find((s) => s.name === "Savings")?.data[index] || 0,
    investment:
      overviewSeries.find((s) => s.name === "Investment")?.data[index] || 0,
  }));

  const activityData = earning.map((item: any) => ({
    month: item.month,
    income: item.income || 0,
    expense: item.expense || 0,
    investment: item.investment || 0,
    payment: item.payment || 0,
  }));

  const refreshData = async () => {
    setIsLoading(true);
    // Re-fetch all data
    const fetchData = async () => {
      let username;
      if (getUser) {
        const parseData = JSON.parse(getUser);
        username = parseData.username;
        try {
          const userData = await axios.get(
            `https://myassets-backend.vercel.app/getUserProfile/${username}`
          );
          setCurrentUserProfile(userData.data[0]);

          const paymentResult = await axios.get(
            `https://myassets-backend.vercel.app/getPayments/${username}`
          );
          const filteredPayment = paymentResult.data.slice(0, 4);
          setPaymentData(filteredPayment);

          const transactionResult = await axios.get(
            `https://myassets-backend.vercel.app/getTransaction/${username}`
          );
          const filteredTransaction = transactionResult.data.slice(0, 4);
          setTransactionData(filteredTransaction);

          const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];

          const responseOverview = await axios.get(
            `https://myassets-backend.vercel.app/api/overview/${username}`
          );
          const overviewData: IncomeTrendData[] = responseOverview.data;

          const formattedData = months.map((month) => {
            const monthData = overviewData.find(
              (item) =>
                new Date(item.month).toLocaleString("default", {
                  month: "short",
                }) === month
            );
            return {
              month,
              income: monthData?.income || 0,
              savings: monthData?.savings || 0,
              investment: monthData?.investment || 0,
              expense: monthData?.expense || 0,
            };
          });

          setOverviewCategories(formattedData.map((item: any) => item.month));

          setOverviewSeries([
            {
              name: "Income",
              data: formattedData.map((item: any) => item.income),
            },
            {
              name: "Savings",
              data: formattedData.map((item: any) => item.savings),
            },
            {
              name: "Investment",
              data: formattedData.map((item: any) => item.investment),
            },
            {
              name: "Expense",
              data: formattedData.map((item: any) => item.expense),
            },
          ]);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    await fetchData();
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #f8fafc 0%, #e0f2fe 50%, #f1f5f9 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          style={{
            width: 48,
            height: 48,
            border: "4px solid #3b82f6",
            borderTop: "4px solid transparent",
            borderRadius: "50%",
          }}
        />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #f8fafc 0%, #e0f2fe 50%, #f1f5f9 100%)",
        position: "relative",
      }}
    >
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "-160px",
            right: "-160px",
            width: "320px",
            height: "320px",
            background: "rgba(59, 130, 246, 0.15)",
            borderRadius: "50%",
            filter: "blur(60px)",
            animation: "pulse 6s ease-in-out infinite",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: "-160px",
            left: "-160px",
            width: "320px",
            height: "320px",
            background: "rgba(147, 51, 234, 0.15)",
            borderRadius: "50%",
            filter: "blur(60px)",
            animation: "pulse 6s ease-in-out infinite",
            animationDelay: "3s",
          }}
        />
      </Box>

      <Container
        maxWidth="xl"
        sx={{ position: "relative", zIndex: 1, py: isMobile ? 2 : 4 }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: isMobile ? "flex-start" : "center",
              justifyContent: "space-between",
              mb: isMobile ? 2 : 4,
              flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? 2 : 0,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography
                variant={isMobile ? "h4" : "h3"}
                sx={{
                  fontWeight: 700,
                  background: "linear-gradient(135deg, #1e293b, #64748b)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  mb: 1,
                  fontSize: isMobile ? "1.75rem" : "3rem",
                  lineHeight: isMobile ? 1.2 : 1.1,
                }}
              >
                Welcome back, {currentUsername}! 👋
              </Typography>
              <Typography
                variant={isMobile ? "body1" : "h6"}
                sx={{
                  color: "#64748b",
                  fontSize: isMobile ? "0.9rem" : "1.25rem",
                }}
              >
                Here's what's happening with your finances today.
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: isMobile ? 1 : 2,
                flexWrap: isMobile ? "wrap" : "nowrap",
                width: isMobile ? "100%" : "auto",
                justifyContent: isMobile ? "space-between" : "flex-end",
              }}
            >
              {!isMobile && (
                <>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Calendar size={16} />}
                    sx={{
                      background: "rgba(255, 255, 255, 0.7)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.3)",
                      color: "#64748b",
                      "&:hover": {
                        background: "rgba(255, 255, 255, 0.9)",
                        borderColor: "#3b82f6",
                      },
                    }}
                  >
                    THIS MONTH
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Download size={16} />}
                    sx={{
                      background: "rgba(255, 255, 255, 0.7)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.3)",
                      color: "#64748b",
                      "&:hover": {
                        background: "rgba(255, 255, 255, 0.9)",
                        borderColor: "#3b82f6",
                      },
                    }}
                  >
                    EXPORT
                  </Button>
                </>
              )}

              <IconButton
                onClick={refreshData}
                size={isMobile ? "small" : "medium"}
                sx={{
                  background: "rgba(255, 255, 255, 0.7)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  "&:hover": {
                    background: "rgba(255, 255, 255, 0.9)",
                  },
                }}
              >
                <RefreshCw size={isMobile ? 14 : 16} />
              </IconButton>

              <IconButton
                onClick={handleMenuClick}
                size={isMobile ? "small" : "medium"}
              >
                <Avatar
                  src={
                    currentUserProfile?.profilepicture ||
                    "/placeholder.svg?height=40&width=40"
                  }
                  sx={{
                    width: isMobile ? 32 : 40,
                    height: isMobile ? 32 : 40,
                    border: "2px solid rgba(255, 255, 255, 0.3)",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {currentUsername[0]}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                sx={{
                  "& .MuiPaper-root": {
                    background: "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    borderRadius: "12px",
                    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.1)",
                  },
                }}
              >
                <MenuItem onClick={clickProfile}>
                  <User size={16} style={{ marginRight: 8 }} />
                  Profile
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <Settings size={16} style={{ marginRight: 8 }} />
                  Settings
                </MenuItem>
                <MenuItem onClick={handleLogOut} sx={{ color: "#ef4444" }}>
                  <LogOut size={16} style={{ marginRight: 8 }} />
                  Log out
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        </motion.div>

        {/* Stats Cards */}
        <Grid
          container
          spacing={isMobile ? 2 : 3}
          sx={{ mb: isMobile ? 3 : 4 }}
        >
          <Grid item xs={12} sm={6} lg={3}>
            <Cards name="Balance" icon={<Wallet size={16} />} />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <Cards name="Investment" icon={<TrendingUp size={16} />} />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <Cards name="Expenses" icon={<CreditCard size={16} />} />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <Cards name="Savings" icon={<PiggyBank size={16} />} />
          </Grid>
        </Grid>

        {/* Main Content */}
        <Grid container spacing={isMobile ? 3 : 4}>
          {/* Charts Section */}
          <Grid item xs={12} lg={8}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Overview Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card
                  sx={{
                    background: "rgba(255, 255, 255, 0.8)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    borderRadius: "16px",
                    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.1)",
                    overflow: "hidden",
                  }}
                >
                  <CardHeader sx={{ pb: 2 }}>
                    <Typography
                      variant={isMobile ? "h6" : "h5"}
                      sx={{ fontWeight: 600, color: "#1e293b", mb: 1 }}
                    >
                      📊 Financial Overview - Monthly Trends
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#64748b", fontSize: "0.875rem", mb: 2 }}
                    >
                      Compare your income, expenses, savings, and investments
                      across months
                    </Typography>
                    <Tabs
                      value={activeTab}
                      onChange={(_, newValue) => setActiveTab(newValue)}
                      sx={{
                        background: "rgba(255, 255, 255, 0.6)",
                        backdropFilter: "blur(10px)",
                        borderRadius: "8px",
                        minHeight: "auto",
                        "& .MuiTab-root": {
                          minHeight: "auto",
                          py: 1,
                          px: isMobile ? 1.5 : 2,
                          fontSize: isMobile ? "0.75rem" : "0.875rem",
                          fontWeight: 500,
                        },
                        "& .MuiTabs-indicator": {
                          backgroundColor: "#3b82f6",
                        },
                      }}
                    >
                      <Tab label="Overview" />
                      <Tab label="Income" />
                      <Tab label="Expenses" />
                    </Tabs>
                  </CardHeader>
                  <CardContent>
                    <Box sx={{ height: isMobile ? 250 : 320 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e2e8f0"
                          />
                          <XAxis
                            dataKey="month"
                            stroke="#64748b"
                            fontSize={isMobile ? 10 : 12}
                          />
                          <YAxis
                            stroke="#64748b"
                            fontSize={isMobile ? 10 : 12}
                          />
                          <RechartsTooltip
                            contentStyle={{
                              backgroundColor: "rgba(255, 255, 255, 0.95)",
                              backdropFilter: "blur(10px)",
                              border: "1px solid rgba(255, 255, 255, 0.3)",
                              borderRadius: "12px",
                              boxShadow: "0 25px 50px rgba(0, 0, 0, 0.1)",
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="income"
                            stroke="#10b981"
                            strokeWidth={3}
                            name="Income"
                            dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                            activeDot={{
                              r: 6,
                              stroke: "#10b981",
                              strokeWidth: 2,
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="expense"
                            stroke="#ef4444"
                            strokeWidth={3}
                            name="Expense"
                            dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
                            activeDot={{
                              r: 6,
                              stroke: "#ef4444",
                              strokeWidth: 2,
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="savings"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            name="Savings"
                            dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                            activeDot={{
                              r: 6,
                              stroke: "#3b82f6",
                              strokeWidth: 2,
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="investment"
                            stroke="#f59e0b"
                            strokeWidth={3}
                            name="Investment"
                            dot={{ fill: "#f59e0b", strokeWidth: 2, r: 4 }}
                            activeDot={{
                              r: 6,
                              stroke: "#f59e0b",
                              strokeWidth: 2,
                            }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Activity Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <Card
                  sx={{
                    background: "rgba(255, 255, 255, 0.8)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    borderRadius: "16px",
                    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.1)",
                    overflow: "hidden",
                  }}
                >
                  <CardHeader sx={{ pb: 2 }}>
                    <Typography
                      variant={isMobile ? "h6" : "h5"}
                      sx={{ fontWeight: 600, color: "#1e293b", mb: 1 }}
                    >
                      📈 Activity Trends - Income vs Expenses
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#64748b", fontSize: "0.875rem" }}
                    >
                      Track your monthly income, expenses, investments, and
                      payment activities over time
                    </Typography>
                  </CardHeader>
                  <CardContent>
                    <Box sx={{ height: isMobile ? 200 : 256 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={activityData}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e2e8f0"
                          />
                          <XAxis
                            dataKey="month"
                            stroke="#64748b"
                            fontSize={isMobile ? 10 : 12}
                          />
                          <YAxis
                            stroke="#64748b"
                            fontSize={isMobile ? 10 : 12}
                          />
                          <RechartsTooltip
                            contentStyle={{
                              backgroundColor: "rgba(255, 255, 255, 0.95)",
                              backdropFilter: "blur(10px)",
                              border: "1px solid rgba(255, 255, 255, 0.3)",
                              borderRadius: "12px",
                              boxShadow: "0 25px 50px rgba(0, 0, 0, 0.1)",
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="income"
                            stroke="#10b981"
                            strokeWidth={3}
                            name="Income"
                            dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                            activeDot={{
                              r: 6,
                              stroke: "#10b981",
                              strokeWidth: 2,
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="expense"
                            stroke="#ef4444"
                            strokeWidth={3}
                            name="Expenses"
                            dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
                            activeDot={{
                              r: 6,
                              stroke: "#ef4444",
                              strokeWidth: 2,
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="investment"
                            stroke="#f59e0b"
                            strokeWidth={3}
                            name="Investments"
                            dot={{ fill: "#f59e0b", strokeWidth: 2, r: 4 }}
                            activeDot={{
                              r: 6,
                              stroke: "#f59e0b",
                              strokeWidth: 2,
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="payment"
                            stroke="#8b5cf6"
                            strokeWidth={3}
                            name="Payments"
                            dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
                            activeDot={{
                              r: 6,
                              stroke: "#8b5cf6",
                              strokeWidth: 2,
                            }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Box>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} lg={4}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Recent Transactions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Card
                  sx={{
                    background: "rgba(255, 255, 255, 0.8)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    borderRadius: "16px",
                    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.1)",
                    overflow: "hidden",
                  }}
                >
                  <CardHeader sx={{ pb: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: "#1e293b",
                          fontSize: isMobile ? "1rem" : "1.25rem",
                        }}
                      >
                        Recent Transactions
                      </Typography>
                      <Link
                        to="/Transaction"
                        style={{ textDecoration: "none" }}
                      >
                        <Button
                          size="small"
                          sx={{
                            color: "#3b82f6",
                            fontWeight: 600,
                            fontSize: isMobile ? "0.75rem" : "0.875rem",
                            "&:hover": {
                              backgroundColor: "rgba(59, 130, 246, 0.1)",
                            },
                          }}
                        >
                          View All
                        </Button>
                      </Link>
                    </Box>
                  </CardHeader>
                  <CardContent>
                    {transactionData && transactionData.length > 0 ? (
                      transactionData.map((transaction: any, index) => (
                        <TransactionItem
                          key={transaction.id}
                          transaction={transaction}
                          index={index}
                        />
                      ))
                    ) : (
                      <Box sx={{ textAlign: "center", py: 6 }}>
                        <Typography
                          sx={{ color: "#64748b", fontSize: "0.9rem" }}
                        >
                          No Transaction Available
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Upcoming Payments */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <Card
                  sx={{
                    background: "rgba(255, 255, 255, 0.8)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    borderRadius: "16px",
                    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.1)",
                    overflow: "hidden",
                  }}
                >
                  <CardHeader sx={{ pb: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: "#1e293b",
                          fontSize: isMobile ? "1rem" : "1.25rem",
                        }}
                      >
                        Upcoming Payments
                      </Typography>
                      <Link to="/Wallet" style={{ textDecoration: "none" }}>
                        <Button
                          size="small"
                          sx={{
                            color: "#3b82f6",
                            fontWeight: 600,
                            fontSize: isMobile ? "0.75rem" : "0.875rem",
                            "&:hover": {
                              backgroundColor: "rgba(59, 130, 246, 0.1)",
                            },
                          }}
                        >
                          See More
                        </Button>
                      </Link>
                    </Box>
                  </CardHeader>
                  <CardContent>
                    {paymentData.length > 0 ? (
                      paymentData.map((payment: any, index) => (
                        <PaymentItem
                          key={payment.id}
                          payment={payment}
                          index={index}
                        />
                      ))
                    ) : (
                      <Box sx={{ textAlign: "center", py: 6 }}>
                        <Typography
                          sx={{ color: "#64748b", fontSize: "0.9rem" }}
                        >
                          No Payment Available
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Dashboard;
