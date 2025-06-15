"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Plus,
  X,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  CreditCard,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Box,
  Container,
  Grid,
  Pagination,
  useMediaQuery,
  useTheme,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

const options = [
  "Choose Category",
  "Income",
  "Expense",
  "Savings",
  "Investment",
];

type TransactionCategory = keyof typeof transactionTypes;

interface Transaction {
  title: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

const transactionTypes = {
  Expense: [
    "Rent/Mortgage",
    "Food & Beverages",
    "Transportation",
    "Shopping",
    "Utilities",
    "Entertainment",
    "Other",
  ],
  Income: ["Salary", "Business", "Freelance", "Investment", "Gift", "Other"],
  Savings: [
    "Emergency Fund",
    "Retirement Fund",
    "Vacation Fund",
    "Education Fund",
    "Other",
  ],
  Investment: [
    "Stocks",
    "Cryptocurrency",
    "Real Estate",
    "Commodities",
    "Other",
  ],
};

function Transaction() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredData, setFilteredData] = useState<Transaction[]>([]);
  const [minAmount, setMinAmount] = useState<number | "">(0);
  const [maxAmount, setMaxAmount] = useState<number | "">(0);
  const [transaction, setTransaction] = useState({
    title: "",
    amount: 0,
    category: "",
    description: "",
    transactionType: "",
  });
  const [payment, setPayment] = useState({
    title: "",
    amount: 0,
    description: "",
  });
  const [isExpanded, setExpanded] = useState<boolean>(false);
  const [isExpandedPayment, setPaymentExpanded] = useState<boolean>(false);
  const [expandTools, setExpandTools] = useState({
    searchExpanded: false,
    filterExpanded: false,
    sortExpanded: false,
  });
  const [transactionData, setTransactionData] = useState<Transaction[]>([]);
  const [isDatePickerVisible, setIsDatePickerVisible] =
    useState<boolean>(false);
  const [isAmountVisible, setIsAmountVisible] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showAmounts, setShowAmounts] = useState<boolean>(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const itemsPerPage = 7;

  const getUser = localStorage.getItem("data");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (getUser) {
          const currentUser = JSON.parse(getUser);
          const currentUsername = currentUser.username;
          const allTransaction = await axios.get(
            `https://myassets-backend.vercel.app/getTransaction/${currentUsername}`
          );
          const formattedTransactions = allTransaction.data.map(
            (transaction: any) => {
              const date = new Date(transaction.date);
              const formattedDate = date.toISOString().split("T")[0];
              return {
                ...transaction,
                date: formattedDate,
                amount: Number.parseFloat(transaction.amount),
              };
            }
          );
          setTransactionData(formattedTransactions);
        }
      } catch (err: any) {
        console.error("Error fetching transactions:", err.message);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = transactionData.filter((transaction) => {
      const isDateMatch = selectedDate
        ? new Date(transaction.date).toDateString() ===
          selectedDate.toDateString()
        : true;
      const isSearchMatch = searchQuery
        ? transaction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          transaction.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        : true;
      const isAmountMatch =
        (minAmount || minAmount === 0) && (maxAmount || maxAmount === 0)
          ? transaction.amount >= (minAmount || 0) &&
            transaction.amount <= (maxAmount || Number.POSITIVE_INFINITY)
          : true;

      return isDateMatch && isSearchMatch && isAmountMatch;
    });

    setFilteredData(filtered);
  }, [searchQuery, selectedDate, minAmount, maxAmount, transactionData]);

  const submitTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (getUser) {
      const currentUser = JSON.parse(getUser);
      try {
        const result = await axios.post(
          "https://myassets-backend.vercel.app/newTransaction",
          {
            username: currentUser.username,
            title: transaction.title,
            amount: transaction.amount,
            category: transaction.category,
            description: transaction.description,
            type: transaction.transactionType,
          }
        );

        if (result.status === 200) {
          setTransactionData((prevData: any) => [
            ...prevData,
            {
              title: transaction.title,
              amount: transaction.amount,
              category: transaction.category,
              description: transaction.description,
              date: new Date().toISOString().split("T")[0],
            },
          ]);

          setTransaction({
            title: "",
            amount: 0,
            category: "",
            description: "",
            transactionType: "",
          });
          setExpanded(false);
        }
      } catch (error: any) {
        console.log("Error saving data:", error.message);
      }
    }
  };

  const submitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (getUser) {
      const currentUser = JSON.parse(getUser);
      try {
        const result = await axios.post(
          "https://myassets-backend.vercel.app/newOutstandingPayment",
          {
            username: currentUser.username,
            title: payment.title,
            amount: payment.amount,
            description: payment.description,
          }
        );

        if (result.status === 200) {
          setPayment({
            title: "",
            amount: 0,
            description: "",
          });
          setPaymentExpanded(false);
        }
      } catch (error: any) {
        console.log("Error saving data:", error.message);
      }
    }
  };

  const handleFilterToggle = (filterType: "search" | "filter" | "sort") => {
    setExpandTools((prev) => ({
      searchExpanded: filterType === "search" ? !prev.searchExpanded : false,
      filterExpanded: filterType === "filter" ? !prev.filterExpanded : false,
      sortExpanded: filterType === "sort" ? !prev.sortExpanded : false,
    }));
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "minAmount") {
      setMinAmount(value ? Number.parseFloat(value) : 0);
    } else if (name === "maxAmount") {
      setMaxAmount(value ? Number.parseFloat(value) : Number.POSITIVE_INFINITY);
    }
  };

  const sortAscending = () => {
    setFilteredData([...filteredData].sort((a, b) => a.amount - b.amount));
  };

  const sortDescending = () => {
    setFilteredData([...filteredData].sort((a, b) => b.amount - a.amount));
  };

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { target: { name: string; value: string } }
  ) => {
    const { name, value } = event.target;
    setTransaction((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentChange = (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { target: { name: string; value: string } }
  ) => {
    const { name, value } = event.target;
    setPayment((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number.parseFloat(value) : value,
    }));
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    event.preventDefault();
    setCurrentPage(value);
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
          <Box sx={{ mb: 4 }}>
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
              Transaction Management
            </Typography>
            <Typography variant="h6" sx={{ color: "#64748b" }}>
              Track, manage, and analyze your financial transactions
            </Typography>
          </Box>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: 2,
              mb: 4,
              alignItems: isMobile ? "stretch" : "center",
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexDirection: isMobile ? "column" : "row",
              }}
            >
              <Button
                variant="contained"
                startIcon={<Plus className="w-5 h-5" />}
                onClick={() => setExpanded(true)}
                sx={{
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  borderRadius: "12px",
                  px: 3,
                  py: 1.5,
                  fontWeight: 600,
                  textTransform: "none",
                  boxShadow: "0 8px 25px rgba(16, 185, 129, 0.3)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #059669, #047857)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 12px 35px rgba(16, 185, 129, 0.4)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Create Transaction
              </Button>
              <Button
                variant="contained"
                startIcon={<Plus className="w-5 h-5" />}
                onClick={() => setPaymentExpanded(true)}
                sx={{
                  background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                  borderRadius: "12px",
                  px: 3,
                  py: 1.5,
                  fontWeight: 600,
                  textTransform: "none",
                  boxShadow: "0 8px 25px rgba(59, 130, 246, 0.3)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 12px 35px rgba(59, 130, 246, 0.4)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Create Payment
              </Button>
            </Box>

            {/* Tools */}
            <Box
              sx={{
                display: "flex",
                gap: 1,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
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

              <Button
                variant="outlined"
                startIcon={<Search className="w-4 h-4" />}
                onClick={() => handleFilterToggle("search")}
                sx={{
                  background: expandTools.searchExpanded
                    ? "rgba(59, 130, 246, 0.1)"
                    : "rgba(255, 255, 255, 0.7)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  color: "#64748b",
                  borderRadius: "12px",
                  "&:hover": {
                    background: "rgba(59, 130, 246, 0.1)",
                    borderColor: "#3b82f6",
                  },
                }}
              >
                Search
              </Button>

              <Button
                variant="outlined"
                startIcon={<Filter className="w-4 h-4" />}
                onClick={() => handleFilterToggle("filter")}
                sx={{
                  background: expandTools.filterExpanded
                    ? "rgba(59, 130, 246, 0.1)"
                    : "rgba(255, 255, 255, 0.7)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  color: "#64748b",
                  borderRadius: "12px",
                  "&:hover": {
                    background: "rgba(59, 130, 246, 0.1)",
                    borderColor: "#3b82f6",
                  },
                }}
              >
                Filter
              </Button>

              <Button
                variant="outlined"
                startIcon={<SortAsc className="w-4 h-4" />}
                onClick={() => handleFilterToggle("sort")}
                sx={{
                  background: expandTools.sortExpanded
                    ? "rgba(59, 130, 246, 0.1)"
                    : "rgba(255, 255, 255, 0.7)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  color: "#64748b",
                  borderRadius: "12px",
                  "&:hover": {
                    background: "rgba(59, 130, 246, 0.1)",
                    borderColor: "#3b82f6",
                  },
                }}
              >
                Sort
              </Button>
            </Box>
          </Box>
        </motion.div>

        {/* Expanded Tools */}
        <AnimatePresence>
          {expandTools.searchExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                sx={{
                  background: "rgba(255, 255, 255, 0.8)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  borderRadius: "16px",
                  mb: 3,
                  overflow: "hidden",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <TextField
                    fullWidth
                    placeholder="Search transactions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search className="w-5 h-5 text-gray-400" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        background: "rgba(255, 255, 255, 0.5)",
                      },
                    }}
                  />
                </CardContent>
              </Card>
            </motion.div>
          )}

          {expandTools.filterExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                sx={{
                  background: "rgba(255, 255, 255, 0.8)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  borderRadius: "16px",
                  mb: 3,
                  overflow: "hidden",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <Button
                        variant="outlined"
                        startIcon={<Calendar className="w-4 h-4" />}
                        onClick={() =>
                          setIsDatePickerVisible(!isDatePickerVisible)
                        }
                        fullWidth
                        sx={{
                          borderRadius: "12px",
                          py: 1.5,
                          background: isDatePickerVisible
                            ? "rgba(59, 130, 246, 0.1)"
                            : "transparent",
                        }}
                      >
                        Filter by Date
                      </Button>
                      {isDatePickerVisible && (
                        <Box sx={{ mt: 2 }}>
                          <DatePicker
                            selected={selectedDate}
                            onChange={(date: Date | null) =>
                              setSelectedDate(date)
                            }
                            placeholderText="Select Date"
                            dateFormat="yyyy/MM/dd"
                            className="w-full p-3 rounded-lg border border-gray-200 bg-white/50"
                            wrapperClassName="w-full"
                          />
                        </Box>
                      )}
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Button
                        variant="outlined"
                        startIcon={<DollarSign className="w-4 h-4" />}
                        onClick={() => setIsAmountVisible(!isAmountVisible)}
                        fullWidth
                        sx={{
                          borderRadius: "12px",
                          py: 1.5,
                          background: isAmountVisible
                            ? "rgba(59, 130, 246, 0.1)"
                            : "transparent",
                        }}
                      >
                        Filter by Amount
                      </Button>
                      {isAmountVisible && (
                        <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
                          <TextField
                            type="number"
                            placeholder="Min Amount"
                            name="minAmount"
                            onChange={handleAmountChange}
                            size="small"
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "8px",
                                background: "rgba(255, 255, 255, 0.5)",
                              },
                            }}
                          />
                          <TextField
                            type="number"
                            placeholder="Max Amount"
                            name="maxAmount"
                            onChange={handleAmountChange}
                            size="small"
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "8px",
                                background: "rgba(255, 255, 255, 0.5)",
                              },
                            }}
                          />
                        </Box>
                      )}
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {expandTools.sortExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                sx={{
                  background: "rgba(255, 255, 255, 0.8)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  borderRadius: "16px",
                  mb: 3,
                  overflow: "hidden",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                      variant="outlined"
                      startIcon={<SortAsc className="w-4 h-4" />}
                      onClick={sortAscending}
                      sx={{
                        borderRadius: "12px",
                        px: 3,
                        py: 1.5,
                        "&:hover": {
                          background: "rgba(16, 185, 129, 0.1)",
                          borderColor: "#10b981",
                        },
                      }}
                    >
                      Ascending
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<SortDesc className="w-4 h-4" />}
                      onClick={sortDescending}
                      sx={{
                        borderRadius: "12px",
                        px: 3,
                        py: 1.5,
                        "&:hover": {
                          background: "rgba(239, 68, 68, 0.1)",
                          borderColor: "#ef4444",
                        },
                      }}
                    >
                      Descending
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Transactions Table */}
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
              mb: 4,
            }}
          >
            <CardHeader sx={{ pb: 2 }}>
              <Typography
                variant="h5"
                sx={{ fontWeight: 600, color: "#1e293b" }}
              >
                Recent Transactions
              </Typography>
            </CardHeader>
            <CardContent sx={{ p: 0 }}>
              {isMobile ? (
                // Mobile Card View
                <Box sx={{ p: 3 }}>
                  {paginatedData.length === 0 ? (
                    <Box sx={{ textAlign: "center", py: 8 }}>
                      <Typography sx={{ color: "#64748b", fontSize: "1.1rem" }}>
                        No transactions found
                      </Typography>
                    </Box>
                  ) : (
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      {paginatedData.map((transaction, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                        >
                          <Card
                            sx={{
                              background: "rgba(255, 255, 255, 0.7)",
                              backdropFilter: "blur(10px)",
                              border: "1px solid rgba(255, 255, 255, 0.3)",
                              borderRadius: "12px",
                              "&:hover": {
                                background: "rgba(255, 255, 255, 0.9)",
                                transform: "translateY(-2px)",
                              },
                              transition: "all 0.3s ease",
                            }}
                          >
                            <CardContent sx={{ p: 2 }}>
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
                                  <Box
                                    sx={{
                                      width: 40,
                                      height: 40,
                                      borderRadius: "12px",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      background: `linear-gradient(135deg, ${getCategoryColor(
                                        transaction.category
                                      )}, ${getCategoryColor(
                                        transaction.category
                                      )}dd)`,
                                      color: "white",
                                    }}
                                  >
                                    {getCategoryIcon(transaction.category)}
                                  </Box>
                                  <Box>
                                    <Typography
                                      variant="body1"
                                      sx={{ fontWeight: 600, color: "#1e293b" }}
                                    >
                                      {transaction.title}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      sx={{ color: "#64748b" }}
                                    >
                                      {transaction.date}
                                    </Typography>
                                  </Box>
                                </Box>
                                <Box sx={{ textAlign: "right" }}>
                                  <Typography
                                    variant="body1"
                                    sx={{
                                      fontWeight: 700,
                                      color: getCategoryColor(
                                        transaction.category
                                      ),
                                    }}
                                  >
                                    {showAmounts
                                      ? transaction.category === "Expense"
                                        ? `-$${transaction.amount.toLocaleString()}`
                                        : `+$${transaction.amount.toLocaleString()}`
                                      : "••••••"}
                                  </Typography>
                                  <Chip
                                    label={transaction.category}
                                    size="small"
                                    sx={{
                                      fontSize: "0.7rem",
                                      height: "20px",
                                      backgroundColor: `${getCategoryColor(
                                        transaction.category
                                      )}20`,
                                      color: getCategoryColor(
                                        transaction.category
                                      ),
                                    }}
                                  />
                                </Box>
                              </Box>
                              <Typography
                                variant="body2"
                                sx={{ color: "#64748b" }}
                              >
                                {transaction.description}
                              </Typography>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </Box>
                  )}
                </Box>
              ) : (
                // Desktop Table View
                <Box sx={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: "rgba(30, 41, 59, 0.05)" }}>
                        <th
                          style={{
                            padding: "16px 24px",
                            textAlign: "left",
                            fontWeight: 600,
                            color: "#1e293b",
                            borderBottom: "1px solid rgba(226, 232, 240, 0.5)",
                          }}
                        >
                          Title
                        </th>
                        <th
                          style={{
                            padding: "16px 24px",
                            textAlign: "left",
                            fontWeight: 600,
                            color: "#1e293b",
                            borderBottom: "1px solid rgba(226, 232, 240, 0.5)",
                          }}
                        >
                          Description
                        </th>
                        <th
                          style={{
                            padding: "16px 24px",
                            textAlign: "left",
                            fontWeight: 600,
                            color: "#1e293b",
                            borderBottom: "1px solid rgba(226, 232, 240, 0.5)",
                          }}
                        >
                          Category
                        </th>
                        <th
                          style={{
                            padding: "16px 24px",
                            textAlign: "left",
                            fontWeight: 600,
                            color: "#1e293b",
                            borderBottom: "1px solid rgba(226, 232, 240, 0.5)",
                          }}
                        >
                          Date
                        </th>
                        <th
                          style={{
                            padding: "16px 24px",
                            textAlign: "right",
                            fontWeight: 600,
                            color: "#1e293b",
                            borderBottom: "1px solid rgba(226, 232, 240, 0.5)",
                          }}
                        >
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedData.length === 0 ? (
                        <tr>
                          <td
                            colSpan={5}
                            style={{
                              padding: "48px 24px",
                              textAlign: "center",
                              color: "#64748b",
                            }}
                          >
                            No transactions found
                          </td>
                        </tr>
                      ) : (
                        paginatedData.map((transaction, index) => (
                          <motion.tr
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            style={{
                              borderBottom:
                                "1px solid rgba(226, 232, 240, 0.3)",
                            }}
                          >
                            <td
                              style={{
                                padding: "16px 24px",
                                color: "#1e293b",
                                fontWeight: 500,
                              }}
                            >
                              {transaction.title}
                            </td>
                            <td
                              style={{ padding: "16px 24px", color: "#64748b" }}
                            >
                              {transaction.description}
                            </td>
                            <td style={{ padding: "16px 24px" }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <Box
                                  sx={{
                                    width: 24,
                                    height: 24,
                                    borderRadius: "6px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    background: `${getCategoryColor(
                                      transaction.category
                                    )}20`,
                                    color: getCategoryColor(
                                      transaction.category
                                    ),
                                  }}
                                >
                                  {getCategoryIcon(transaction.category)}
                                </Box>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: getCategoryColor(
                                      transaction.category
                                    ),
                                    fontWeight: 600,
                                  }}
                                >
                                  {transaction.category}
                                </Typography>
                              </Box>
                            </td>
                            <td
                              style={{ padding: "16px 24px", color: "#64748b" }}
                            >
                              {transaction.date}
                            </td>
                            <td
                              style={{
                                padding: "16px 24px",
                                textAlign: "right",
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 700,
                                  color: getCategoryColor(transaction.category),
                                }}
                              >
                                {showAmounts
                                  ? transaction.category === "Expense"
                                    ? `-$${transaction.amount.toLocaleString()}`
                                    : `+$${transaction.amount.toLocaleString()}`
                                  : "••••••"}
                              </Typography>
                            </td>
                          </motion.tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </Box>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              shape="rounded"
              sx={{
                "& .MuiPaginationItem-root": {
                  background: "rgba(255, 255, 255, 0.7)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  "&:hover": {
                    background: "rgba(59, 130, 246, 0.1)",
                  },
                  "&.Mui-selected": {
                    background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                    color: "white",
                  },
                },
              }}
            />
          </Box>
        )}
      </Container>

      {/* Transaction Modal */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(8px)",
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px",
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                sx={{
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  borderRadius: "20px",
                  boxShadow: "0 25px 50px rgba(0, 0, 0, 0.25)",
                  width: "100%",
                  maxWidth: "600px",
                  maxHeight: "90vh",
                  overflow: "auto",
                }}
              >
                <CardHeader
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    pb: 2,
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 600, color: "#1e293b" }}
                  >
                    Create New Transaction
                  </Typography>
                  <IconButton onClick={() => setExpanded(false)}>
                    <X className="w-5 h-5" />
                  </IconButton>
                </CardHeader>
                <CardContent>
                  <form onSubmit={submitTransaction}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Transaction Title"
                          name="title"
                          value={transaction.title}
                          onChange={handleChange}
                          required
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "12px",
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Amount (USD)"
                          name="amount"
                          type="number"
                          value={transaction.amount}
                          onChange={handleChange}
                          required
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "12px",
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FormControl fullWidth>
                          <InputLabel>Category</InputLabel>
                          <Select
                            name="category"
                            value={transaction.category}
                            onChange={(e) =>
                              handleChange({
                                target: {
                                  name: "category",
                                  value: e.target.value,
                                },
                              })
                            }
                            required
                            sx={{
                              borderRadius: "12px",
                            }}
                          >
                            {options.slice(1).map((option) => (
                              <MenuItem key={option} value={option}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  {getCategoryIcon(option)}
                                  {option}
                                </Box>
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      {transaction.category && (
                        <Grid item xs={12}>
                          <FormControl fullWidth>
                            <InputLabel>Transaction Type</InputLabel>
                            <Select
                              name="transactionType"
                              value={transaction.transactionType}
                              onChange={(e) =>
                                handleChange({
                                  target: {
                                    name: "transactionType",
                                    value: e.target.value,
                                  },
                                })
                              }
                              required
                              sx={{
                                borderRadius: "12px",
                              }}
                            >
                              {transactionTypes[
                                transaction.category as TransactionCategory
                              ]?.map((type: string) => (
                                <MenuItem key={type} value={type}>
                                  {type}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                      )}
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Description"
                          name="description"
                          value={transaction.description}
                          onChange={handleChange}
                          multiline
                          rows={3}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "12px",
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          sx={{
                            background:
                              "linear-gradient(135deg, #10b981, #059669)",
                            borderRadius: "12px",
                            py: 1.5,
                            fontWeight: 600,
                            textTransform: "none",
                            fontSize: "1.1rem",
                            "&:hover": {
                              background:
                                "linear-gradient(135deg, #059669, #047857)",
                            },
                          }}
                        >
                          Create Transaction
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Modal */}
      <AnimatePresence>
        {isExpandedPayment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(8px)",
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px",
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                sx={{
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  borderRadius: "20px",
                  boxShadow: "0 25px 50px rgba(0, 0, 0, 0.25)",
                  width: "100%",
                  maxWidth: "500px",
                  maxHeight: "90vh",
                  overflow: "auto",
                }}
              >
                <CardHeader
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    pb: 2,
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 600, color: "#1e293b" }}
                  >
                    Create Outstanding Payment
                  </Typography>
                  <IconButton onClick={() => setPaymentExpanded(false)}>
                    <X className="w-5 h-5" />
                  </IconButton>
                </CardHeader>
                <CardContent>
                  <form onSubmit={submitPayment}>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Payment Title"
                          name="title"
                          value={payment.title}
                          onChange={handlePaymentChange}
                          required
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "12px",
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Amount (USD)"
                          name="amount"
                          type="number"
                          value={payment.amount}
                          onChange={handlePaymentChange}
                          required
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "12px",
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Description"
                          name="description"
                          value={payment.description}
                          onChange={handlePaymentChange}
                          multiline
                          rows={3}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "12px",
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          sx={{
                            background:
                              "linear-gradient(135deg, #3b82f6, #2563eb)",
                            borderRadius: "12px",
                            py: 1.5,
                            fontWeight: 600,
                            textTransform: "none",
                            fontSize: "1.1rem",
                            "&:hover": {
                              background:
                                "linear-gradient(135deg, #2563eb, #1d4ed8)",
                            },
                          }}
                        >
                          Create Payment
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}

export default Transaction;
