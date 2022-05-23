import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "@hooks/useAuth.jsx";
import useFetch from "@hooks/useFetch.jsx";
import CourseCard from "@components/coursecard/CourseCard.jsx";
import Navbar from "@components/navbar/Navbar.jsx";
import Title from "@components/title/Title.jsx";
import Toast from "@components/toast/Toast.jsx";
import Spinner from "@components/spinner/Spinner.jsx";
import style from "./Dashboard.module.css";

function Dashboard() {
  const type = useAuth();
  const toast = useRef();
  const {
    data: courses,
    done,
    isError,
    fetchData: fetchCourses,
  } = useFetch("/api/course");

  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (courses) {
      courses.forEach((course) => {
        localStorage.setItem(
          `${course._id}:name`,
          course.name
        );
      });
    }
  }, [courses]);

  useEffect(() => {
    if (isError) {
      toast.current.show("Error fetching courses");
    }
  }, [isError]);

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
        {done ? (
          <ul className={style.coursecontainer}>
            {courses.map((course) => (
              <CourseCard course={course} key={course._id} />
            ))}
          </ul>
        ) : (
          <Spinner />
        )}
      </div>
      <Toast ref={toast} />
    </div>
  );
}

export default Dashboard;
