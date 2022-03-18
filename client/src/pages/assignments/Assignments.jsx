import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar.jsx";
import Assignment from "../../components/assignment/Assignment.jsx";
import AssignmentLogo from "../../assets/assignment.svg";
import style from "./Assignments.module.css";

function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    async function getCourse() {
      let result = await fetch(
        `http://localhost:4000/api/course/${id}/assignment`,
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
  );
}

export default Assignments;
