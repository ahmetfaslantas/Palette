import { useRef, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "@components/navbar/Navbar.jsx";
import CourseNavbar from "@components/coursenavbar/CourseNavbar.jsx";
import Toast from "@components/toast/Toast.jsx";
import Title from "@components/title/Title.jsx";
import GradeEntry from "@components/gradeentry/GradeEntry.jsx";
import style from "./Grade.module.css";

function Grade() {
  const [submissions, setSubmissions] = useState([]);
  const [maxPoints, setMaxPoints] = useState(0);
  const { courseId, assignmentId } = useParams();
  const toast = useRef();
  const navigate = useNavigate();
  let grades = {};

  useEffect(() => {
    async function getSubmissions() {
      let result = await fetch(
        `${process.env.API_URL}/api/course/${courseId}/assignment/${assignmentId}/submissions/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          redirect: "follow",
        }
      );

      if (result.status !== 200) {
        toast.current.show("Failed to get submissions");
        return;
      }
      
      const res = await result.json();

      setSubmissions(res.submissions);
      setMaxPoints(res.maxPoints);

      res.submissions.forEach((submission) => {
        grades[submission.studentId] = null;
      });
    }

    getSubmissions();
  }, []);

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
        <div className={style.grading}>
          <div className={style.submissions}>
            {submissions.map((submission) => {
              return <GradeEntry key={submission.id} entry={submission} maxPoints={maxPoints} setGrade={setGrade} />;
            })}
          </div>
          <button className={style.submit} onClick={submitGrades}>
            Submit Grades
          </button>
        </div>
      </div>
      <Toast ref={toast} />
    </div>
  );
}

export default Grade;
