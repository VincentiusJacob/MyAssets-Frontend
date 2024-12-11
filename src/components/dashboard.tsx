import React, { useEffect, useState } from "react";
import Cards from "./balances";
import "./dashboard.css";
import PaymentsIcon from "@mui/icons-material/Payments";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SavingsIcon from "@mui/icons-material/Savings";
import PaidIcon from "@mui/icons-material/Paid";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, LinearProgress } from "@mui/material";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface EarningData {
  month: string;
  totalIncome: number;
}

interface SpendingData {
  month: string;
  totalSpending: number;
}

interface IncomeTrendData {
  month: string;
  income: number;
  savings: number;
  investment: number;
  expense: number;
}

const SpendingIncomeChart: React.FC<{
  spendingData: number[];
  incomeData: number[];
}> = ({ spendingData, incomeData }) => {
  const data = {
    labels: [
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
    ],
    datasets: [
      {
        label: "Spending",
        data: spendingData,
        borderColor: "#FF4C4C",
        backgroundColor: "rgba(255, 76, 76, 0.2)",
      },
      {
        label: "Income",
        data: incomeData,
        borderColor: "#1FCB4F",
        backgroundColor: "rgba(31, 203, 79, 0.2)",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        labels: {
          color: "white",
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "white",
        },
      },
      y: {
        ticks: {
          color: "white",
        },
      },
    },
  };

  return (
    <div
      style={{
        width: "100%",
        height: "300px",
        backgroundColor: "#282c35",
        padding: "4px",
      }}
    >
      <Line data={data} options={options} />
    </div>
  );
};

const OverviewChart: React.FC<{ series: any[]; categories: string[] }> = ({
  series,
  categories,
}) => {
  const data = {
    labels: categories,
    datasets: series.map((item, index) => ({
      label: item.name,
      data: item.data,
      borderColor:
        index === 0
          ? "green"
          : index === 1
          ? "blue"
          : index === 2
          ? "#ffc107"
          : "red",
      backgroundColor:
        index === 0
          ? "green"
          : index === 1
          ? "blue"
          : index === 2
          ? "#ffc107"
          : "red",
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "white",
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "white",
        },
      },
      y: {
        ticks: {
          color: "white",
        },
      },
    },
  };

  return (
    <div
      style={{
        width: "100%",
        height: "300px",
        backgroundColor: "#282c35",
        padding: "4px",
      }}
    >
      <Line data={data} options={options} />
    </div>
  );
};

