import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "./Login.css";
import logo from "../../../public/logo192.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("student");
  const navigate = useNavigate();

  useEffect(() => {
    console.log("useEffect");
    if (Cookies.get("token")) {
      navigate("/");
    }
  }, [navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    let result = await fetch("http://localhost:4000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
        type: type,
      }),
      credentials: "include",
      redirect: "follow",
    });

    let json = await result.json();

    if (json.redirect) navigate(json.redirect);
  };

  const emailChange = (e) => {
    setEmail(e.target.value);
  };

  const passwordChange = (e) => {
    setPassword(e.target.value);
  };

  const typeChange = (e) => {
    setType(e.target.value);
  };

  return (
    <div className="main">
      <div className="card">
        <img src={logo} alt="logo" className="logo" />
        <form onSubmit={onSubmit}>
          <label className="operationlabel">
            <p>Login</p>
          </label>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={emailChange}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={passwordChange}
          />
          <div className="type">
            <label>
              <input
                type="radio"
                name="type"
                className="typeinput"
                value="student"
                checked={type === "student"}
                onChange={typeChange}
              />
              <div className="typecard">Student</div>
            </label>
            <label>
              <input
                type="radio"
                name="type"
                className="typeinput"
                value="instructor"
                checked={type === "instructor"}
                onChange={typeChange}
              />
              <div className="typecard">Instructor</div>
            </label>
          </div>
          <button className="submit" type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
