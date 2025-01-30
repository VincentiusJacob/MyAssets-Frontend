import "./wallet.css";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from "@mui/material";

interface Payment {
  payment_name: string;
  amount_due: number;
  status: string;
  amount_paid: number;
}

function Wallet() {
  const [incomeData, setIncomeData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [savingsData, setSavingsData] = useState([]);
  const [investmentData, setInvestmentData] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [paymentData, setPaymentData] = useState<Payment[]>([]);

  useEffect(() => {
    const fetchData = async () => {
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
          console.log(paymentResult.data);
          setPaymentData(paymentResult.data);
        }
      } catch (err: any) {
        console.log("err : ", err.message);
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

    console.log("Total Expense:", totalExpense);
  }, [incomeData, expenseData, savingsData, investmentData]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="wallet">
      <div className="payments">
        <h1> Outstanding Payments</h1>
        <TableContainer component={Paper}>
          <Table sx={{ backgroundColor: "#F8D7DA " }}>
            <TableBody>
              {paymentData.map((payment) => {
                const progress =
                  (payment.amount_paid / payment.amount_due) * 100;

                return (
                  <TableRow key={payment.payment_name}>
                    <TableCell>
                      <p>{payment.payment_name} </p>
                    </TableCell>
                    <TableCell>
                      {" "}
                      <p className="status"> {payment.status}</p>
                    </TableCell>
                    <TableCell className="payment-progress">
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <Box sx={{ width: "70%" }}>
                          <LinearProgress
                            variant="determinate"
                            sx={{
                              height: 10,
                              backgroundColor: "black",
                              "& .MuiLinearProgress-bar": {
                                backgroundColor: "#4caf50",
                              },
                            }}
                            value={progress}
                          />
                        </Box>
                        <Box sx={{ marginLeft: 2, flexShrink: 0 }}>
                          <p>
                            {formatAmount(payment.amount_paid)} /{" "}
                            {formatAmount(payment.amount_due)}
                          </p>
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div className="bottomPage">
        <div className="income">
          <div className="income-header">
            <h2> Income </h2>
            <h1> {formatAmount(totalIncome)}</h1>
          </div>
          <div className="income-content">
            {incomeData.map((income: any) => (
              <div className="income-content-detail" key={income.id}>
                <div className="income-title-amount">
                  <p id="title-income">{income.title}</p>
                  <p>{formatAmount(income.amount)}</p>
                </div>
                <div className="income-date">
                  <p>{formatDate(income.date)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="expenses">
          <div className="expense-header">
            <h2> Expense </h2>
            <h1> {formatAmount(totalExpense)}</h1>
          </div>
          <div className="expense-content">
            {expenseData.map((expense: any) => (
              <div className="expense-content-detail" key={expense.id}>
                <div className="expense-title-amount">
                  <p id="title">{expense.title}</p>
                  <p>{formatAmount(expense.amount)}</p>
                </div>
                <div className="expense-date">
                  <p>{formatDate(expense.date)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="savings">
          <div className="savings-header">
            <h2> Savings </h2>
            <h1> {formatAmount(totalSavings)}</h1>
          </div>
          <div className="savings-content">
            {savingsData.map((savings: any) => (
              <div className="savings-content-detail" key={savings.id}>
                <div className="savings-title-amount">
                  <p id="title">{savings.title}</p>
                  <p>{formatAmount(savings.amount)}</p>
                </div>
                <div className="savings-date">
                  <p>{formatDate(savings.date)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="investment">
          <div className="invest-header">
            <h2> Investment </h2>
            <h1> {formatAmount(totalInvestment)}</h1>
          </div>
          <div className="invest-content">
            {investmentData.map((invest: any) => (
              <div className="invest-content-detail" key={invest.id}>
                <div className="invest-title-amount">
                  <p id="title">{invest.title}</p>
                  <p>{formatAmount(invest.amount)}</p>
                </div>
                <div className="invest-date">
                  <p>{formatDate(invest.date)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Wallet;
