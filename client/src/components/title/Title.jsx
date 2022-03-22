import style from "./Title.module.css";

function Title(props) {
  return <p className={style.title}>{props.title}</p>;
}

export default Title;
