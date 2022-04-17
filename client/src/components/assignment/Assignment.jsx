import { useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import AssignmentLogo from "@assets/assignment.svg";
import style from "./Assignment.module.css";

function Assignment(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const { assignment } = props;
  const course = location.pathname.split("/")[2];

  return (
    <li
      className={style.assignmententry}
      onClick={() => {
        navigate(`/course/${course}/assignment/${assignment._id}`);
      }}
    >
      <div className={style.assignmentcontainer}>
        <img
          className={style.assignmentlogo}
          src={AssignmentLogo}
          alt="Assignment"
        />
        <div className={style.assignmentdetails}>
          <p className={style.name}>{assignment.name}</p>
          <p className={style.description}>{assignment.description}</p>
          <p className={style.duedate}>
            Due:{" "}
            {new Date(assignment.dueDate).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
            })}
          </p>
        </div>
      </div>
    </li>
  );
}

Assignment.propTypes = {
  assignment: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    dueDate: PropTypes.string.isRequired,
    files: PropTypes.arrayOf(PropTypes.string),
    _id: PropTypes.string.isRequired,
  }).isRequired,
};

export default Assignment;
