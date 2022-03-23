import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import style from "../Auth.module.css";
import logo from "../../../../public/logo192.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("student");
  const navigate = useNavigate();

  useEffect(() => {
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

  const signup = () => {
    navigate("/signup");
  };

  return (
    <div className={style.main}>
      <div className={style.card}>
        <img src={logo} alt="logo" className={style.logo} />
        <form onSubmit={onSubmit}>
          <label className={style.operationlabel}>
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
            Login
          </button>
          <a className={style.alternative} onClick={signup}>
            Don&apos;t have an account? Sign up!
          </a>
        </form>
      </div>
    </div>
  );
}

export default Login;
