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
    done,
    isError,
    fetchData: fetchAssignment,
  } = useFetch(
    `/api/course/${courseId}/assignment/${assignmentId}/submissions`
  );

  const {
    done: gradesDone,
    isError: gradesError,
    fetchData: submitGrade,
  } = useFetch(`/api/course/${courseId}/assignment/${assignmentId}/grade`, {
    method: "POST",
  });

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

    submitGrade({ grades });
  };

  useEffect(() => {
    if (gradesDone) {
      navigate(`/course/${courseId}/assignment/${assignmentId}`);
    }
  }, [gradesDone]);

  useEffect(() => {
    if (gradesError) {
      toast.current.show("Error submitting grades");
    }
  }, [gradesError]);

  const setGrade = (id, grade) => {
    grades[id] = grade;
  };

  return (
    <div className={style.main}>
      <Navbar />
      <CourseNavbar />
      <div className={style.page}>
        <Title title="Grade" />
        {done ? (
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
        ) : (
          <Spinner />
        )}
      </div>
      <Toast ref={toast} />
    </div>
  );
}

export default Grade;
