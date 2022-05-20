import { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuth from "@hooks/useAuth.jsx";
import useFetch from "@hooks/useFetch.jsx";
import Navbar from "@components/navbar/Navbar.jsx";
import CourseNavbar from "@components/coursenavbar/CourseNavbar.jsx";
import Toast from "@components/toast/Toast.jsx";
import Title from "@components/title/Title.jsx";
import Assignment from "@components/assignment/Assignment.jsx";
import Spinner from "@components/spinner/Spinner.jsx";
import AssignmentLogo from "@assets/assignment.svg";
import style from "./Assignments.module.css";

function Assignments() {
  const type = useAuth();
  const toast = useRef();
  const { courseId } = useParams();
  const { data: assignments, isLoading, isError } = useFetch(
    `/api/course/${courseId}/assignment`,
    {
      method: "GET",
    }
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (isError) {
      toast.current.show("Error fetching assignments");
    }
  }, [isError]);

  return (
    <div className={style.main}>
      <Navbar />
      <CourseNavbar />
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
        {isLoading ? (
          <Spinner />
        ) : (
          assignments.length === 0 ? (
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
          )
        )}
      </div>
      <Toast ref={toast} />
    </div>
  );
}

export default Assignments;
