import useAuth from "@hooks/useAuth.jsx";
import Navbar from "@components/navbar/Navbar.jsx";
import CourseNavbar from "@components/coursenavbar/CourseNavbar.jsx";
import Title from "@components/title/Title.jsx";
import style from "./Course.module.css";

function Course() {
  useAuth();

  return (
    <div className={style.main}>
      <Navbar />
      <CourseNavbar />
      <div className={style.page}>
        <Title title="Course" />
      </div>
    </div>
  );
}

export default Course;
