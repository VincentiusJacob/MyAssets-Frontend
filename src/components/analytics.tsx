import { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import axios from "axios";
import "./analytics.css";

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

  useEffect(() => {
    const fetchData = async () => {
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
            const netWorthNum = parseFloat(netWorth);
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
            totalIncome: parseFloat(item.totalIncome),
          }));

          console.log(growthData);

          setGrowthSeries(growthSeries);
        } catch (error) {
          console.error("Error fetching data", error);
        }
      }
    };

    fetchData();
  }, []);

  const colorTheme = ["#1FCB4F", "#FFD700", "#FF4560", "#775DD0", "#00E396"];

  const pieChartOptions: ApexOptions = {
    chart: { type: "pie", width: 600, height: 600 },
    labels: expenseLabels,
    colors: colorTheme,
    dataLabels: {
      enabled: true,
      offsetX: 0,
      offsetY: 5,
      style: {
        fontSize: "16px",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: "bold",
        colors: ["white"],
      },
    },
    legend: {
      position: "bottom",
      fontSize: "14px",
      labels: {
        colors: ["white", "white", "white", "white", "white", "white", "white"],
        useSeriesColors: false,
      },
    },
    tooltip: {
      style: {
        fontSize: "14px",
        fontFamily: "Helvetica, Arial, sans-serif",
      },
      y: {
        formatter: function (value: number) {
          return `<span style="color: black;">${value}</span>`;
        },
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 320,
          },
          legend: {
            position: "right",
          },
        },
      },
    ],
  };

  const pieChartInvest: ApexOptions = {
    chart: { type: "pie", width: 600, height: 600 },
    labels: investmentLabels,
    colors: colorTheme,
    dataLabels: {
      enabled: true,
      offsetX: 0,
      offsetY: 5,

      style: {
        fontSize: "16px",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: "bold",
        colors: ["white"],
      },
    },
    legend: {
      position: "bottom",
      fontSize: "14px",
      labels: {
        colors: ["white", "white", "white", "white", "white"],
        useSeriesColors: false,
      },
    },
    tooltip: {
      style: {
        fontSize: "14px",
        fontFamily: "Helvetica, Arial, sans-serif",
      },
      y: {
        formatter: function (value: number) {
          return `<span style="color: black;">${value}</span>`;
        },
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 320,
          },
          legend: {
            position: "right",
          },
        },
      },
    ],
  };

  const netWorthOptions: ApexOptions = {
    chart: {
      type: "line",
    },
    grid: {
      show: false,
    },
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
      labels: {
        style: {
          colors: [
            "white",
            "white",
            "white",
            "white",
            "white",
            "white",
            "white",
            "white",
            "white",
            "white",
            "white",
            "white",
          ],
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: ["white"],
        },
      },
    },
    tooltip: {
      custom: function ({ series, seriesIndex, dataPointIndex }) {
        const value = series[seriesIndex][dataPointIndex];
        return `<div style="background-color: white; padding: 10px; border: 1px solid #ccc;">
                  <span style="color: black;">Net Worth: ${value}</span>
                </div>`;
      },
    },
    colors: colorTheme,
  };

  const incomeTrendsOptions: ApexOptions = {
    chart: { type: "line" },
    grid: {
      show: false,
    },
    xaxis: {
      categories: incomeCategories,
      labels: {
        style: {
          colors: [
            "white",
            "white",
            "white",
            "white",
            "white",
            "white",
            "white",
            "white",
            "white",
            "white",
            "white",
            "white",
          ],
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: ["white"],
        },
      },
    },
    tooltip: {
      custom: function ({ series, seriesIndex, dataPointIndex }) {
        const value = series[seriesIndex][dataPointIndex];

        return `<div style="background-color: white; padding: 10px; border: 1px solid #ccc;">
                  <span style="color: black;"> ${value}</span>
                </div>`;
      },
    },
    colors: colorTheme,
    legend: {
      labels: {
        colors: ["white", "white", "white"],
      },
      position: "bottom",
      fontSize: "12px",
    },
  };

  const growthOptions: ApexOptions = {
    chart: { type: "line" },
    grid: {
      show: false,
    },
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
      labels: {
        style: {
          colors: [
            "white",
            "white",
            "white",
            "white",
            "white",
            "white",
            "white",
            "white",
            "white",
            "white",
            "white",
            "white",
          ],
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: ["white"],
        },
      },
    },
    tooltip: {
      custom: function ({ series, seriesIndex, dataPointIndex }) {
        const value = series[seriesIndex][dataPointIndex];
        return `<div style="background-color: white; padding: 10px; border: 1px solid #ccc;">
                  <span style="color: black;"> ${value}</span>
                </div>`;
      },
    },
    colors: colorTheme,
  };

  return (
    <div className="analyticsContainer">
      <div className="top">
        <div className="networth element">
          <h1>Net Worth</h1>
          <ApexCharts
            options={netWorthOptions}
            series={netWorthSeries}
            type="line"
            height={350}
          />
        </div>
        <div className="incometrends element">
          <h1>Income, Savings, Investment</h1>
          <ApexCharts
            options={incomeTrendsOptions}
            series={incomeTrendsSeries}
            type="line"
            height={350}
          />
        </div>
      </div>
      <div className="bottom">
        <div className="cashflow element">
          <h1>Investment Allocation</h1>
          <ApexCharts
            options={pieChartInvest}
            series={investmentSeries}
            type="pie"
            height={350}
          />
        </div>
        <div className="growth element">
          <h1>Net Income Growth Rate</h1>
          <ApexCharts
            options={growthOptions}
            series={[
              {
                name: "Income Growth",
                data: growthSeries.map((item) => item.totalIncome),
              },
            ]}
            type="line"
            height={350}
          />
        </div>
        <div className="expense element">
          <h1>Expenses</h1>
          <ApexCharts
            options={pieChartOptions}
            series={expenseSeries}
            type="pie"
            height={350}
          />
        </div>
      </div>
    </div>
  );
}

export default Analytics;
