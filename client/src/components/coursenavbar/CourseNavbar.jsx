import { useParams, useNavigate } from "react-router-dom";
import FolderLogo from "@assets/folder.svg";
import AnnouncementLogo from "@assets/announcement.svg";
import AssignmentsLogo from "@assets/assignment.svg";
import PeopleLogo from "@assets/people.svg";
import CourseLogo from "@assets/courses.svg";
import style from "./CourseNavbar.module.css";

function CourseNavbar() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const courseName = localStorage.getItem(`${courseId}:name`);

  return (
    <div className={style.coursenavbar}>
      <p className={style.title}>
        {courseName}
      </p>
      <ul className={style.list}>
        <li className={style.item} onClick={() => {
          navigate(`/course/${courseId}`);
        }}>
          <img src={CourseLogo} alt="" />
          <p>Course</p>
        </li>
        <li className={style.item} onClick={() => {
          navigate(`/course/${courseId}/announcements`);
        }}>
          <img src={AnnouncementLogo} alt="Announcements" />
          <p>Announcements</p>
        </li>
        <li className={style.item} onClick={() => {
          navigate(`/course/${courseId}/assignments`);
        }}>
          <img src={AssignmentsLogo} alt="Assignments" />
          <p>Assignments</p>
        </li>
        <li className={style.item} onClick={() => {
          navigate(`/course/${courseId}/files`);
        }}>
          <img src={FolderLogo} alt="Files" />
          <p>Files</p>
        </li>
        <li className={style.item} onClick={() => {
          navigate(`/course/${courseId}/people`);
        }}>
          <img src={PeopleLogo} alt="People" />
          <p>People</p>
        </li>
      </ul>
    </div>
  );
}

export default CourseNavbar;
