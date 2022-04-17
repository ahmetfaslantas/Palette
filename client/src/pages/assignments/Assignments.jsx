import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@components/navbar/Navbar.jsx";
import Title from "@components/title/Title.jsx";
import Assignment from "@components/assignment/Assignment.jsx";
import AssignmentLogo from "@assets/assignment.svg";
import style from "./Assignments.module.css";
import Cookies from "js-cookie";

function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [type, setType] = useState("");

  const { courseId } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    async function getCourse() {
      let result = await fetch(
        `${process.env.API_URL}/api/course/${courseId}/assignment`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          redirect: "follow",
        }
      );
      let json = await result.json();

      setAssignments(json);
    }

    getCourse();
    setType(Cookies.get("type"));
  }, []);

  return (
    <div className={style.main}>
      <Navbar />
      <div className={style.page}>
        <div className={style.controls}>
          <Title title="Assignments" />
          {type === "instructor" && (
            <button
              className={style.addassignment}
              onClick={() => {
                navigate(`/course/${courseId}/assignments/new`);
              }}
            >
              Add Assignment
            </button>
          )}
        </div>
          
        {assignments.length === 0 ? (
          <div className={style.noassignments}>
            <img
              className={style.noassignmentslogo}
              src={AssignmentLogo}
              alt="No Assignments"
            />
            <p>No assignments yet!</p>
          </div>
        ) : (
          <ul className={style.assignmentcontainer}>
            {assignments.map((assignment) => (
              <Assignment assignment={assignment} key={assignment._id} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Assignments;
