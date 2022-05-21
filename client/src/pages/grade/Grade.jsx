import { useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAuth from "@hooks/useAuth.jsx";
import useFetch from "@hooks/useFetch.jsx";
import Navbar from "@components/navbar/Navbar.jsx";
import CourseNavbar from "@components/coursenavbar/CourseNavbar.jsx";
import Toast from "@components/toast/Toast.jsx";
import Title from "@components/title/Title.jsx";
import GradeEntry from "@components/gradeentry/GradeEntry.jsx";
import Spinner from "@components/spinner/Spinner.jsx";
import style from "./Grade.module.css";

function Grade() {
  useAuth();
  const { courseId, assignmentId } = useParams();
  const {
    data: assignment,
    isLoading,
    isError,
    fetchData: fetchAssignment,
  } = useFetch(
    `/api/course/${courseId}/assignment/${assignmentId}/submissions`
  );

  const toast = useRef();
  const navigate = useNavigate();
  let grades = {};

  useEffect(() => {
    fetchAssignment();
  }, []);

  useEffect(() => {
    if (isError) {
      toast.current.show("Error loading grades");
    }
  }, [isError]);

  const submitGrades = async () => {
    for (let studentId in grades) {
      if (typeof grades[studentId] !== "number") {
        toast.current.show("Please enter a grade for all students");
        return;
      }
    }

    const result = await fetch(
      `${process.env.API_URL}/api/course/${courseId}/assignment/${assignmentId}/grade`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        redirect: "follow",
        body: JSON.stringify({ grades }),
      }
    );

    if (result.status !== 200) {
      toast.current.show("Failed to submit grades");
      return;
    }

    navigate(`/course/${courseId}/assignment/${assignmentId}`);
  };

  const setGrade = (id, grade) => {
    grades[id] = grade;
  };

  return (
    <div className={style.main}>
      <Navbar />
      <CourseNavbar />
      <div className={style.page}>
        <Title title="Grade" />
        {isLoading ? (
          <Spinner />
        ) : (
          <div className={style.grading}>
            <div className={style.submissions}>
              {assignment.submissions.map((submission) => (
                <GradeEntry
                  key={submission.id}
                  entry={submission}
                  maxPoints={assignment.maxPoints}
                  setGrade={setGrade}
                />
              ))}
            </div>
            <button className={style.submit} onClick={submitGrades}>
              Submit Grades
            </button>
          </div>
        )}
      </div>
      <Toast ref={toast} />
    </div>
  );
}

export default Grade;
