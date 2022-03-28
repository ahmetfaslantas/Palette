import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@components/navbar/Navbar.jsx";
import Title from "@components/title/Title.jsx";
import Assignment from "@components/assignment/Assignment.jsx";
import AssignmentLogo from "@assets/assignment.svg";
import style from "./Assignments.module.css";

function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const { courseId } = useParams();

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
  }, []);

  return (
    <div className={style.main}>
      <Navbar />

      <div className={style.page}>
        <Title title="Assignments" />
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
