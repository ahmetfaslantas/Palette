import style from "./Navbar.module.css";
import AccountLogo from "../../assets/account.svg";

function Navbar() {
  return (
    <ul className={style.navbar}>
      <img src={AccountLogo} alt="Account" className={style.icon} />
    </ul>
  );
}

export default Navbar;
