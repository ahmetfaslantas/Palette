import PropTypes from "prop-types";
import style from "./CourseCard.module.css";
import AnnouncementLogo from "@assets/announcement.svg";
import AssignmentLogo from "@assets/assignment.svg";
import FileLogo from "@assets/file.svg";
import { useNavigate } from "react-router-dom";

function CourseCard(props) {
  let navigate = useNavigate();

  const getSemester = () => {
    let date = new Date(props.course.creationDate);
    let month = date.getMonth();
    let year = date.getFullYear();

    return `${year}-${month > 8 ? 1 : 2}`;
  };

  const generateCourseColor = () => {
    let h = randomInt(0, 360);
    let s = randomInt(42, 98);
    let l = randomInt(40, 90);
    let color = `hsl(${h}, ${s}%, ${l}%)`;
    localStorage.setItem(`color:${props.course._id}`, color);
    return color;
  };

  const randomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const cardColorStyle = {
    backgroundColor:
      localStorage.getItem(`color:${props.course._id}`) ||
      generateCourseColor(),
  };

  return (
    <li className={style.coursecard} onClick={() => {
      navigate(`/course/${props.course._id}`);
    }}>
      <div className={style.coursecardheader} style={cardColorStyle}></div>
      <p className={style.coursename}>{props.course.name}</p>
      <p className={style.coursesemester}>{getSemester()}</p>
      <div className={style.buttoncontainer}>
        <img
          src={AnnouncementLogo}
          className={style.icon}
          alt="Announcements"
          onClick={() => {
            navigate(`/course/${props.course._id}/announcements`);
          }}
        />
        <img
          src={AssignmentLogo}
          className={style.icon}
          alt="Assignments"
          onClick={() => {
            navigate(`/course/${props.course._id}/assignments`);
          }}
        />
        <img
          src={FileLogo}
          className={style.icon}
          alt="Files"
          onClick={() => {
            navigate(`/course/${props.course._id}/files`);
          }}
        />
      </div>
    </li>
  );
}

CourseCard.propTypes = {
  course: PropTypes.shape({
    name: PropTypes.string.isRequired,
    creationDate: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired,
  }),
};

export default CourseCard;
