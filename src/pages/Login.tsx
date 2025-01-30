import { Parallax } from "react-parallax";
import "./Login.css";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorLogin, setErrorLogin] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const result = await axios.post(
        "https://myassets-backend.vercel.app/auth/login",
        {
          email: email,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (result.status === 200) {
        console.log(result.data.user.username);
        localStorage.setItem(
          "data",
          JSON.stringify({ email: email, username: result.data.user.username })
        );

        navigate("/Dashboard");
      } else {
        console.log("Error fetching data");
      }
    } catch (err: any) {
      setErrorLogin(err.message);
      console.log("err: ", err.message);
      console.error("Error:", err);
    }
  }

  return (
    <Parallax strength={500} className="container">
      <div className="loginContainer">
        <h2>Login to your account</h2>
        <form className="form" onSubmit={handleSubmit}>
          <div className="emailSection">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              placeholder="Email"
              name="email"
              id="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="passwordSection">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              value={password}
              autoComplete="password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <input type="submit" name="submit" id="submit" value="Continue" />
        </form>
        {errorLogin == "" ? null : (
          <p className="error-message"> {errorLogin}! </p>
        )}
        <p>
          Create new account? <Link to="/register">Register</Link>
        </p>
      </div>
    </Parallax>
  );
}

export default Login;
