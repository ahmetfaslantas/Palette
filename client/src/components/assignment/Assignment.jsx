import PropTypes from "prop-types";
import AssignmentLogo from "../../assets/assignment.svg";
import style from "./Assignment.module.css";

function Assignment(props) {
  return (
    <li className={style.assignmententry}>
      <div className={style.assignmentcontainer}>
        <img
          className={style.assignmentlogo}
          src={AssignmentLogo}
          alt="Assignment"
        />
        <div className={style.assignmentdetails}>
          <p className={style.name}>{props.assignment.name}</p>
          <p className={style.description}>{props.assignment.description}</p>
          <p className={style.duedate}>
            Due:{" "}
            {new Date(props.assignment.dueDate).toLocaleDateString("en-US", {
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
  }),
};

export default Assignment;
