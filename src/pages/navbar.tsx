import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import WalletIcon from "@mui/icons-material/Wallet";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import axios from "axios";
import "./navbar.css";
import logo from "../assets/myassetslogo.png";
import defaultpic from "../assets/userdefault.png";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LogoutIcon from "@mui/icons-material/Logout";

function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentUserProfile, setCurrentUserProfile] = useState<any>(null);
  const getUser = localStorage.getItem("data");
  const parsedCurrentUsername = getUser ? JSON.parse(getUser) : null;
  const currentUsername = parsedCurrentUsername.username;

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

  useEffect(() => {
    const fetchData = async () => {
      let username;
      if (getUser) {
        const parseData = JSON.parse(getUser);
        username = parseData.username;
        try {
          const userData = await axios.get(
            `https://myassets-backend.vercel.app/getUserProfile/${username}`
          );
          console.log("user data from backend: ", userData);
          setCurrentUserProfile(userData.data[0]);
        } catch (err) {
          console.log(err);
        }
      }
    };
    fetchData();
  }, []);

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

  const clickProfile = () => {
    navigate("/personal");
  };

  const handleInfo = () => {
    navigate("/");
  };

  const handleLogOut = async () => {
    const getUser = localStorage.getItem("data");
    if (getUser) {
      const user = JSON.parse(getUser);
      const username = user.username;

      try {
        const result = await axios.post(
          `https://myassets-backend.vercel.app/auth/logout`,
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
    <div className="navBar-container">
      <div className="phone-navigation">
        <div className="card-header-nb" onClick={clickProfile}>
          <div
            className="card-picture"
            style={{
              backgroundImage: `url(${
                currentUserProfile?.profilepicture || defaultpic
              })`,
            }}
          ></div>
          <h1> {currentUsername} </h1>
        </div>

        <div className="phone-navigation-right">
          <div onClick={handleInfo}>
            <InfoOutlinedIcon
              style={{ width: "30px", height: "30px", color: "white" }}
            />
          </div>
          <div onClick={handleLogOut}>
            <LogoutIcon
              style={{ width: "30px", height: "30px", color: "white" }}
            />{" "}
          </div>
        </div>
      </div>
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
