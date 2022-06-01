import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import useAuth from "@hooks/useAuth.jsx";
import useFetch from "@hooks/useFetch.jsx";
import Title from "@components/title/Title.jsx";
import Navbar from "@components/navbar/Navbar.jsx";
import CourseNavbar from "@components/coursenavbar/CourseNavbar.jsx";
import Spinner from "@components/spinner/Spinner.jsx";
import Toast from "@components/toast/Toast.jsx";
import GradeDetailsLogo from "@assets/gradedetails.svg";
import style from "./Grades.module.css";

function Grades() {
  useAuth();
  const { courseId } = useParams();
  const toast = useRef();

  const {
    data: grades,
    done,
    isError,
    fetchData: fetchGrades,
  } = useFetch(`/api/course/${courseId}/grades`);

  useEffect(() => {
    fetchGrades();
  }, []);

  useEffect(() => {
    if (isError) {
      toast.current.show("Error loading grades");
    }
  }, [isError]);

  return (
    <div className={style.main}>
      <Navbar />
      <CourseNavbar />
      <div className={style.page}>
        <Title title="Grade" />
        {done ? (
          <div className={style.grades}>
            {grades.map((grade) => (
              <div className={style.grade} key={grade.id}>
                <p>{grade.name}</p>
                <p>{grade.self} / {grade.maxPoints}</p>
                <details>
                  <summary>
                    <img src={GradeDetailsLogo} alt="See Grading Details" />
                  </summary>
                  <div className={style.gradingdetails}>
                    <p>Max: {grade.max}</p>
                    <p>Min: {grade.min}</p>
                    <p>Average: {grade.average}</p>
                  </div>
                </details>
              </div>
            ))}
          </div>
        ) : (
          <Spinner />
        )}
      </div>
      <Toast ref={toast} />
    </div>
  );
}

export default Grades;