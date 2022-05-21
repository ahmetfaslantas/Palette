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
    isLoading,
    isError,
    fetchData: fetchCourses,
  } = useFetch("/api/course");
  let navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

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
        {isLoading ? (
          <Spinner />
        ) : (
          <ul className={style.coursecontainer}>
            {courses.map((course) => (
              <CourseCard course={course} key={course._id} />
            ))}
          </ul>
        )}
      </div>
      <Toast ref={toast} />
    </div>
  );
}

export default Dashboard;
