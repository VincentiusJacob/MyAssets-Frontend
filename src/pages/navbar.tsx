import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import WalletIcon from "@mui/icons-material/Wallet";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import "./navbar.css";
import logo from "../assets/myassetslogo.png";

function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      icon: <DashboardIcon />,
      title: "Dashboard",
      path: "/Dashboard",
    },
    {
      icon: <AccountBalanceWalletIcon />,
      title: "Transaction",
      path: "/Transaction",
    },
    {
      icon: <WalletIcon />,
      title: "Wallet",
      path: "/Wallet",
    },
    {
      icon: <AnalyticsIcon />,
      title: "Analytics",
      path: "/Analytics",
    },
  ];

  const [currentMenu, setMenu] = useState(
    menuItems.map((item) => ({
      ...item,
      isClicked: location.pathname === item.path,
    }))
  );

  useEffect(() => {
    const newMenu = menuItems.map((item) => ({
      ...item,
      isClicked: location.pathname === item.path,
    }));
    setMenu(newMenu);
  }, [location]);

  function handleClick(index: number) {
    const selectedMenu = menuItems[index];
    setMenu(
      menuItems.map((menu, i) => ({
        ...menu,
        isClicked: i === index,
      }))
    );
    navigate(selectedMenu.path);
  }

  return (
    <div className="navBar-container">
      <img src={logo} alt="Logo" />
      <ul className="menu">
        {currentMenu.map((menu, index) => (
          <li
            key={index}
            style={{ color: menu.isClicked ? "#1FCB4F" : "#A9A9A9" }}
            onClick={() => handleClick(index)}
          >
            {menu.icon} {menu.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NavBar;
