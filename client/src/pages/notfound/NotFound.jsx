import { useNavigate } from "react-router-dom";
import style from "./NotFound.module.css";
import Palette from "../../assets/palette.svg";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className={style.notfound}>
      <img className={style.palette} src={Palette} alt="Palette" />
      <h1>404</h1>
      <h2>Page not found</h2>
      <h3>The page you are looking for does not exist.</h3>
      <a
        className={style.return}
        onClick={() => {
          navigate("/dashboard", { replace: true });
        }}
      >
        <h4>Return to the homepage</h4>
      </a>
    </div>
  );
}

export default NotFound;
