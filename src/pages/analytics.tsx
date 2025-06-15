"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  PieChart,
  BarChart3,
  Target,
  Eye,
  EyeOff,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Container,
  Grid,
  IconButton,
  useMediaQuery,
  useTheme,
  Tooltip,
  Chip,
} from "@mui/material";
import ApexCharts from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import axios from "axios";

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

interface GrowthIncomeData {
  month: string;
  totalIncome: number;
}

function Analytics() {
  const [expenseSeries, setExpenseSeries] = useState<number[]>([]);
  const [expenseLabels, setExpenseLabels] = useState<string[]>([]);
  const [netWorthSeries, setNetWorthSeries] = useState<
    { name: string; data: number[] }[]
  >([]);
  const [incomeTrendsSeries, setIncomeTrendsSeries] = useState<
    { name: string; data: number[] }[]
  >([]);
  const [incomeCategories, setIncomeCategories] = useState<string[]>([]);
  const [investmentSeries, setInvestmentSeries] = useState<number[]>([]);
  const [investmentLabels, setInvestmentLabels] = useState<string[]>([]);
  const [growthSeries, setGrowthSeries] = useState<GrowthIncomeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showValues, setShowValues] = useState(true);
  const [selectedChart, setSelectedChart] = useState<string | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      let username;
      const getUser = localStorage.getItem("data");
      if (getUser) {
        const user = JSON.parse(getUser);
        username = user.username;
        try {
          const responseNetWorth = await axios.get(
            `https://myassets-backend.vercel.app/api/netWorth/${username}`
          );
          const netWorthData: NetWorthData[] = responseNetWorth.data;

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

          const netWorthMap = new Map<string, number>();
          netWorthData.forEach(({ month, netWorth }) => {
            const date = new Date(month);
            const monthStr = months[date.getMonth()];
            const netWorthNum = Number.parseFloat(netWorth);
            netWorthMap.set(monthStr, netWorthNum);
          });

          const netWorthSeriesData = months.map(
            (month) => netWorthMap.get(month) || 0
          );
          setNetWorthSeries([{ name: "Net Worth", data: netWorthSeriesData }]);

          const responseIncome = await axios.get(
            `https://myassets-backend.vercel.app/api/incomeTrends/${username}`
          );
          const incomeData: IncomeTrendData[] = responseIncome.data;

          const formattedData = months.map((month) => {
            const monthData = incomeData.find(
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
            };
          });

          setIncomeCategories(formattedData.map((item) => item.month));

          setIncomeTrendsSeries([
            { name: "Income", data: formattedData.map((item) => item.income) },
            {
              name: "Savings",
              data: formattedData.map((item) => item.savings),
            },
            {
              name: "Investment",
              data: formattedData.map((item) => item.investment),
            },
          ]);

          const response = await axios.get(
            `https://myassets-backend.vercel.app/api/expenseData/${username}`
          );
          const transactions = response.data;

          if (Array.isArray(transactions)) {
            const expenseData: { [key: string]: number } = {};
            transactions.forEach((transaction) => {
              expenseData[transaction.type] =
                (expenseData[transaction.type] || 0) + 1;
            });

            setExpenseLabels(Object.keys(expenseData));
            setExpenseSeries(Object.values(expenseData));
          }

          const responseInvestment = await axios.get(
            `https://myassets-backend.vercel.app/api/investmentData/${username}`
          );
          const investmentData: InvestmentData[] = responseInvestment.data;

          if (Array.isArray(investmentData)) {
            const investmentTypes = investmentData.map((data) => data.type);
            const investmentCounts = investmentData.map((data) => data.count);

            setInvestmentLabels(investmentTypes);
            setInvestmentSeries(investmentCounts);
          } else {
            console.error("Error: Data is not an array", response.data);
          }

          const responseGrowth = await axios.get(
            `https://myassets-backend.vercel.app/api/growthIncome/${username}`
          );
          const growthData = responseGrowth.data;

          const growthSeries = growthData.map((item: any) => ({
            month: item.month,
            totalIncome: Number.parseFloat(item.totalIncome),
          }));

          setGrowthSeries(growthSeries);
        } catch (error) {
          console.error("Error fetching data", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, []);

  const refreshData = async () => {
    setIsLoading(true);
    // Re-fetch all data with the same logic
    const getUser = localStorage.getItem("data");
    if (getUser) {
      const user = JSON.parse(getUser);
      const username = user.username;
      try {
        // Same API calls as in useEffect
        const responseNetWorth = await axios.get(
          `https://myassets-backend.vercel.app/api/netWorth/${username}`
        );
        const netWorthData: NetWorthData[] = responseNetWorth.data;

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

        const netWorthMap = new Map<string, number>();
        netWorthData.forEach(({ month, netWorth }) => {
          const date = new Date(month);
          const monthStr = months[date.getMonth()];
          const netWorthNum = Number.parseFloat(netWorth);
          netWorthMap.set(monthStr, netWorthNum);
        });

        const netWorthSeriesData = months.map(
          (month) => netWorthMap.get(month) || 0
        );
        setNetWorthSeries([{ name: "Net Worth", data: netWorthSeriesData }]);

        const responseIncome = await axios.get(
          `https://myassets-backend.vercel.app/api/incomeTrends/${username}`
        );
        const incomeData: IncomeTrendData[] = responseIncome.data;

        const formattedData = months.map((month) => {
          const monthData = incomeData.find(
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
          };
        });

        setIncomeCategories(formattedData.map((item) => item.month));

        setIncomeTrendsSeries([
          { name: "Income", data: formattedData.map((item) => item.income) },
          {
            name: "Savings",
            data: formattedData.map((item) => item.savings),
          },
          {
            name: "Investment",
            data: formattedData.map((item) => item.investment),
          },
        ]);

        const response = await axios.get(
          `https://myassets-backend.vercel.app/api/expenseData/${username}`
        );
        const transactions = response.data;

        if (Array.isArray(transactions)) {
          const expenseData: { [key: string]: number } = {};
          transactions.forEach((transaction) => {
            expenseData[transaction.type] =
              (expenseData[transaction.type] || 0) + 1;
          });

          setExpenseLabels(Object.keys(expenseData));
          setExpenseSeries(Object.values(expenseData));
        }

        const responseInvestment = await axios.get(
          `https://myassets-backend.vercel.app/api/investmentData/${username}`
        );
        const investmentData: InvestmentData[] = responseInvestment.data;

        if (Array.isArray(investmentData)) {
          const investmentTypes = investmentData.map((data) => data.type);
          const investmentCounts = investmentData.map((data) => data.count);

          setInvestmentLabels(investmentTypes);
          setInvestmentSeries(investmentCounts);
        }

        const responseGrowth = await axios.get(
          `https://myassets-backend.vercel.app/api/growthIncome/${username}`
        );
        const growthData = responseGrowth.data;

        const growthSeries = growthData.map((item: any) => ({
          month: item.month,
          totalIncome: Number.parseFloat(item.totalIncome),
        }));

        setGrowthSeries(growthSeries);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const colorTheme = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

  const getChartOptions = (type: string): ApexOptions => {
    const baseOptions: ApexOptions = {
      chart: {
        background: "transparent",
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: false,
            zoom: false,
            zoomin: false,
            zoomout: false,
            pan: false,
            reset: false,
          },
        },
      },
      theme: {
        mode: "dark",
      },
      colors: colorTheme,
      grid: {
        show: true,
        borderColor: "rgba(255, 255, 255, 0.1)",
        strokeDashArray: 3,
      },
      tooltip: {
        theme: "dark",
        style: {
          fontSize: "14px",
          fontFamily: "inherit",
        },
        fillSeriesColor: false,
        custom: ({ series, seriesIndex, dataPointIndex, w }) => {
          const value = series[seriesIndex][dataPointIndex];
          const label = w.globals.labels[dataPointIndex] || "";
          return `
            <div style="
              background: rgba(255, 255, 255, 0.95); 
              backdrop-filter: blur(10px);
              border: 1px solid rgba(255, 255, 255, 0.3);
              border-radius: 12px;
              padding: 12px;
              box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
            ">
              <div style="color: #1e293b; font-weight: 600; margin-bottom: 4px;">${label}</div>
              <div style="color: #64748b; font-size: 14px;">Value: ${
                showValues ? value : "••••••"
              }</div>
            </div>
          `;
        },
      },
    };

    if (type === "pie") {
      return {
        ...baseOptions,
        chart: {
          ...baseOptions.chart,
          type: "pie",
        },
        dataLabels: {
          enabled: true,
          style: {
            fontSize: "14px",
            fontFamily: "inherit",
            fontWeight: "600",
            colors: ["#ffffff"],
          },
          dropShadow: {
            enabled: true,
            top: 1,
            left: 1,
            blur: 1,
            color: "#000",
            opacity: 0.45,
          },
        },
        legend: {
          position: "bottom",
          fontSize: "12px",
          fontFamily: "inherit",
          labels: {
            colors: "#ffffff",
            useSeriesColors: false,
          },
        },
        plotOptions: {
          pie: {
            donut: {
              size: "45%",
            },
            expandOnClick: true,
          },
        },
        responsive: [
          {
            breakpoint: 768,
            options: {
              chart: {
                width: "100%",
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
      };
    }

    return {
      ...baseOptions,
      chart: {
        ...baseOptions.chart,
        type: "line",
      },
      xaxis: {
        labels: {
          style: {
            colors: "#ffffff",
            fontSize: "12px",
            fontFamily: "inherit",
          },
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: "#ffffff",
            fontSize: "12px",
            fontFamily: "inherit",
          },
          formatter: (value: number) =>
            showValues ? `$${value.toLocaleString()}` : "••••••",
        },
      },
      legend: {
        labels: {
          colors: "#ffffff",
        },
        position: "top",
        fontSize: "12px",
        fontFamily: "inherit",
      },
      stroke: {
        curve: "smooth",
        width: 3,
      },
      markers: {
        size: 6,
        strokeWidth: 2,
        strokeColors: "#ffffff",
        hover: {
          size: 8,
        },
      },
    };
  };

  const ChartCard = ({
    title,
    icon,
    children,
    chartType,
    gradient,
    stats,
  }: {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    chartType: string;
    gradient: string;
    stats?: { label: string; value: string; trend: "up" | "down" };
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
          setSelectedChart(selectedChart === chartType ? null : chartType)
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
            background: gradient,
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
                  background: gradient,
                  color: "white",
                  boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
                }}
              >
                {icon}
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "#1e293b", mb: 0.5 }}
                >
                  {title}
                </Typography>
                {stats && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="caption" sx={{ color: "#64748b" }}>
                      {stats.label}:
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 600,
                        color: stats.trend === "up" ? "#10b981" : "#ef4444",
                      }}
                    >
                      {showValues ? stats.value : "••••••"}
                    </Typography>
                    {stats.trend === "up" ? (
                      <ArrowUpRight size={12} style={{ color: "#10b981" }} />
                    ) : (
                      <ArrowDownRight size={12} style={{ color: "#ef4444" }} />
                    )}
                  </Box>
                )}
              </Box>
            </Box>
            <Chip
              label="Live"
              size="small"
              sx={{
                background: "rgba(16, 185, 129, 0.1)",
                color: "#10b981",
                fontWeight: 600,
                animation: "pulse 2s infinite",
              }}
            />
          </Box>
        </CardHeader>

        <CardContent sx={{ pt: 0, height: isMobile ? "300px" : "400px" }}>
          <Box
            sx={{
              height: "100%",
              "& .apexcharts-canvas": {
                background: "transparent !important",
              },
              "& .apexcharts-gridline": {
                stroke: "rgba(255, 255, 255, 0.1)",
              },
              "& .apexcharts-text": {
                fill: "#ffffff !important",
              },
            }}
          >
            {children}
          </Box>
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
                Financial Analytics
              </Typography>
              <Typography variant="h6" sx={{ color: "#64748b" }}>
                Comprehensive insights into your financial performance
              </Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Tooltip title="Toggle value visibility">
                <IconButton
                  onClick={() => setShowValues(!showValues)}
                  sx={{
                    background: "rgba(255, 255, 255, 0.7)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    "&:hover": {
                      background: "rgba(255, 255, 255, 0.9)",
                    },
                  }}
                >
                  {showValues ? (
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

        {/* Charts Grid */}
        <Grid container spacing={3}>
          {/* Top Row - Main Charts */}
          <Grid item xs={12} lg={8}>
            <ChartCard
              title="Net Worth Progression"
              icon={<TrendingUp className="w-6 h-6" />}
              chartType="networth"
              gradient="linear-gradient(135deg, #10b981, #059669)"
              stats={{
                label: "Current",
                value: `$${
                  netWorthSeries[0]?.data.slice(-1)[0]?.toLocaleString() || "0"
                }`,
                trend: "up",
              }}
            >
              <ApexCharts
                options={{
                  ...getChartOptions("line"),
                  xaxis: {
                    ...getChartOptions("line").xaxis,
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
                }}
                series={netWorthSeries}
                type="line"
                height={isMobile ? 280 : 380}
              />
            </ChartCard>
          </Grid>

          <Grid item xs={12} lg={4}>
            <ChartCard
              title="Income Trends"
              icon={<Activity className="w-6 h-6" />}
              chartType="incometrends"
              gradient="linear-gradient(135deg, #3b82f6, #2563eb)"
              stats={{
                label: "This Month",
                value: `$${
                  incomeTrendsSeries[0]?.data.slice(-1)[0]?.toLocaleString() ||
                  "0"
                }`,
                trend: "up",
              }}
            >
              <ApexCharts
                options={{
                  ...getChartOptions("line"),
                  xaxis: {
                    ...getChartOptions("line").xaxis,
                    categories: incomeCategories,
                  },
                }}
                series={incomeTrendsSeries}
                type="line"
                height={isMobile ? 280 : 380}
              />
            </ChartCard>
          </Grid>

          {/* Bottom Row - Pie Charts and Growth */}
          <Grid item xs={12} md={4}>
            <ChartCard
              title="Investment Allocation"
              icon={<Target className="w-6 h-6" />}
              chartType="investment"
              gradient="linear-gradient(135deg, #f59e0b, #d97706)"
              stats={{
                label: "Total Types",
                value: investmentLabels.length.toString(),
                trend: "up",
              }}
            >
              <ApexCharts
                options={{
                  ...getChartOptions("pie"),
                  labels: investmentLabels,
                }}
                series={investmentSeries}
                type="donut"
                height={isMobile ? 280 : 350}
              />
            </ChartCard>
          </Grid>

          <Grid item xs={12} md={4}>
            <ChartCard
              title="Income Growth Rate"
              icon={<BarChart3 className="w-6 h-6" />}
              chartType="growth"
              gradient="linear-gradient(135deg, #8b5cf6, #7c3aed)"
              stats={{
                label: "Growth",
                value: "+12.5%",
                trend: "up",
              }}
            >
              <ApexCharts
                options={{
                  ...getChartOptions("line"),
                  xaxis: {
                    ...getChartOptions("line").xaxis,
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
                }}
                series={[
                  {
                    name: "Income Growth",
                    data: growthSeries.map((item) => item.totalIncome),
                  },
                ]}
                type="line"
                height={isMobile ? 280 : 350}
              />
            </ChartCard>
          </Grid>

          <Grid item xs={12} md={4}>
            <ChartCard
              title="Expense Breakdown"
              icon={<PieChart className="w-6 h-6" />}
              chartType="expenses"
              gradient="linear-gradient(135deg, #ef4444, #dc2626)"
              stats={{
                label: "Categories",
                value: expenseLabels.length.toString(),
                trend: "down",
              }}
            >
              <ApexCharts
                options={{
                  ...getChartOptions("pie"),
                  labels: expenseLabels,
                }}
                series={expenseSeries}
                type="donut"
                height={isMobile ? 280 : 350}
              />
            </ChartCard>
          </Grid>
        </Grid>

        {/* Summary Stats */}
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
              borderRadius: "20px",
              boxShadow: "0 25px 50px rgba(0, 0, 0, 0.1)",
              overflow: "hidden",
              mt: 4,
            }}
          >
            <CardHeader>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "#1e293b" }}
              >
                Quick Insights
              </Typography>
            </CardHeader>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 700, color: "#10b981", mb: 1 }}
                    >
                      {showValues
                        ? `$${
                            netWorthSeries[0]?.data
                              .reduce((a, b) => a + b, 0)
                              .toLocaleString() || "0"
                          }`
                        : "••••••"}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#64748b" }}>
                      Total Net Worth
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 700, color: "#3b82f6", mb: 1 }}
                    >
                      {investmentLabels.length}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#64748b" }}>
                      Investment Types
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 700, color: "#f59e0b", mb: 1 }}
                    >
                      {expenseLabels.length}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#64748b" }}>
                      Expense Categories
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 700, color: "#8b5cf6", mb: 1 }}
                    >
                      +12.5%
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#64748b" }}>
                      Growth Rate
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
}

export default Analytics;
