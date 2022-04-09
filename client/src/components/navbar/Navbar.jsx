import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import style from "./Navbar.module.css";
import PaletteLogo from "@assets/palette.svg";
import DashboardLogo from "@assets/dashboard.svg";
import CoursesLogo from "@assets/courses.svg";
import LogoutLogo from "@assets/logout.svg";

function Navbar() {
  let navigate = useNavigate();

  const logout = () => {
    Cookies.remove("type");
    Cookies.remove("token");
    navigate("/login");
  };

  return (
    <ul className={style.navbar}>
      <li className={style.navbaritem}>
        <img
          src={PaletteLogo}
          alt="Palette"
          className={style.icon}
          onClick={() => {
            navigate("/dashboard", { replace: true });
          }}
        />
      </li>
      <li className={style.navbaritem}>
        <img src={DashboardLogo} alt="Dashboard" className={style.icon} />
      </li>
      <li className={style.navbaritem}>
        <img src={CoursesLogo} alt="Courses" className={style.icon} />
      </li>
      <li className={style.navbaritem}>
        <img
          src={LogoutLogo}
          alt="Logout"
          className={style.icon}
          onClick={logout}
        />
      </li>
    </ul>
  );
}

export default Navbar;
