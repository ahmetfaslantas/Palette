import { useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "../Auth.module.css";
import Palette from "@assets/palette.svg";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [type, setType] = useState("student");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();

    if (password !== repeatPassword) {
      alert("Passwords do not match");
      return;
    }

    let result = await fetch("http://localhost:4000/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
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

  const nameChange = (e) => {
    setName(e.target.value);
  };

  const emailChange = (e) => {
    setEmail(e.target.value);
  };

  const passwordChange = (e) => {
    setPassword(e.target.value);
  };

  const repeatPasswordChange = (e) => {
    setRepeatPassword(e.target.value);
  };

  const typeChange = (e) => {
    setType(e.target.value);
  };

  const login = () => {
    navigate("/login");
  };

  return (
    <div className={style.main}>
      <div className={style.card}>
        <img src={Palette} alt="logo" className={style.logo} />
        <form onSubmit={onSubmit}>
          <label className={style.operationlabel}>
            <p>Sign Up</p>
          </label>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={nameChange}
          />
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
          <input
            type="password"
            placeholder="Repeat Password"
            value={repeatPassword}
            onChange={repeatPasswordChange}
          />
          <div className={style.type}>
            <label>
              <input
                type="radio"
                name="type"
                className={style.typeinput}
                value="student"
                checked={type === "student"}
                onChange={typeChange}
              />
              <div className={style.typecard}>Student</div>
            </label>
            <label>
              <input
                type="radio"
                name="type"
                className={style.typeinput}
                value="instructor"
                checked={type === "instructor"}
                onChange={typeChange}
              />
              <div className={style.typecard}>Instructor</div>
            </label>
          </div>
          <button className={style.submit} type="submit">
            Sign Up
          </button>
          <a className={style.alternative} onClick={login}>
            Already have an account? Login!
          </a>
        </form>
      </div>
    </div>
  );
}

export default Signup;
