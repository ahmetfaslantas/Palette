import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useFetch from "@hooks/useFetch.jsx";
import Toast from "@components/toast/Toast.jsx";
import Spinner from "@components/spinner/Spinner.jsx";
import Palette from "@assets/palette.svg";
import style from "../Auth.module.css";

function Signup() {
  const name = useRef();
  const email = useRef();
  const password = useRef();
  const passwordRepeat = useRef();
  const isInstructor = useRef();
  const toast = useRef();

  const {
    data: user,
    isError,
    isLoading,
    fetchData: signup,
  } = useFetch("/api/auth/signup", {
    method: "POST",
  });

  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();

    if (
      name.current.value === "" ||
      email.current.value === "" ||
      password.current.value === "" ||
      passwordRepeat.current.value === ""
    ) {
      toast.current.show("Please fill all fields!");
      return;
    }

    if (password.current.value !== passwordRepeat.current.value) {
      toast.current.show("Passwords do not match!");
      return;
    }

    signup({
      name: name.current.value,
      email: email.current.value,
      password: password.current.value,
      type: isInstructor.current.checked ? "instructor" : "student",
    });
  };

  useEffect(() => {
    if (isError) {
      toast.current.show("User with this email already exists!");
    }
  }, [isError]);

  useEffect(() => {
    if (user) {
      navigate("/login");
    }
  }, [user]);

  return (
    <div className={style.main}>
      <div className={style.card}>
        <img src={Palette} alt="logo" className={style.logo} />
        <form onSubmit={onSubmit} className={style.authform}>
          <label className={style.operationlabel + " " + style.title}>
            <p>Sign Up</p>
          </label>
          <input
            type="text"
            placeholder="Name"
            ref={name}
            className={style.textbox}
          />
          <input
            type="text"
            placeholder="Email"
            ref={email}
            className={style.textbox}
          />
          <input
            type="password"
            placeholder="Password"
            ref={password}
            className={style.textbox}
          />
          <input
            type="password"
            placeholder="Repeat Password"
            ref={passwordRepeat}
            className={style.textbox}
          />
          <div className={style.type}>
            <label className={style.title}>
              <input
                type="radio"
                name="type"
                className={style.typeinput}
                defaultChecked={true}
              />
              <div className={style.typecard}>Student</div>
            </label>
            <label className={style.title}>
              <input
                type="radio"
                name="type"
                className={style.typeinput}
                ref={isInstructor}
              />
              <div className={style.typecard}>Instructor</div>
            </label>
          </div>
          <button className={style.submit} type="submit">
            Sign Up
          </button>
          <a
            className={style.alternative}
            onClick={() => {
              navigate("/login");
            }}
          >
            Already have an account? Login!
          </a>
          {isLoading && <Spinner />}
        </form>
      </div>
      <Toast ref={toast} />
    </div>
  );
}

export default Signup;
