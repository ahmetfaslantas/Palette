import PropTypes from "prop-types";
import style from "./Title.module.css";

function Title(props) {
  return <p className={style.title}>{props.title}</p>;
}

Title.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Title;
