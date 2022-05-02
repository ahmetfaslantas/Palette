import Navbar from "@components/navbar/Navbar.jsx";
import Title from "@components/title/Title.jsx";
import style from "./Course.module.css";

function Course() {

  return (
    <div className={style.main}>
      <Navbar />
      <div className={style.page}>
        <Title title="Course" />
      </div>
    </div>
  );
}

export default Course;
