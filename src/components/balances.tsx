import "./balances.css";
import axios from "axios";
import React, { useState, useEffect } from "react";

type BalancesProps = {
  name: string;
  icon: React.ReactElement;
};

function Balances(props: BalancesProps) {
  const [balance, setBalance] = useState<number>(0);
  const [invest, setInvest] = useState<number>(0);
  const [expense, setExpense] = useState<number>(0);
  const [savings, setSavings] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      let username;
      const getUser = localStorage.getItem("data");
      if (getUser) {
        const user = JSON.parse(getUser);
        username = user.username;
        // fetch balance
        const balanceResult = await axios.get(
          `https://myassets-backend.vercel.app/api/balance/${username}`
        );
        console.log("balance: ", balanceResult.data);
        setBalance(balanceResult.data.totalBalance);

        // fetch invest
        const investResult = await axios.get(
          `https://myassets-backend.vercel.app/api/invest/${username}`
        );
        setInvest(investResult.data);

        // fetch expense
        const expenseResult = await axios.get(
          `https://myassets-backend.vercel.app/api/expense/${username}`
        );
        setExpense(expenseResult.data);

        //fetch savings
        const savingsResult = await axios.get(
          `https://myassets-backend.vercel.app/api/savings/${username}`
        );
        setSavings(savingsResult.data);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="money-container">
      <div className="icon">
        <div className="icon-container">{props.icon}</div>
      </div>
      <div className="content">
        <span>{props.name}</span>
        <h2>
          {props.name === "Balance" ? `$${balance}` : ""}
          {props.name === "Investment" ? `$${invest}` : ""}
          {props.name === "Expenses" ? `$${expense}` : ""}
          {props.name === "Savings" ? `$${savings}` : ""}
        </h2>
      </div>
    </div>
  );
}

export default Balances;
