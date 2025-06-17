"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  CreditCard,
  PiggyBank,
  LogOut,
  User,
  Download,
  RefreshCw,
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
  Box,
  Grid,
  Container,
  IconButton,
  Menu,
  MenuItem,
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
  Legend,
} from "recharts";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../context/UserContext";
import { CSVLink } from "react-csv"; // <-- 1. IMPORT CSVLINK

interface Transaction {
  id: string;
  title: string;
  amount: number;
  category: "Income" | "Expense" | "Savings" | "Investment";
  date: string;
  description?: string; // Tambahkan deskripsi
}

const StatCard = ({
  name,
  icon,
  amount,
}: {
  name: string;
  icon: React.ReactNode;
  amount: number;
}) => {
  const [showValue, setShowValue] = useState(true);
  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;
  const cardColors = {
    Balance: "linear-gradient(135deg, #3b82f6, #2563eb)",
    Investment: "linear-gradient(135deg, #10b981, #059669)",
    Expenses: "linear-gradient(135deg, #ef4444, #dc2626)",
    Savings: "linear-gradient(135deg, #f59e0b, #d97706)",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ height: "100%" }}
    >
      <Card
        sx={{
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(20px)",
          borderRadius: "16px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <CardHeader
          title={
            <Typography variant="h6" fontWeight={600} color="text.secondary">
              {name}
            </Typography>
          }
          action={
            <IconButton size="small" onClick={() => setShowValue(!showValue)}>
              {showValue ? <Eye size={16} /> : <EyeOff size={16} />}
            </IconButton>
          }
          sx={{ pb: 0 }}
        />
        <CardContent>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h4" fontWeight={700} color="text.primary">
              {showValue ? formatCurrency(amount) : "••••••"}
            </Typography>
            <Avatar
              sx={{
                background:
                  cardColors[name as keyof typeof cardColors] || "primary.main",
                width: 48,
                height: 48,
                boxShadow: 3,
              }}
            >
              {icon}
            </Avatar>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

function Dashboard() {
  const { userProfile, isLoading: isUserLoading } = useUser();

  const [balance, setBalance] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [chartData, setChartData] = useState<any[]>([]);
  const [exportData, setExportData] = useState<Transaction[]>([]); // <-- 2. STATE BARU UNTUK DATA EXPORT
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // <-- 3. DEFINISIKAN HEADER UNTUK CSV -->
  const headers = [
    { label: "Date", key: "date" },
    { label: "Category", key: "category" },
    { label: "Title", key: "title" },
    { label: "Description", key: "description" },
    { label: "Amount", key: "amount" },
  ];

  const calculateFinancials = (transactions: Transaction[]) => {
    // ... (logic tidak berubah)
    const income = transactions
      .filter((t) => t.category === "Income")
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions
      .filter((t) => t.category === "Expense")
      .reduce((sum, t) => sum + t.amount, 0);
    const savings = transactions
      .filter((t) => t.category === "Savings")
      .reduce((sum, t) => sum + t.amount, 0);
    const investment = transactions
      .filter((t) => t.category === "Investment")
      .reduce((sum, t) => sum + t.amount, 0);
    setTotalExpense(expense);
    setTotalSavings(savings);
    setTotalInvestment(investment);
    setBalance(income - expense - savings - investment);
    const monthlyData: {
      [key: string]: {
        income: number;
        expense: number;
        savings: number;
        investment: number;
      };
    } = {};
    const monthNames = [
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
    monthNames.forEach((m) => {
      monthlyData[m] = { income: 0, expense: 0, savings: 0, investment: 0 };
    });
    transactions.forEach((t) => {
      const month = monthNames[new Date(t.date).getMonth()];
      if (monthlyData[month]) {
        if (t.category === "Income") monthlyData[month].income += t.amount;
        if (t.category === "Expense") monthlyData[month].expense += t.amount;
        if (t.category === "Savings") monthlyData[month].savings += t.amount;
        if (t.category === "Investment")
          monthlyData[month].investment += t.amount;
      }
    });
    const finalChartData = monthNames.map((m) => ({
      month: m,
      ...monthlyData[m],
    }));
    setChartData(finalChartData);
  };

  const fetchTransactionData = async () => {
    if (!userProfile) return;
    setIsDataLoading(true);
    try {
      const transactionRes = await axios.get(
        `https://myassets-backend.vercel.app/getTransaction/${userProfile.username}`
      );
      const formattedTransactions: Transaction[] = transactionRes.data.map(
        (t: any) => ({ ...t, amount: parseFloat(t.amount) || 0 })
      );
      calculateFinancials(formattedTransactions);
      setExportData(formattedTransactions); // <-- ISI STATE EXPORT DENGAN DATA TRANSAKSI
    } catch (error) {
      console.error("Error fetching transaction data:", error);
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    if (userProfile) {
      fetchTransactionData();
    }
  }, [userProfile]);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogOut = () => {
    localStorage.removeItem("data");
    navigate("/");
    handleMenuClose();
  };
  const clickProfile = () => {
    navigate("/personal");
    handleMenuClose();
  };

  if (isUserLoading || isDataLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        Loading...
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #f8fafc 0%, #e0f2fe 50%, #f1f5f9 100%)",
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 4,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography variant={isMobile ? "h4" : "h3"} fontWeight={700}>
              Welcome back, {userProfile?.username || "User"}! 👋
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Here's what's happening with your finances today.
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            {/* --- 4. BUNGKUS TOMBOL EXPORT DENGAN CSVLINK --- */}
            <CSVLink
              data={exportData}
              headers={headers}
              filename={"myassets_transactions.csv"}
              style={{ textDecoration: "none" }}
              target="_blank"
            >
              <Button variant="outlined" startIcon={<Download size={16} />}>
                Export
              </Button>
            </CSVLink>

            <IconButton onClick={fetchTransactionData}>
              <RefreshCw />
            </IconButton>
            <IconButton onClick={handleMenuClick}>
              <Avatar src={userProfile?.profilepicture || ""}>
                {userProfile?.username?.[0]}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={clickProfile}>
                <User size={16} style={{ marginRight: 8 }} />
                Profile
              </MenuItem>
              <MenuItem onClick={handleLogOut} sx={{ color: "error.main" }}>
                <LogOut size={16} style={{ marginRight: 8 }} />
                Log out
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              name="Balance"
              amount={balance}
              icon={<Wallet size={24} />}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              name="Investment"
              amount={totalInvestment}
              icon={<TrendingUp size={24} />}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              name="Expenses"
              amount={totalExpense}
              icon={<CreditCard size={24} />}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              name="Savings"
              amount={totalSavings}
              icon={<PiggyBank size={24} />}
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card
              sx={{
                background: "rgba(255, 255, 255, 0.8)",
                borderRadius: "16px",
                p: 2,
              }}
            >
              <CardHeader
                title={
                  <Typography variant="h5" fontWeight={600}>
                    📊 Yearly Financial Overview
                  </Typography>
                }
                subheader="Your income, expense, savings, and investment trends for the year."
              />
              <CardContent>
                <Box sx={{ height: 350 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="month" stroke="#64748b" />
                      <YAxis
                        stroke="#64748b"
                        tickFormatter={(value) =>
                          `$${
                            value > 999
                              ? `${Math.round(value / 100) / 10}k`
                              : value
                          }`
                        }
                      />
                      <RechartsTooltip
                        formatter={(value: number) =>
                          `$${value.toLocaleString()}`
                        }
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="income"
                        name="Income"
                        stroke="#10b981"
                        strokeWidth={3}
                        dot={false}
                        activeDot={{ r: 8 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="expense"
                        name="Expense"
                        stroke="#ef4444"
                        strokeWidth={3}
                        dot={false}
                        activeDot={{ r: 8 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="savings"
                        name="Savings"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        dot={false}
                        activeDot={{ r: 8 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="investment"
                        name="Investment"
                        stroke="#f59e0b"
                        strokeWidth={3}
                        dot={false}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Dashboard;
