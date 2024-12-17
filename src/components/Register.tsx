import { Parallax } from "react-parallax";
import "./Register.css";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://myassets-backend.vercel.app/auth/register",
        {
          username: username,
          email: email,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        console.log("response data: ", response.data);
        localStorage.setItem("data", JSON.stringify(response.data));
        navigate("/Dashboard", { replace: true });
      } else {
        console.log("Failed to register");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  }

  return (
    <Parallax strength={500} className="container">
      <div className="registerContainer">
        <h2>Sign Up</h2>
        <form className="form" onSubmit={handleSubmit}>
          <div className="nameSection">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              placeholder="Username"
              name="username"
              id="username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
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
          <input
            type="submit"
            name="submit"
            id="submit-register"
            value="Continue"
          />
        </form>
        <p id="loginhere">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </Parallax>
  );
}

export default Register;
