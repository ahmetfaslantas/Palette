import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import AssignmentLogo from "@assets/assignment.svg";
import style from "./UpcomingList.module.css";

function UpcomingList(props) {
  const { courses } = props;

  const navigate = useNavigate();

  return (
    <ul className={style.upcomingcontainer}>
      <p className={style.upcomingtitle}>Upcoming Assignments</p>
      {courses.map((course) => {
        return course.upcomingAssignments.map((assignment) => {
          return (
            <li className={style.upcomingitem} key={assignment._id} onClick={() => {
              navigate(`/course/${course._id}/assignment/${assignment._id}`);
            }}>
              <div className={style.upcomingentry}>
                <img src={AssignmentLogo} alt="assignment" />
                <div className={style.upcomingdetails}>
                  <p>{assignment.name}</p>
                  <p>{course.name}</p>
                  <p>{new Date(assignment.dueDate).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                    }
                  )}</p>
                </div>
              </div>
            </li>
          );
        });}
      )}
    </ul>
  );
}

UpcomingList.propTypes = {
  courses: PropTypes.arrayOf(
    PropTypes.shape({
      upcomingAssignments: PropTypes.arrayOf(
        PropTypes.shape({
          _id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          dueDate: PropTypes.string.isRequired,
        })
      ).isRequired,
    }).isRequired
  ).isRequired,
};

export default UpcomingList;
