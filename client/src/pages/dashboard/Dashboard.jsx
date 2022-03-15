import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CourseCard from "../../components/coursecard/CourseCard.jsx";
import Navbar from "../../components/navbar/Navbar.jsx";
import Cookies from "js-cookie";
import style from "./Dashboard.module.css";

function Dashboard() {
  const [courses, setCourses] = useState([]);
  let navigate = useNavigate();

  useEffect(async () => {
    if (!Cookies.get("token")) {
      navigate("/login");
    }

    let result = await fetch("http://localhost:4000/api/course", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      redirect: "follow",
    });

    let json = await result.json();

    setCourses(json);
  }, []);

  return (
    <div className={style.main}>
      <Navbar />
      <div className={style.page}>
        <h1 className={style.title}>Dashboard</h1>
        <ul className={style.coursecontainer}>
          {courses.map((course) => (
            <CourseCard course={course} key={course._id} />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
