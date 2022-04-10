import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Toast from "@components/toast/Toast.jsx";
import style from "../Auth.module.css";
import Palette from "@assets/palette.svg";

function Login() {
  const email = useRef();
  const password = useRef();
  const isInstructor = useRef();
  const toast = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    if (Cookies.get("token")) {
      navigate("/");
    }
  }, [navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (email.current.value === "" || password.current.value === "") {
      toast.current.show("Please fill all fields!");
      return;
    }

    let result = await fetch(`${process.env.API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.current.value,
        password: password.current.value,
        type: isInstructor.current.checked ? "instructor" : "student",
      }),
      credentials: "include",
      redirect: "follow",
    });

    if (result.status !== 200) {
      toast.current.show("Invalid email or password!");
      return;
    }

    let json = await result.json();

    if (json.redirect) navigate(json.redirect);
  };

  return (
    <div className={style.main}>
      <div className={style.card}>
        <img src={Palette} alt="logo" className={style.logo} />
        <form onSubmit={onSubmit}>
          <label className={style.operationlabel}>
            <p>Login</p>
          </label>
          <input
            type="text"
            placeholder="Email"
            ref={email}
          />
          <input
            type="password"
            placeholder="Password"
            ref={password}
          />
          <div className={style.type}>
            <label>
              <input
                type="radio"
                name="type"
                className={style.typeinput}
                defaultChecked={true}
                value="student"
              />
              <div className={style.typecard}>Student</div>
            </label>
            <label>
              <input
                type="radio"
                name="type"
                className={style.typeinput}
                value="instructor"
                ref={isInstructor}
              />
              <div className={style.typecard}>Instructor</div>
            </label>
          </div>
          <button className={style.submit} type="submit">
            Login
          </button>
          <a
            className={style.alternative}
            onClick={() => {
              navigate("/signup");
            }}
          >
            Don&apos;t have an account? Sign up!
          </a>
        </form>
      </div>
      <Toast ref={toast} />
    </div>
  );
}

export default Login;
