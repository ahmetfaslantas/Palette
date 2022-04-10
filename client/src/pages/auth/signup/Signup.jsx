import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import style from "../Auth.module.css";
import Palette from "@assets/palette.svg";

function Signup() {
  const name = useRef();
  const email = useRef();
  const password = useRef();
  const passwordRepeat = useRef();
  const isInstructor = useRef();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();

    if (password.current.value !== passwordRepeat.current.value) {
      alert("Passwords do not match");
      return;
    }

    let result = await fetch(`${process.env.API_URL}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name.current.value,
        email: email.current.value,
        password: password.current.value,
        type: isInstructor.current.checked ? "instructor" : "student",
      }),
      credentials: "include",
      redirect: "follow",
    });

    let json = await result.json();

    if (json.redirect) navigate(json.redirect);
  };

  return (
    <div className={style.main}>
      <div className={style.card}>
        <img src={Palette} alt="logo" className={style.logo} />
        <form onSubmit={onSubmit}>
          <label className={style.operationlabel}>
            <p>Sign Up</p>
          </label>
          <input type="text" placeholder="Name" ref={name} />
          <input type="text" placeholder="Email" ref={email} />
          <input type="password" placeholder="Password" ref={password} />
          <input
            type="password"
            placeholder="Repeat Password"
            ref={passwordRepeat}
          />
          <div className={style.type}>
            <label>
              <input
                type="radio"
                name="type"
                className={style.typeinput}
                defaultChecked={true}
              />
              <div className={style.typecard}>Student</div>
            </label>
            <label>
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
        </form>
      </div>
    </div>
  );
}

export default Signup;
