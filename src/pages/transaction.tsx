"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  X,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  CreditCard,
  DollarSign,
} from "lucide-react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Box,
  Container,
  Grid,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Pagination,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import axios from "axios";
import toast from "react-hot-toast";

const options = ["Income", "Expense", "Savings", "Investment"];
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
type TransactionCategory = keyof typeof transactionTypes;

interface Transaction {
  id: string;
  title: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 500,
  bgcolor: "background.paper",
  borderRadius: "16px",
  boxShadow: 24,
  p: 4,
};

// Helper Functions for Styling
const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Income":
      return <TrendingUp size={18} />;
    case "Expense":
      return <TrendingDown size={18} />;
    case "Savings":
      return <PiggyBank size={18} />;
    case "Investment":
      return <CreditCard size={18} />;
    default:
      return <DollarSign size={18} />;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case "Income":
      return "success";
    case "Expense":
      return "error";
    case "Savings":
      return "primary";
    case "Investment":
      return "warning";
    default:
      return "default";
  }
};

function TransactionPage() {
  const [filteredData, setFilteredData] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isTransactionModalOpen, setTransactionModalOpen] = useState(false);
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);

  const [transaction, setTransaction] = useState({
    title: "",
    amount: "",
    category: "",
    description: "",
    transactionType: "",
  });
  const [payment, setPayment] = useState({
    title: "",
    amount: "",
    description: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // <-- SEKARANG AKAN DIGUNAKAN
  const getUser = localStorage.getItem("data");

  const fetchData = async () => {
    setIsLoading(true);
    if (!getUser) {
      setIsLoading(false);
      return;
    }
    const username = JSON.parse(getUser).username;
    try {
      const res = await axios.get(
        `https://myassets-backend.vercel.app/getTransaction/${username}`
      );
      const formatted = res.data
        .map((t: any) => ({
          ...t,
          date: new Date(t.date).toLocaleDateString("en-CA"),
          amount: parseFloat(t.amount) || 0,
        }))
        .sort(
          (a: Transaction, b: Transaction) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      setFilteredData(formatted);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      toast.error("Could not fetch transactions.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // === PERBAIKAN DI SINI ===
  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  const handleTransactionChange = (e: any) => {
    const { name, value } = e.target;
    setTransaction((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (e: any) => {
    const { name, value } = e.target;
    setPayment((prev) => ({ ...prev, [name]: value }));
  };

  const submitTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading("Creating transaction...");
    if (getUser) {
      const username = JSON.parse(getUser).username;
      try {
        await axios.post("https://myassets-backend.vercel.app/newTransaction", {
          username,
          title: transaction.title,
          amount: parseFloat(transaction.amount),
          category: transaction.category,
          description: transaction.description,
          type: transaction.transactionType,
        });
        toast.dismiss(loadingToast);
        toast.success("Transaction created successfully!");
        setTransactionModalOpen(false);
        setTransaction({
          title: "",
          amount: "",
          category: "",
          description: "",
          transactionType: "",
        });
        fetchData();
      } catch (error: any) {
        toast.dismiss(loadingToast);
        toast.error(
          error.response?.data?.error || "Failed to create transaction."
        );
      }
    }
  };

  const submitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading("Creating payment...");
    if (getUser) {
      const username = JSON.parse(getUser).username;
      try {
        await axios.post(
          "https://myassets-backend.vercel.app/newOutstandingPayment",
          {
            username,
            title: payment.title,
            amount: parseFloat(payment.amount),
            description: payment.description,
          }
        );
        toast.dismiss(loadingToast);
        toast.success("Payment created successfully!");
        setPaymentModalOpen(false);
        setPayment({ title: "", amount: "", description: "" });
      } catch (error: any) {
        toast.dismiss(loadingToast);
        toast.error(error.response?.data?.error || "Failed to create payment.");
      }
    }
  };

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
        <Typography variant="h3" gutterBottom>
          Transaction Management
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Track, manage, and analyze your financial transactions
        </Typography>

        <Box sx={{ my: 4, display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Button
            variant="contained"
            onClick={() => setTransactionModalOpen(true)}
            startIcon={<Plus />}
          >
            Create Transaction
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setPaymentModalOpen(true)}
            startIcon={<Plus />}
          >
            Create Payment
          </Button>
        </Box>

        <Card
          sx={{ background: "rgba(255, 255, 255, 0.8)", borderRadius: "16px" }}
        >
          <CardContent>
            {isLoading ? (
              <Typography textAlign="center" p={5}>
                Loading transactions...
              </Typography>
            ) : !filteredData || filteredData.length === 0 ? (
              <Typography textAlign="center" p={5}>
                No transactions found.
              </Typography>
            ) : // === PERBAIKAN DI SINI: TAMPILAN RESPONSIVE ===
            isMobile ? (
              // Tampilan Kartu untuk Mobile
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {paginatedData.map((row) => (
                  <motion.div
                    key={row.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <Card variant="outlined">
                      <CardContent>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography variant="h6">{row.title}</Typography>
                          <Chip
                            icon={getCategoryIcon(row.category)}
                            label={row.category}
                            color={getCategoryColor(row.category)}
                            size="small"
                          />
                        </Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          noWrap
                          sx={{ my: 1 }}
                        >
                          {row.description}
                        </Typography>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography variant="caption" color="text.secondary">
                            {row.date}
                          </Typography>
                          <Typography
                            color={
                              row.category === "Income"
                                ? "success.main"
                                : "error.main"
                            }
                            fontWeight="bold"
                          >
                            {row.category === "Income" ? "+" : "-"}$
                            {row.amount.toLocaleString()}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </Box>
            ) : (
              // Tampilan Tabel untuk Desktop
              <TableContainer
                component={Paper}
                sx={{ borderRadius: "12px", background: "transparent" }}
              >
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow
                      sx={{
                        "& .MuiTableCell-root": {
                          fontWeight: "bold",
                          background: "rgba(0,0,0,0.02)",
                        },
                      }}
                    >
                      <TableCell>Title</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell align="right">Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedData.map((row) => (
                      <TableRow
                        key={row.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {row.title}
                        </TableCell>
                        <TableCell sx={{ maxWidth: 200 }}>
                          {row.description}
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getCategoryIcon(row.category)}
                            label={row.category}
                            color={getCategoryColor(row.category)}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>{row.date}</TableCell>
                        <TableCell align="right">
                          <Typography
                            color={
                              row.category === "Income"
                                ? "success.main"
                                : "error.main"
                            }
                            fontWeight="500"
                          >
                            {row.category === "Income" ? "+" : "-"}$
                            {row.amount.toLocaleString()}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </Card>

        {/* Modals */}
        <Modal
          open={isTransactionModalOpen}
          onClose={() => setTransactionModalOpen(false)}
        >
          <Box sx={modalStyle}>
            <IconButton
              onClick={() => setTransactionModalOpen(false)}
              sx={{ position: "absolute", right: 8, top: 8 }}
            >
              <X />
            </IconButton>
            <Typography variant="h6">Create New Transaction</Typography>
            <form onSubmit={submitTransaction}>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Title"
                    name="title"
                    value={transaction.title}
                    onChange={handleTransactionChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Amount"
                    name="amount"
                    type="number"
                    value={transaction.amount}
                    onChange={handleTransactionChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Category</InputLabel>
                    <Select
                      name="category"
                      value={transaction.category}
                      label="Category"
                      onChange={handleTransactionChange}
                    >
                      {options.map((opt) => (
                        <MenuItem key={opt} value={opt}>
                          {opt}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                {transaction.category && (
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Type</InputLabel>
                      <Select
                        name="transactionType"
                        value={transaction.transactionType}
                        label="Type"
                        onChange={handleTransactionChange}
                      >
                        {(
                          transactionTypes[
                            transaction.category as TransactionCategory
                          ] || []
                        ).map((type) => (
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
                    multiline
                    rows={3}
                    value={transaction.description}
                    onChange={handleTransactionChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" fullWidth variant="contained">
                    Create
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Modal>
        <Modal
          open={isPaymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
        >
          <Box sx={modalStyle}>
            <IconButton
              onClick={() => setPaymentModalOpen(false)}
              sx={{ position: "absolute", right: 8, top: 8 }}
            >
              <X />
            </IconButton>
            <Typography variant="h6">Create Outstanding Payment</Typography>
            <form onSubmit={submitPayment}>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Payment Title"
                    name="title"
                    value={payment.title}
                    onChange={handlePaymentChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Total Amount Due"
                    name="amount"
                    type="number"
                    value={payment.amount}
                    onChange={handlePaymentChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    multiline
                    rows={3}
                    value={payment.description}
                    onChange={handlePaymentChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="secondary"
                  >
                    Create
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Modal>
      </Container>
    </Box>
  );
}

export default TransactionPage;
