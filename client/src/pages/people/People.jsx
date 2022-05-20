import { useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAuth from "@hooks/useAuth.jsx";
import useFetch from "@hooks/useFetch.jsx";
import Title from "@components/title/Title.jsx";
import Navbar from "@components/navbar/Navbar.jsx";
import CourseNavbar from "@components/coursenavbar/CourseNavbar.jsx";
import Toast from "@components/toast/Toast.jsx";
import Spinner from "@components/spinner/Spinner.jsx";
import style from "./People.module.css";

function People() {
  const { courseId } = useParams();
  const toast = useRef();

  const { data: students, isLoading: isLoadingStudents, isError: isErrorStudents } = useFetch(
    `/api/course/${courseId}/student`,
    {
      method: "GET",
    }
  );

  const { data: instructors, isLoading: isLoadingInstructors, isError: isErrorInstructors } = useFetch(
    `/api/course/${courseId}/instructor`,
    {
      method: "GET",
    }
  );

  const type = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isErrorInstructors || isErrorStudents) {
      toast.current.show("Error loading people");
    }
  }, [isErrorInstructors, isErrorStudents]);

  return ( 
    <div className={style.main}>
      <Navbar />
      <CourseNavbar />
      <div className={style.page}>
        <div className={style.controls}>
          <Title title="People" />
          {type === "instructor" && (
            <button
              className={style.addstudent}
              onClick={() => {
                navigate(`/course/${courseId}/newstudent`);
              }}
            >
              Add Student
            </button>
          )}
        </div>
        {
          isLoadingStudents || isLoadingInstructors ? (
            <Spinner />
          ) : ( 
            <div className={style.people}>
              {instructors.map((instructor) => (
                <div className={style.instructor} key={instructor._id}>
                  <p>{instructor.name}</p>
                  <p>Instructor</p>
                </div>
              ))}
              {students.map((student) => (
                <div className={style.student} key={student._id}>
                  <p>{student.name}</p>
                  <p>Student</p>
                </div>
              ))}
            </div>
          )}
      </div>
      <Toast ref={toast} />
    </div>
  );
}

export default People;