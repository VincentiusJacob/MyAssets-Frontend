import Zoom from "@mui/material/Zoom";
import Fab from "@mui/material/Fab";
import Paper from "@mui/material/Paper";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import InputBase from "@mui/material/InputBase";
import ArrowDownwardOutlinedIcon from "@mui/icons-material/ArrowDownwardOutlined";
import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined";
import IconButton from "@mui/material/IconButton";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import ClearIcon from "@mui/icons-material/Clear";
import SortIcon from "@mui/icons-material/Sort";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import * as React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState, useEffect } from "react";
import "./transaction.css";
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
  dates: string;
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
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(1);
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
          console.log(allTransaction.data);
          const formattedTransactions = allTransaction.data.map(
            (transaction: any) => {
              const date = new Date(transaction.dates);

              const formattedDate = date.toISOString().split("T")[0];

              return {
                ...transaction,
                dates: formattedDate,
                amount: parseFloat(transaction.amount),
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
        ? new Date(transaction.dates).toDateString() ===
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
            transaction.amount <= (maxAmount || Infinity)
          : true;

      return isDateMatch && isSearchMatch && isAmountMatch;
    });

    setFilteredData(filtered);
  }, [searchQuery, selectedDate, minAmount, maxAmount, transactionData]);

  const submitTransaction = async () => {
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
              dates: new Date().toISOString().split("T")[0],
            },
          ]);

          setTransaction({
            title: "",
            amount: 0,
            category: "",
            description: "",
            transactionType: "",
          });
          setExpanded(true);
          console.log("Data is saved!");
        }
      } catch (error: any) {
        console.log("Error saving data:", error.message);
      }
    } else {
      console.log("Error: user undefined");
    }
  };

  const submitPayment = async () => {
    if (getUser) {
      const currentUser = JSON.parse(getUser);
      console.log(currentUser);
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
          console.log("Payment Data is saved!");
          setPaymentExpanded(true);
        }
      } catch (error: any) {
        console.log("Error saving data:", error.message);
      }
    }
  };

  const toggleDatePicker = () => {
    setIsDatePickerVisible(!isDatePickerVisible);
  };

  const toggleAmount = () => {
    setIsAmountVisible(isAmountVisible ? false : true);
  };

  const handleFilterToggle = (filterType: "search" | "filter" | "sort") => {
    setExpandTools((prev) => ({
      searchExpanded: filterType === "search" ? !prev.searchExpanded : false,
      filterExpanded: filterType === "filter" ? !prev.filterExpanded : false,
      sortExpanded: filterType === "sort" ? !prev.sortExpanded : false,
    }));
  };

  const handleMenuItemClick = (index: number) => {
    setSelectedIndex(index);
    setOpen(false);
    const selectedCategory = options[index];
    handleChange({
      target: {
        name: "category",
        value: selectedCategory,
      },
    });
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "minAmount") {
      setMinAmount(value ? parseFloat(value) : 0);
    } else if (name === "maxAmount") {
      setMaxAmount(value ? parseFloat(value) : Infinity);
    }
  };

  const sortAscending = () => {
    setFilteredData(
      filteredData.sort(function (a, b) {
        return a.amount - b.amount;
      })
    );
  };

  const sortDescending = () => {
    setFilteredData(
      filteredData.sort(function (a, b) {
        return b.amount - a.amount;
      })
    );
  };

  const searchClick = () => {
    setExpandTools((prev) => {
      return {
        ...prev,
        searchExpanded: expandTools.searchExpanded ? false : true,
      };
    });
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
      [name]: name === "amount" ? parseFloat(value) : value,
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

  const expand = () => {
    setExpanded(isExpanded ? false : true);
  };

  const expandPayment = () => {
    setPaymentExpanded(isExpandedPayment ? false : true);
  };
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="transaction-container">
      <div className="transactionsContainer">
        <div className="transactions-tools">
          <div className="create">
            <Zoom in={true}>
              <Fab
                className="add-btn"
                onClick={expand}
                style={{
                  backgroundColor: "#1FCB4F",
                  borderRadius: 0,
                  width: "300px",
                  height: "60px",
                  color: "#333",
                }}
                aria-label="add"
              >
                <p> Create Transaction </p>
                <AddIcon />
              </Fab>
            </Zoom>
            <Zoom in={true}>
              <Fab
                className="add-btn"
                onClick={expandPayment}
                style={{
                  backgroundColor: "#1FCB4F",
                  borderRadius: 0,
                  width: "300px",
                  height: "60px",
                  color: "#333",
                }}
                aria-label="add"
              >
                <p> Create Payment </p>
                <AddIcon />
              </Fab>
            </Zoom>
          </div>
          <Zoom in={true}>
            <div className="other-tools">
              {expandTools.searchExpanded ? (
                <div className="search-transaction">
                  <Paper
                    component="form"
                    sx={{
                      p: "0px 0px",
                      display: "flex",
                      alignItems: "center",
                      width: 250,
                    }}
                  >
                    <InputBase
                      sx={{ ml: 1, flex: 1 }}
                      placeholder="Search.."
                      inputProps={{ "aria-label": "Search.." }}
                      value={searchQuery}
                      onChange={handleSearchChange}
                    />
                    <IconButton
                      className="search-icon"
                      type="button"
                      aria-label="search"
                      onClick={searchClick}
                    >
                      <ClearIcon />
                    </IconButton>
                  </Paper>{" "}
                </div>
              ) : (
                <div
                  className="search-transaction"
                  onClick={() => handleFilterToggle("search")}
                >
                  {" "}
                  <SearchIcon />
                  <p> Search </p>{" "}
                </div>
              )}

              <div className="filter-transaction">
                <div
                  className="filter-title"
                  onClick={() => handleFilterToggle("filter")}
                >
                  <FilterAltIcon />
                  <p> Filter </p>
                </div>
                {expandTools.filterExpanded &&
                !expandTools.searchExpanded &&
                !expandTools.sortExpanded ? (
                  <div className="filters">
                    <div className="filter-details">
                      <div className="filter-date" onClick={toggleDatePicker}>
                        <CalendarTodayIcon />
                        <p> Date </p>
                      </div>

                      <div className="filter-amount" onClick={toggleAmount}>
                        <AttachMoneyIcon />
                        <p> Amount </p>
                      </div>
                    </div>
                    {isDatePickerVisible && (
                      <DatePicker
                        selected={selectedDate}
                        onChange={(date: Date | null) => setSelectedDate(date)}
                        placeholderText="Select Date"
                        dateFormat="yyyy/MM/dd"
                        className="date-picker"
                      />
                    )}
                    {isAmountVisible && (
                      <div className="amount-filters">
                        <input
                          type="number"
                          name="minAmount"
                          placeholder="Min Amount"
                          onChange={handleAmountChange}
                        />

                        <input
                          type="number"
                          name="maxAmount"
                          placeholder="Max Amount"
                          onChange={handleAmountChange}
                        />
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
              <div
                className="sort-transaction"
                onClick={() => handleFilterToggle("sort")}
              >
                <SortIcon />
                <p> Sort </p>
                {expandTools.sortExpanded &&
                  !expandTools.searchExpanded &&
                  !expandTools.filterExpanded && (
                    <div className="sorts">
                      <div className="asc" onClick={sortAscending}>
                        <ArrowUpwardOutlinedIcon />
                        <h1> Asc </h1>
                      </div>
                      <div className="des" onClick={sortDescending}>
                        <ArrowDownwardOutlinedIcon />
                        <h1> Des </h1>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </Zoom>
        </div>
        <div
          className="transaction-details"
          style={{
            backgroundColor:
              isExpanded || isExpandedPayment ? "#2a2a2a" : "white",
          }}
        >
          <table>
            <thead
              style={{
                backgroundColor:
                  isExpanded || isExpandedPayment ? "black" : "#1a1c22",

                color: isExpanded || isExpandedPayment ? "black" : "white",
                borderBottom:
                  isExpanded || isExpandedPayment
                    ? "0.5px solid black"
                    : "0.5px solid white",
              }}
            >
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Category</th>
                <th>Date</th>
                <th>Amount ($)</th>
              </tr>
            </thead>
            <tbody className="transaction-body">
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    style={{
                      backgroundColor:
                        isExpanded || isExpandedPayment ? "#2a2a2a" : "#1a1c22",
                      color: "white",
                    }}
                    colSpan={5}
                  >
                    No transactions found
                  </td>
                </tr>
              ) : (
                paginatedData.map((transaction, index) => (
                  <tr
                    key={index}
                    style={{
                      borderBottom:
                        isExpanded || isExpandedPayment
                          ? "0.5px solid black"
                          : "0.5px solid white",
                    }}
                  >
                    <td
                      style={{
                        backgroundColor:
                          isExpanded || isExpandedPayment
                            ? "#2a2a2a"
                            : "#2C3E50",
                        color:
                          isExpanded || isExpandedPayment ? "black" : "white",
                      }}
                    >
                      {transaction.title}
                    </td>
                    <td
                      style={{
                        backgroundColor:
                          isExpanded || isExpandedPayment
                            ? "#2a2a2a"
                            : "#2C3E50",
                        color:
                          isExpanded || isExpandedPayment ? "black" : "white",
                      }}
                    >
                      {transaction.description}
                    </td>
                    <td
                      style={{
                        backgroundColor:
                          isExpanded || isExpandedPayment
                            ? "#2a2a2a"
                            : "#2C3E50",
                        color:
                          isExpanded || isExpandedPayment
                            ? "black"
                            : transaction.category === "Expense"
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
                      {transaction.category}
                    </td>
                    <td
                      style={{
                        backgroundColor:
                          isExpanded || isExpandedPayment
                            ? "#2a2a2a"
                            : "#2C3E50",
                        color:
                          isExpanded || isExpandedPayment ? "black" : "white",
                      }}
                    >
                      {transaction.dates}
                    </td>
                    <td
                      style={{
                        backgroundColor:
                          isExpanded || isExpandedPayment
                            ? "#2a2a2a"
                            : "#2C3E50",
                        color:
                          isExpanded || isExpandedPayment
                            ? "black"
                            : transaction.category === "Expense"
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
                      {transaction.category === "Expense"
                        ? `-$${transaction.amount}`
                        : `+$${transaction.amount}`}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Stack spacing={2} className="pagination">
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          shape="rounded"
        />
      </Stack>
      {isExpanded && (
        <div className="hidden-transaction">
          <CloseIcon className="close-icon" fontSize="large" onClick={expand} />{" "}
          <form onSubmit={submitTransaction}>
            <div className="title-amount">
              <div className="title">
                <label>Transaction Title</label>
                <input
                  type="text"
                  placeholder="Title..."
                  id="title-transaction"
                  name="title"
                  onChange={handleChange}
                />
              </div>
              <div className="amount">
                <label>Transaction Amount (USD)</label>
                <input
                  type="text"
                  placeholder="Ex: 1000"
                  id="amountTransaction"
                  name="amount"
                  onChange={handleChange}
                />
              </div>
            </div>

            <label>Category</label>
            <ButtonGroup
              variant="contained"
              ref={anchorRef}
              sx={{ width: "100%" }}
              aria-label="Button group with a nested menu"
            >
              <Button sx={{ width: "100%" }} onClick={handleToggle}>
                {options[selectedIndex]}
              </Button>
              <Button
                size="small"
                aria-controls={open ? "split-button-menu" : undefined}
                aria-expanded={open ? "true" : undefined}
                aria-label="select merge strategy"
                aria-haspopup="menu"
                onClick={handleToggle}
              >
                <ArrowDropDownIcon />
              </Button>
            </ButtonGroup>
            <Popper
              sx={{
                zIndex: 1,
                width: "90%",
              }}
              open={open}
              anchorEl={anchorRef.current}
              role={undefined}
              transition
              disablePortal
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin:
                      placement === "bottom" ? "center top" : "center bottom",
                  }}
                >
                  <Paper>
                    <ClickAwayListener onClickAway={handleClose}>
                      <MenuList id="split-button-menu" autoFocusItem>
                        {options.map((option, index) => (
                          <MenuItem
                            key={option}
                            selected={index === selectedIndex}
                            disabled={index == 0}
                            onClick={() => handleMenuItemClick(index)}
                          >
                            {option}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
            <label> Add a note </label>
            <textarea
              id="description"
              name="description"
              placeholder="Add a note..."
              onChange={handleChange}
            />

            <>
              <label>Transaction Type</label>
              <select
                name="transactionType"
                className="transaction-type"
                value={transaction.transactionType}
                onChange={handleChange}
              >
                {transactionTypes[
                  transaction.category as TransactionCategory
                ]?.map((type: string) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </>

            <button type="submit" id="submitTransaction">
              Submit
            </button>
          </form>
        </div>
      )}

      {isExpandedPayment && (
        <div className="hidden-payment">
          <CloseIcon
            className="close-icon"
            fontSize="large"
            onClick={expandPayment}
          />{" "}
          <form onSubmit={submitPayment}>
            <label> Outstanding Payment Title</label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Title..."
              onChange={handlePaymentChange}
            />
            <label> Outstanding Payment Amount</label>
            <input
              type="text"
              id="amountPayment"
              name="amount"
              placeholder="Ex: 1000"
              onChange={handlePaymentChange}
            />
            <label> Add a note</label>
            <textarea
              id="description"
              name="description"
              placeholder="Add a note..."
              onChange={handlePaymentChange}
            />
            <input type="submit" value="submit" id="submitPayment" />
          </form>
        </div>
      )}
    </div>
  );
}

export default Transaction;
