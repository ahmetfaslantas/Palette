import React, { Component } from "react";
import "./Login.css";
import logo from "../../../public/logo192.png";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      type: "student",
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.emailChange = this.emailChange.bind(this);
    this.passwordChange = this.passwordChange.bind(this);
    this.typeChange = this.typeChange.bind(this);
  }

  async onSubmit(e) {
    e.preventDefault();
    let result = await fetch("http://localhost:4000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
        type: this.state.type,
      }),
      credentials: "include",
      redirect: "follow",
    });
    
    let json = await result.json();
    
    if (json.redirect) window.location.href = json.redirect;
  }

  emailChange(e) {
    this.setState({
      email: e.target.value,
    });
  }

  passwordChange(e) {
    this.setState({
      password: e.target.value,
    });
  }

  typeChange(e) {
    this.setState({
      type: e.target.value,
    });
  }

  render() {
    return (
      <div className="main">
        <div className="card">
          <img src={logo} alt="logo" className="logo" />
          <form onSubmit={this.onSubmit}>
            <label className="operationlabel">
              <p>Login</p>
            </label>
            <input
              type="text"
              placeholder="Email"
              value={this.state.email}
              onChange={this.emailChange}
            />
            <input
              type="password"
              placeholder="Password"
              value={this.state.password}
              onChange={this.passwordChange}
            />
            <div className="type">
              <label>
                <input
                  type="radio"
                  name="type"
                  className="typeinput"
                  value="student"
                  checked={this.state.type === "student"}
                  onChange={this.typeChange}
                  defaultChecked
                />
                <div className="typecard">Student</div>
              </label>
              <label>
                <input
                  type="radio"
                  name="type"
                  className="typeinput"
                  value="instructor"
                  checked={this.state.type === "instructor"}
                  onChange={this.typeChange}
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
}

export default Login;
