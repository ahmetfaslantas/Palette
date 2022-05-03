import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CourseCard from "@components/coursecard/CourseCard.jsx";
import Navbar from "@components/navbar/Navbar.jsx";
import Title from "@components/title/Title.jsx";
import Cookies from "js-cookie";
import style from "./Dashboard.module.css";

function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [type, setType] = useState("");
  let navigate = useNavigate();

  useEffect(() => {
    if (!Cookies.get("token") || !Cookies.get("type")) {
      navigate("/login");
    }

    async function getCourses() {
      let result = await fetch(`${process.env.API_URL}/api/course`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        redirect: "follow",
      });

      let json = await result.json();
      
      setCourses(json);

      json.forEach((course) => {
        localStorage.setItem(
          `${course._id}:name`,
          course.name
        );
      });
    }
    getCourses();
    setType(Cookies.get("type"));
  }, [navigate]);

  return (
    <div className={style.main}>
      <Navbar />
      <div className={style.page}>
        <div className={style.controls}>
          <Title title="Dashboard" />
          {type === "instructor" && (
            <button
              className={style.addcourse}
              onClick={() => {
                navigate("/newcourse");
              }}
            >
              Add Course
            </button>
          )}
        </div>
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
