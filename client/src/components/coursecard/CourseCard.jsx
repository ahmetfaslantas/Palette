import style from "./CourseCard.module.css";
import AnnouncementLogo from "../../assets/announcement.svg";
import AssignmentLogo from "../../assets/assignment.svg";
import FileLogo from "../../assets/file.svg";
import { useNavigate } from "react-router-dom";

function CourseCard(props) {
  let navigate = useNavigate();

  return (
    <li className={style.coursecard}>
      <div className={style.coursecardheader}></div>
      <p className={style.coursename}>{props.course.name}</p>
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

export default CourseCard;
