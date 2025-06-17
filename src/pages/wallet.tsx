"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle,
  X,
  RefreshCw,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  LinearProgress,
  Box,
  Container,
  Chip,
  Button,
  Modal,
  TextField,
  IconButton,
  Tooltip,
} from "@mui/material";
import axios from "axios";
import toast from "react-hot-toast";

interface Payment {
  id: string;
  payment_name: string;
  amount_due: number;
  status: string;
  amount_paid: number;
}

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 400,
  bgcolor: "background.paper",
  borderRadius: "16px",
  boxShadow: 24,
  p: 4,
};

function Wallet() {
  const [paymentData, setPaymentData] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPayModalOpen, setPayModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [payAmount, setPayAmount] = useState<number | string>("");
  const [showAmounts, setShowAmounts] = useState(true);
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
        `https://myassets-backend.vercel.app/getPayments/${username}`
      );
      setPaymentData(res.data);
    } catch (err) {
      console.error("Error fetching payments:", err);
      toast.error("Could not fetch payments.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenPayModal = (payment: Payment) => {
    setSelectedPayment(payment);
    const remaining = payment.amount_due - payment.amount_paid;
    setPayAmount(remaining); // Pre-fill with remaining amount
    setPayModalOpen(true);
  };

  const handleClosePayModal = () => {
    setPayModalOpen(false);
    setSelectedPayment(null);
  };

  const handlePaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPayment || !payAmount || parseFloat(String(payAmount)) <= 0) {
      toast.error("Invalid amount.");
      return;
    }

    const loadingToast = toast.loading("Processing payment...");
    const username = JSON.parse(getUser!).username;

    try {
      const response = await axios.post(
        "https://myassets-backend.vercel.app/payOutstandingPayment",
        {
          payment_id: selectedPayment.id,
          amount_to_pay: payAmount,
          username: username,
        }
      );

      toast.dismiss(loadingToast);
      toast.success(response.data.message || "Payment successful!");
      handleClosePayModal();
      fetchData(); // Refresh data
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(error.response?.data?.error || "Payment failed.");
    }
  };

  const getStatusColor = (status: string) =>
    status.toLowerCase() === "paid" ? "success" : "warning";
  const getStatusIcon = (status: string) =>
    status.toLowerCase() === "paid" ? <CheckCircle /> : <AlertCircle />;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #f8fafc 0%, #e0f2fe 50%, #f1f5f9 100%)",
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography variant="h3">Financial Wallet</Typography>
          <Box>
            <Tooltip title="Toggle Amounts">
              <IconButton onClick={() => setShowAmounts(!showAmounts)}>
                {showAmounts ? <Eye /> : <EyeOff />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Refresh">
              <IconButton onClick={fetchData}>
                <RefreshCw />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Card
          sx={{ background: "rgba(255, 255, 255, 0.8)", borderRadius: "16px" }}
        >
          <CardHeader
            title={
              <Typography variant="h5" fontWeight={600}>
                Outstanding Payments
              </Typography>
            }
          />
          <CardContent>
            {isLoading ? (
              <p>Loading...</p>
            ) : paymentData.length === 0 ? (
              <Box textAlign="center" py={5}>
                <CheckCircle size={60} color="#10b981" />
                <Typography variant="h6" mt={2}>
                  All payments are settled!
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {paymentData.map((payment) => {
                  const progress =
                    (payment.amount_paid / payment.amount_due) * 100;
                  return (
                    <motion.div
                      key={payment.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <Card variant="outlined" sx={{ borderRadius: "12px" }}>
                        <CardContent>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                            }}
                          >
                            <Box>
                              <Typography variant="h6">
                                {payment.payment_name}
                              </Typography>
                              <Chip
                                icon={getStatusIcon(payment.status)}
                                label={payment.status}
                                color={getStatusColor(payment.status)}
                                size="small"
                              />
                            </Box>
                            {payment.status !== "Paid" && (
                              <Button
                                variant="contained"
                                onClick={() => handleOpenPayModal(payment)}
                              >
                                Pay
                              </Button>
                            )}
                          </Box>
                          <Box mt={2}>
                            <LinearProgress
                              variant="determinate"
                              value={progress}
                              sx={{ height: 8, borderRadius: 4 }}
                            />
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mt: 1,
                              }}
                            >
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {showAmounts
                                  ? `$${payment.amount_paid.toLocaleString()} / $${payment.amount_due.toLocaleString()}`
                                  : "••••••"}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.primary"
                                fontWeight="bold"
                              >
                                {showAmounts
                                  ? `$${(
                                      payment.amount_due - payment.amount_paid
                                    ).toLocaleString()} remaining`
                                  : "••••••"}
                              </Typography>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </Box>
            )}
          </CardContent>
        </Card>

        <Modal open={isPayModalOpen} onClose={handleClosePayModal}>
          <Box sx={modalStyle}>
            <IconButton
              onClick={handleClosePayModal}
              sx={{ position: "absolute", right: 8, top: 8 }}
            >
              <X />
            </IconButton>
            <Typography variant="h6">
              Pay for: {selectedPayment?.payment_name}
            </Typography>
            <Typography sx={{ mt: 1, color: "text.secondary" }}>
              Remaining: $
              {(
                (selectedPayment?.amount_due || 0) -
                (selectedPayment?.amount_paid || 0)
              ).toLocaleString()}
            </Typography>
            <form onSubmit={handlePaySubmit}>
              <TextField
                fullWidth
                label="Amount to Pay"
                type="number"
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
                required
                sx={{ mt: 2, mb: 2 }}
                InputProps={{
                  inputProps: {
                    max:
                      (selectedPayment?.amount_due || 0) -
                      (selectedPayment?.amount_paid || 0),
                    step: "0.01",
                  },
                }}
              />
              <Button type="submit" fullWidth variant="contained">
                Confirm Payment
              </Button>
            </form>
          </Box>
        </Modal>
      </Container>
    </Box>
  );
}

export default Wallet;
