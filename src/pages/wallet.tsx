"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  PiggyBank,
  DollarSign,
  CreditCard,
  Eye,
  EyeOff,
  RefreshCw,
  ArrowUpRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Target,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  LinearProgress,
  Box,
  Container,
  Grid,
  Chip,
  IconButton,
  useMediaQuery,
  useTheme,
  Tooltip,
  Avatar,
} from "@mui/material";
import axios from "axios";

interface Payment {
  payment_name: string;
  amount_due: number;
  status: string;
  amount_paid: number;
}

interface TransactionData {
  id: string;
  title: string;
  amount: number;
  date: string;
  category: string;
}

function Wallet() {
  const [incomeData, setIncomeData] = useState<TransactionData[]>([]);
  const [expenseData, setExpenseData] = useState<TransactionData[]>([]);
  const [savingsData, setSavingsData] = useState<TransactionData[]>([]);
  const [investmentData, setInvestmentData] = useState<TransactionData[]>([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [paymentData, setPaymentData] = useState<Payment[]>([]);
  const [showAmounts, setShowAmounts] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const user = localStorage.getItem("data");
        if (user) {
          const currentuser = JSON.parse(user);
          const currentUsername = currentuser.username;
          const result = await axios.get(
            `https://myassets-backend.vercel.app/transactionHistory/${currentUsername}`
          );

          const fetchedData = result.data.data;
          setIncomeData(
            fetchedData.filter((data: any) => data.category === "Income")
          );
          setExpenseData(
            fetchedData.filter((data: any) => data.category === "Expense")
          );
          setSavingsData(
            fetchedData.filter((data: any) => data.category === "Savings")
          );
          setInvestmentData(
            fetchedData.filter((data: any) => data.category === "Investment")
          );

          const paymentResult = await axios.get(
            `https://myassets-backend.vercel.app/getPayments/${currentUsername}`
          );
          setPaymentData(paymentResult.data);
        }
      } catch (err: any) {
        console.log("err : ", err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let totalIncome = 0,
      totalExpense = 0,
      totalSavings = 0,
      totalInvestment = 0;

    incomeData.forEach((income: any) => (totalIncome += Number(income.amount)));
    expenseData.forEach(
      (expense: any) => (totalExpense += Number(expense.amount))
    );
    savingsData.forEach(
      (savings: any) => (totalSavings += Number(savings.amount))
    );
    investmentData.forEach(
      (investment: any) => (totalInvestment += Number(investment.amount))
    );

    setTotalIncome(totalIncome);
    setTotalExpense(totalExpense);
    setTotalSavings(totalSavings);
    setTotalInvestment(totalInvestment);
  }, [incomeData, expenseData, savingsData, investmentData]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "#10b981";
      case "pending":
        return "#f59e0b";
      case "overdue":
        return "#ef4444";
      default:
        return "#64748b";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "overdue":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Income":
        return <TrendingUp className="w-5 h-5" />;
      case "Expense":
        return <TrendingDown className="w-5 h-5" />;
      case "Savings":
        return <PiggyBank className="w-5 h-5" />;
      case "Investment":
        return <CreditCard className="w-5 h-5" />;
      default:
        return <DollarSign className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Income":
        return "#10b981";
      case "Expense":
        return "#ef4444";
      case "Savings":
        return "#3b82f6";
      case "Investment":
        return "#f59e0b";
      default:
        return "#64748b";
    }
  };

  const getCategoryGradient = (category: string) => {
    switch (category) {
      case "Income":
        return "linear-gradient(135deg, #10b981, #059669)";
      case "Expense":
        return "linear-gradient(135deg, #ef4444, #dc2626)";
      case "Savings":
        return "linear-gradient(135deg, #3b82f6, #2563eb)";
      case "Investment":
        return "linear-gradient(135deg, #f59e0b, #d97706)";
      default:
        return "linear-gradient(135deg, #64748b, #475569)";
    }
  };

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const user = localStorage.getItem("data");
      if (user) {
        const currentuser = JSON.parse(user);
        const currentUsername = currentuser.username;
        const result = await axios.get(
          `https://myassets-backend.vercel.app/transactionHistory/${currentUsername}`
        );

        const fetchedData = result.data.data;
        setIncomeData(
          fetchedData.filter((data: any) => data.category === "Income")
        );
        setExpenseData(
          fetchedData.filter((data: any) => data.category === "Expense")
        );
        setSavingsData(
          fetchedData.filter((data: any) => data.category === "Savings")
        );
        setInvestmentData(
          fetchedData.filter((data: any) => data.category === "Investment")
        );

        const paymentResult = await axios.get(
          `https://myassets-backend.vercel.app/getPayments/${currentUsername}`
        );
        setPaymentData(paymentResult.data);
      }
    } catch (err: any) {
      console.log("err : ", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const CategoryCard = ({
    category,
    data,
    total,
  }: {
    category: string;
    data: TransactionData[];
    total: number;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      whileHover={{ y: -5 }}
    >
      <Card
        sx={{
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          borderRadius: "20px",
          boxShadow: "0 25px 50px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
          height: "100%",
          position: "relative",
          cursor: "pointer",
          "&:hover": {
            boxShadow: "0 35px 70px rgba(0, 0, 0, 0.15)",
            transform: "translateY(-8px)",
          },
          transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
        onClick={() =>
          setSelectedCategory(selectedCategory === category ? null : category)
        }
      >
        {/* Gradient Overlay */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: getCategoryGradient(category),
          }}
        />

        <CardHeader sx={{ pb: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: getCategoryGradient(category),
                  color: "white",
                  boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
                }}
              >
                {getCategoryIcon(category)}
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "#1e293b", mb: 0.5 }}
                >
                  {category}
                </Typography>
                <Typography variant="caption" sx={{ color: "#64748b" }}>
                  {data.length} transactions
                </Typography>
              </Box>
            </Box>
            <Box sx={{ textAlign: "right" }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: getCategoryColor(category),
                  mb: 0.5,
                }}
              >
                {showAmounts ? formatAmount(total) : "••••••"}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <ArrowUpRight size={12} style={{ color: "#10b981" }} />
                <Typography
                  variant="caption"
                  sx={{ color: "#10b981", fontWeight: 600 }}
                >
                  +12.5%
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardHeader>

        <CardContent sx={{ pt: 0, maxHeight: "300px", overflowY: "auto" }}>
          <AnimatePresence>
            {selectedCategory === category && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                    mt: 2,
                  }}
                >
                  {data.slice(0, 5).map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          p: 2,
                          borderRadius: "12px",
                          background: "rgba(255, 255, 255, 0.5)",
                          border: "1px solid rgba(255, 255, 255, 0.3)",
                          "&:hover": {
                            background: "rgba(255, 255, 255, 0.8)",
                            transform: "translateX(4px)",
                          },
                          transition: "all 0.3s ease",
                        }}
                      >
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, color: "#1e293b", mb: 0.5 }}
                          >
                            {item.title}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: "#64748b" }}
                          >
                            {formatDate(item.date)}
                          </Typography>
                        </Box>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 700,
                            color: getCategoryColor(category),
                          }}
                        >
                          {showAmounts ? formatAmount(item.amount) : "••••"}
                        </Typography>
                      </Box>
                    </motion.div>
                  ))}
                  {data.length > 5 && (
                    <Typography
                      variant="caption"
                      sx={{ color: "#64748b", textAlign: "center", mt: 1 }}
                    >
                      +{data.length - 5} more transactions
                    </Typography>
                  )}
                </Box>
              </motion.div>
            )}
          </AnimatePresence>

          {selectedCategory !== category && data.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ color: "#64748b", mb: 1 }}>
                Recent Activity
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {data.slice(0, 3).map((item, index) => (
                  <Box
                    key={item.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      py: 1,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ color: "#64748b", maxWidth: "60%" }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 600,
                        color: getCategoryColor(category),
                      }}
                    >
                      {showAmounts ? formatAmount(item.amount) : "••••"}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

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
        py: 4,
      }}
    >
      {/* Animated Background */}
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

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
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
              mb: 4,
              flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? 2 : 0,
            }}
          >
            <Box>
              <Typography
                variant={isMobile ? "h4" : "h3"}
                sx={{
                  fontWeight: 700,
                  background: "linear-gradient(135deg, #1e293b, #64748b)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  mb: 1,
                }}
              >
                Financial Wallet
              </Typography>
              <Typography variant="h6" sx={{ color: "#64748b" }}>
                Manage your finances across all categories
              </Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Tooltip title="Toggle amount visibility">
                <IconButton
                  onClick={() => setShowAmounts(!showAmounts)}
                  sx={{
                    background: "rgba(255, 255, 255, 0.7)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    "&:hover": {
                      background: "rgba(255, 255, 255, 0.9)",
                    },
                  }}
                >
                  {showAmounts ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </IconButton>
              </Tooltip>

              <IconButton
                onClick={refreshData}
                sx={{
                  background: "rgba(255, 255, 255, 0.7)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  "&:hover": {
                    background: "rgba(255, 255, 255, 0.9)",
                  },
                }}
              >
                <RefreshCw className="w-4 h-4" />
              </IconButton>
            </Box>
          </Box>
        </motion.div>

        {/* Outstanding Payments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card
            sx={{
              background: "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              borderRadius: "20px",
              boxShadow: "0 25px 50px rgba(0, 0, 0, 0.1)",
              overflow: "hidden",
              mb: 4,
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
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "linear-gradient(135deg, #ef4444, #dc2626)",
                      color: "white",
                      boxShadow: "0 8px 25px rgba(239, 68, 68, 0.3)",
                    }}
                  >
                    <AlertCircle className="w-6 h-6" />
                  </Box>
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 600, color: "#1e293b" }}
                    >
                      Outstanding Payments
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#64748b" }}>
                      {paymentData.length} payments pending
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  label={`${
                    paymentData.filter(
                      (p) => p.status.toLowerCase() === "overdue"
                    ).length
                  } Overdue`}
                  sx={{
                    background: "rgba(239, 68, 68, 0.1)",
                    color: "#ef4444",
                    fontWeight: 600,
                  }}
                />
              </Box>
            </CardHeader>

            <CardContent>
              {paymentData.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 6 }}>
                  <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                  <Typography
                    variant="h6"
                    sx={{ color: "#10b981", fontWeight: 600, mb: 1 }}
                  >
                    All Caught Up!
                  </Typography>
                  <Typography sx={{ color: "#64748b" }}>
                    No outstanding payments at the moment.
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {paymentData.map((payment, index) => {
                    const progress =
                      (payment.amount_paid / payment.amount_due) * 100;

                    return (
                      <motion.div
                        key={payment.payment_name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                      >
                        <Box
                          sx={{
                            p: 3,
                            borderRadius: "16px",
                            background: "rgba(255, 255, 255, 0.7)",
                            border: "1px solid rgba(255, 255, 255, 0.3)",
                            "&:hover": {
                              background: "rgba(255, 255, 255, 0.9)",
                              transform: "translateY(-2px)",
                            },
                            transition: "all 0.3s ease",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              mb: 2,
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                              }}
                            >
                              <Avatar
                                sx={{
                                  width: 40,
                                  height: 40,
                                  background: getCategoryGradient("Expense"),
                                  color: "white",
                                }}
                              >
                                <CreditCard className="w-5 h-5" />
                              </Avatar>
                              <Box>
                                <Typography
                                  variant="body1"
                                  sx={{ fontWeight: 600, color: "#1e293b" }}
                                >
                                  {payment.payment_name}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{ color: "#64748b" }}
                                >
                                  Due amount:{" "}
                                  {showAmounts
                                    ? formatAmount(payment.amount_due)
                                    : "••••••"}
                                </Typography>
                              </Box>
                            </Box>
                            <Chip
                              icon={getStatusIcon(payment.status)}
                              label={payment.status}
                              sx={{
                                background: `${getStatusColor(
                                  payment.status
                                )}20`,
                                color: getStatusColor(payment.status),
                                fontWeight: 600,
                                "& .MuiChip-icon": {
                                  color: getStatusColor(payment.status),
                                },
                              }}
                            />
                          </Box>

                          <Box sx={{ mb: 2 }}>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 1,
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{ color: "#64748b" }}
                              >
                                Progress
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

                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ color: "#64748b" }}
                            >
                              {showAmounts
                                ? `${formatAmount(
                                    payment.amount_paid
                                  )} / ${formatAmount(payment.amount_due)}`
                                : "•••••• / ••••••"}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 600,
                                color: getStatusColor(payment.status),
                              }}
                            >
                              {showAmounts
                                ? formatAmount(
                                    payment.amount_due - payment.amount_paid
                                  )
                                : "••••••"}{" "}
                              remaining
                            </Typography>
                          </Box>
                        </Box>
                      </motion.div>
                    );
                  })}
                </Box>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Category Cards */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <CategoryCard
              category="Income"
              data={incomeData}
              total={totalIncome}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <CategoryCard
              category="Expense"
              data={expenseData}
              total={totalExpense}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <CategoryCard
              category="Savings"
              data={savingsData}
              total={totalSavings}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <CategoryCard
              category="Investment"
              data={investmentData}
              total={totalInvestment}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Wallet;
