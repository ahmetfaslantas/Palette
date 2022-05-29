import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useFetch from "@hooks/useFetch.jsx";
import Cookies from "js-cookie";
import Toast from "@components/toast/Toast.jsx";
import Spinner from "@components/spinner/Spinner.jsx";
import Palette from "@assets/palette.svg";
import style from "../Auth.module.css";

function Login() {
  const email = useRef();
  const password = useRef();
  const isInstructor = useRef();
  const toast = useRef();

  const {
    data: user,
    isError,
    isLoading,
    fetchData: login,
  } = useFetch("/api/auth/login", {
    method: "POST",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (Cookies.get("token")) {
      navigate("/");
    }
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (email.current.value === "" || password.current.value === "") {
      toast.current.show("Please fill all fields!");
      return;
    }

    login({
      email: email.current.value,
      password: password.current.value,
      type: isInstructor.current.checked ? "instructor" : "student",
    });
  };

  useEffect(() => {
    if (isError) {
      toast.current.show("Invalid email or password!");
    }
  }, [isError]);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  return (
    <div className={style.main}>
      <div className={style.card}>
        <img src={Palette} alt="logo" className={style.logo} />
        <form onSubmit={onSubmit} className={style.authform}>
          <label className={style.operationlabel + " " + style.title}>
            <p>Login</p>
          </label>
          <input
            className={style.textbox}
            type="text"
            placeholder="Email"
            ref={email}
          />
          <input
            className={style.textbox}
            type="password"
            placeholder="Password"
            ref={password}
          />
          <div className={style.type}>
            <label className={style.title}>
              <input
                type="radio"
                name="type"
                className={style.typeinput}
                defaultChecked={true}
                value="student"
              />
              <div className={style.typecard}>Student</div>
            </label>
            <label className={style.title}>
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
          {isLoading && <Spinner />}
        </form>
      </div>
      <Toast ref={toast} />
    </div>
  );
}

export default Login;
