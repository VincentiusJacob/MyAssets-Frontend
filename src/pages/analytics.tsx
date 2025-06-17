"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Container,
  Grid,
  IconButton,
  useTheme,
  Tooltip,
} from "@mui/material";
import ApexCharts from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import axios from "axios";

// Interfaces for data types
interface NetWorthData {
  month: string;
  netWorth: string;
}
interface IncomeTrendData {
  month: string;
  income: number;
  savings: number;
  investment: number;
}
interface InvestmentData {
  type: string;
  count: number;
}
interface ExpenseData {
  type: string;
  amount: number;
}

const ChartCard = ({
  title,
  subheader,
  children,
}: {
  title: string;
  subheader: string;
  children: React.ReactNode;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    style={{ height: "100%" }}
  >
    <Card
      sx={{
        background: "rgba(255, 255, 255, 0.8)",
        borderRadius: "16px",
        p: 2,
        height: "100%",
      }}
    >
      <CardHeader
        title={
          <Typography variant="h5" fontWeight={600}>
            {title}
          </Typography>
        }
        subheader={
          <Typography variant="body2" color="text.secondary">
            {subheader}
          </Typography>
        }
      />
      <CardContent>
        <Box sx={{ height: 350 }}>{children}</Box>
      </CardContent>
    </Card>
  </motion.div>
);

function Analytics() {
  const [expenseSeries, setExpenseSeries] = useState<number[]>([]);
  const [expenseLabels, setExpenseLabels] = useState<string[]>([]);
  const [netWorthSeries, setNetWorthSeries] = useState<
    { name: string; data: number[] }[]
  >([]);
  const [incomeTrendsSeries, setIncomeTrendsSeries] = useState<
    { name: string; data: number[] }[]
  >([]);
  const [investmentSeries, setInvestmentSeries] = useState<number[]>([]);
  const [investmentLabels, setInvestmentLabels] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const theme = useTheme();

  const fetchData = async () => {
    setIsLoading(true);
    const getUser = localStorage.getItem("data");
    if (!getUser) {
      setIsLoading(false);
      return;
    }
    const username = JSON.parse(getUser).username;
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

    try {
      const [netWorthRes, incomeTrendsRes, expenseRes, investmentRes] =
        await Promise.all([
          axios.get(
            `https://myassets-backend.vercel.app/api/netWorth/${username}`
          ),
          axios.get(
            `https://myassets-backend.vercel.app/api/incomeTrends/${username}`
          ),
          axios.get(
            `https://myassets-backend.vercel.app/api/expenseData/${username}`
          ),
          axios.get(
            `https://myassets-backend.vercel.app/api/investmentData/${username}`
          ),
        ]);

      // Process Net Worth
      const netWorthData: NetWorthData[] = netWorthRes.data;
      const netWorthMap = new Map<string, number>();
      netWorthData.forEach(({ month, netWorth }) => {
        netWorthMap.set(
          months[new Date(month).getMonth()],
          parseFloat(netWorth)
        );
      });
      setNetWorthSeries([
        { name: "Net Worth", data: months.map((m) => netWorthMap.get(m) || 0) },
      ]);

      // Process Income Trends
      const incomeData: IncomeTrendData[] = incomeTrendsRes.data;
      const formattedIncome = months.map((month) => {
        const monthData = incomeData.find(
          (item) =>
            new Date(item.month).toLocaleString("default", {
              month: "short",
            }) === month
        );
        return {
          income: monthData?.income || 0,
          savings: monthData?.savings || 0,
          investment: monthData?.investment || 0,
        };
      });
      setIncomeTrendsSeries([
        { name: "Income", data: formattedIncome.map((item) => item.income) },
        { name: "Savings", data: formattedIncome.map((item) => item.savings) },
        {
          name: "Investment",
          data: formattedIncome.map((item) => item.investment),
        },
      ]);

      // Process Expense Breakdown
      const expenseData: ExpenseData[] = expenseRes.data;
      const expenseMap = new Map<string, number>();
      expenseData.forEach((e) => {
        expenseMap.set(e.type, (expenseMap.get(e.type) || 0) + e.amount);
      });
      setExpenseLabels(Array.from(expenseMap.keys()));
      setExpenseSeries(Array.from(expenseMap.values()));

      // Process Investment Allocation
      const investmentData: InvestmentData[] = investmentRes.data;
      setInvestmentLabels(investmentData.map((d) => d.type));
      setInvestmentSeries(investmentData.map((d) => d.count));
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const chartOptions: ApexOptions = {
    chart: { toolbar: { show: false }, background: "transparent" },
    theme: { mode: theme.palette.mode },
    stroke: { curve: "smooth", width: 3 },
    grid: { borderColor: theme.palette.divider },
    xaxis: {
      categories: [
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
    },
    dataLabels: { enabled: false },
    legend: { position: "top" },
  };

  const pieOptions: ApexOptions = {
    ...chartOptions,
    stroke: { width: 0 },
    labels: expenseLabels,
  };
  const investmentPieOptions: ApexOptions = {
    ...chartOptions,
    stroke: { width: 0 },
    labels: investmentLabels,
  };

  if (isLoading) return <Box>Loading Analytics...</Box>;

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
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography variant="h3">Financial Analytics</Typography>
          <Tooltip title="Refresh Data">
            <IconButton onClick={fetchData}>
              <RefreshCw />
            </IconButton>
          </Tooltip>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <ChartCard
              title="Net Worth Progression"
              subheader="Your total asset growth over the year."
            >
              <ApexCharts
                options={chartOptions}
                series={netWorthSeries}
                type="area"
                height="100%"
              />
            </ChartCard>
          </Grid>
          <Grid item xs={12} lg={4}>
            <ChartCard
              title="Expense Breakdown by Type"
              subheader="Spending distribution across categories."
            >
              <ApexCharts
                options={pieOptions}
                series={expenseSeries}
                type="donut"
                height="100%"
              />
            </ChartCard>
          </Grid>
          <Grid item xs={12} lg={4}>
            <ChartCard
              title="Investment Allocation"
              subheader="Distribution of your investment portfolio."
            >
              <ApexCharts
                options={investmentPieOptions}
                series={investmentSeries}
                type="pie"
                height="100%"
              />
            </ChartCard>
          </Grid>
          <Grid item xs={12} lg={8}>
            <ChartCard
              title="Income & Savings Trends"
              subheader="Comparison of monthly income, savings, and investments."
            >
              <ApexCharts
                options={chartOptions}
                series={incomeTrendsSeries}
                type="line"
                height="100%"
              />
            </ChartCard>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Analytics;
