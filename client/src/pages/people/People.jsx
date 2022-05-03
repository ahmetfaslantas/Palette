import { useRef, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Title from "@components/title/Title.jsx";
import Navbar from "@components/navbar/Navbar.jsx";
import Toast from "@components/toast/Toast.jsx";
import Cookies from "js-cookie";
import style from "./People.module.css";

function People() {
  const { courseId } = useParams();
  const toast = useRef();

  const [students, setStudents] = useState([]);
  const [innstructors, setInstructors] = useState([]);
  const [type, setType] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function getPeople() {
      const studentResponse = await fetch(
        `${process.env.API_URL}/api/course/${courseId}/student`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (studentResponse.status !== 200) {
        toast.current.show("Error getting students");
        return;
      }

      const instructorResponse = await fetch(
        `${process.env.API_URL}/api/course/${courseId}/instructor`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (instructorResponse.status !== 200) {
        toast.current.show("Error getting instructors");
        return;
      }

      const students = await studentResponse.json();
      const instructors = await instructorResponse.json();

      setStudents(students);
      setInstructors(instructors);
    }

    getPeople();
    setType(Cookies.get("type"));
  }, []);

  return ( 
    <div className={style.main}>
      <Navbar />
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
        <div className={style.people}>
          {innstructors.map((instructor) => (
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
      </div>
      <Toast ref={toast} />
    </div>
  );
}

export default People;