function Dashboard() {
  const [paymentData, setPaymentData] = useState([]);
  const [transactionData, setTransactionData] = useState([]);
  const [earning, setEarning] = useState<EarningData[]>([]);
  const [spending, setSpending] = useState<SpendingData[]>([]);
  const [overviewSeries, setOverviewSeries] = useState<
    { name: string; data: number[] }[]
  >([]);
  const [overviewCategories, setOverviewCategories] = useState<string[]>([]);
  const getUser = localStorage.getItem("data");
  const parsedCurrentUsername = getUser ? JSON.parse(getUser) : null;
  const currentUsername = parsedCurrentUsername.username;
  useEffect(() => {
    const fetchData = async () => {
      let username;
      if (getUser) {
        const parseData = JSON.parse(getUser);
        username = parseData.username;
        try {
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

          const earningResult = await axios.get(
            `https://myassets-backend.vercel.app/api/growthIncome/${username}`
          );
          const earningData = earningResult.data;

          const earningSeries = earningData.map((item: any) => ({
            month: item.month,
            totalIncome: parseFloat(item.totalIncome),
          }));

          setEarning(earningSeries);

          const spendingResult = await axios.get(
            `https://myassets-backend.vercel.app/api/spendingData/${username}`
          );
          const spendingData = spendingResult.data;

          const spendingSeries = spendingData.map((item: any) => ({
            month: item.month,
            totalSpending: parseFloat(item.totalSpending),
          }));

          setSpending(spendingSeries);

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
        }
      }
    };

    fetchData();
  }, []);

  const navigate = useNavigate();
  const clickProfile = () => {
    navigate("/personal");
  };

  const handleLogOut = async () => {
    const getUser = localStorage.getItem("data");
    if (getUser) {
      const user = JSON.parse(getUser);
      const username = user.username;

      try {
        const result = await axios.post(
          `https://myassets-backend.vercel.app/logout`,
          {
            username,
          }
        );

        if (result.status === 200) {
          localStorage.removeItem("data");
          navigate("/");
        }
      } catch (error) {
        console.error("Logout failed", error);
      }
    }
  };

  return (
    <div className="dashboard-container">
      <div className="numbers">
        <Cards
          name="Balance"
          icon={
            <AccountBalanceWalletIcon
              fontSize="large"
              style={{ color: "#1FCB4F" }}
            />
          }
        />
        <Cards
          name="Investment"
          icon={<PaymentsIcon fontSize="large" style={{ color: "#1FCB4F" }} />}
        />
        <Cards
          name="Expenses"
          icon={
            <ShoppingCartIcon fontSize="large" style={{ color: "#1FCB4F" }} />
          }
        />
        <Cards
          name="Savings"
          icon={<SavingsIcon fontSize="large" style={{ color: "#1FCB4F" }} />}
        />
      </div>
      <div className="datas">
        <div className="graphs">
          <div className="charts">
            <h1> Overview </h1>
            <div className="dashboard-overview-chart">
              <OverviewChart
                series={overviewSeries}
                categories={overviewCategories}
              />
            </div>
          </div>
          <div className="diagrams">
            <div className="activity">
              <div className="dashboard-activity-header">
                <h1> Activity </h1>
              </div>
              <div className="dashboard-activity-body">
                <SpendingIncomeChart
                  spendingData={spending.map((item) => item.totalSpending)}
                  incomeData={earning.map((item) => item.totalIncome)}
                />
              </div>
            </div>
            <div className="payment">
              <div className="dashboard-payment-header">
                <h1> Payment </h1>
                <a style={{ color: "#1FCB4F" }} href="/Wallet">
                  {" "}
                  See More{" "}
                </a>
              </div>
              <div className="dashboard-payment-container">
                {paymentData.length > 0 ? (
                  paymentData.map((payment: any) => {
                    const progress =
                      (payment.amount_paid / payment.amount_due) * 100;
                    return (
                      <div
                        className="dashboard-payment-content"
                        key={payment.id}
                      >
                        <div className="dashboard-payment-content-body">
                          <div className="dashboard-payment-content-body-top">
                            <p> {payment.payment_name} </p>
                            <p>
                              {" "}
                              ${payment.amount_paid}/${payment.amount_due}{" "}
                            </p>
                          </div>
                          <div className="dashboard-payment-content-body-bottom">
                            <Box sx={{ width: "100%" }}>
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
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="error-message"> No Payment Available</p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="others">
          <div className="card">
            <div className="card-header">
              <div className="card-header-picture"></div>
              <h1> {currentUsername} </h1>
            </div>
            <div className="card-content">
              <div className="card-content-element" onClick={clickProfile}>
                <div className="card-content-element-icon">
                  <PersonOutlineOutlinedIcon
                    style={{ width: "30px", height: "30px" }}
                  />
                  <p> Account Settings </p>
                </div>

                <ChevronRightIcon />
              </div>
              <div className="card-content-element">
                <div className="card-content-element-icon">
                  <InfoOutlinedIcon style={{ width: "30px", height: "30px" }} />
                  <a href="/"> About Application </a>
                </div>
                <ChevronRightIcon />
              </div>
              <div className="card-content-element" onClick={handleLogOut}>
                <div className="card-content-element-icon">
                  <LogoutIcon style={{ width: "30px", height: "30px" }} />
                  <p> Log out </p>
                </div>

                <ChevronRightIcon />
              </div>
            </div>
          </div>
          <div className="transactions">
            <div className="dashboard-transaction-header">
              <h1> Recent Transaction </h1>
              <a style={{ color: "#1FCB4F" }} href="/Transaction">
                {" "}
                View more{" "}
              </a>
            </div>
            <div className="dashboard-transaction-body">
              {transactionData && transactionData.length > 0 ? (
                transactionData.map((transaction: any) => {
                  return (
                    <div
                      className="dashboard-transaction-content-container"
                      key={transaction.id}
                    >
                      <div className="icon-transaction">
                        <div className="icon-transaction-container">
                          {transaction.category === "Income" ? (
                            <PaidIcon style={{ color: "#1FCB4F" }} />
                          ) : null}{" "}
                          {transaction.category === "Expense" ? (
                            <ShoppingCartIcon style={{ color: "#FF4C4C" }} />
                          ) : null}{" "}
                          {transaction.category === "Savings" ? (
                            <SavingsIcon style={{ color: "blue" }} />
                          ) : null}{" "}
                          {transaction.category === "Investment" ? (
                            <PaymentsIcon style={{ color: "#ffc107" }} />
                          ) : null}
                        </div>
                      </div>
                      <div className="dashboard-transaction-content-body">
                        <p
                          id="category"
                          style={{
                            color:
                              transaction.category === "Expense"
                                ? "#FF4C4C"
                                : transaction.category === "Income"
                                ? "#1FCB4F"
                                : transaction.category === "Savings"
                                ? "blue"
                                : "#ffc107",
                          }}
                        >
                          {transaction.category}
                        </p>
                        <div className="dashboard-transaction-content-body-bottom">
                          <p> {transaction.title} </p>
                          <p
                            style={{
                              color:
                                transaction.category === "Expense"
                                  ? "#FF4C4C"
                                  : transaction.category === "Income"
                                  ? "#1FCB4F"
                                  : transaction.category === "Savings"
                                  ? "blue"
                                  : transaction.category === "Investment"
                                  ? "#ffc107"
                                  : "white",
                            }}
                          >
                            {" "}
                            {transaction.category === "Expense"
                              ? `-$${transaction.amount}`
                              : `+$${transaction.amount}`}{" "}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="error-message"> No Transaction Available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
