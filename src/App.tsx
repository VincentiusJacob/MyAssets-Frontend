import { BrowserRouter, Routes, Route } from "react-router-dom";
import Lobby from "./Lobby";
import Register from "./components/Register";
import NavBar from "./components/navbar";
import Dashboard from "./components/dashboard";
import Transaction from "./components/transaction";
import Wallet from "./components/wallet";
import Analytics from "./components/analytics";
import Personal from "./components/personal";
import Login from "./components/Login";
import "./App.css";
import Authenticated from "./components/authenticated";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Lobby />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/authenticated" element={<Authenticated />} />
        <Route
          path="/Dashboard"
          element={
            <div className="container-root">
              <NavBar />
              <div className="content-section">
                <Dashboard />
              </div>
            </div>
          }
        />
        <Route
          path="/Transaction"
          element={
            <div className="container-root">
              <NavBar />
              <div className="content-section">
                <Transaction />
              </div>
            </div>
          }
        />
        <Route
          path="/Wallet"
          element={
            <div className="container-root">
              <NavBar />
              <div className="content-section">
                <Wallet />
              </div>
            </div>
          }
        />
        <Route
          path="/Analytics"
          element={
            <div className="container-root">
              <NavBar />
              <div className="content-section">
                <Analytics />
              </div>
            </div>
          }
        />
        <Route
          path="/Personal"
          element={
            <div className="container-root">
              <div className="content-section">
                <Personal />
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
