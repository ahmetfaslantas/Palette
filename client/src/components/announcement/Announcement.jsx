import { useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import AnnouncementLogo from "@assets/announcement.svg";
import style from "./Announcement.module.css";

function Announcement(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const { announcement } = props;
  const course = location.pathname.split("/")[2];
  
  return ( 
    <li
      className={style.announcemententry}
      onClick={() => {
        navigate(`/course/${course}/announcement/${announcement._id}`);
      }}
    >
      <div className={style.announcementcontainer}>
        <img
          className={style.announcementlogo}
          src={AnnouncementLogo}
          alt="Announcement"
        />
        <div className={style.announcementdetails}>
          <p className={style.title}>{announcement.title}</p>
          <p className={style.content}>{announcement.content}</p>
          <p className={style.date}>
            {new Date(announcement.date).toLocaleDateString(
              "en-US",
              {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
              }
            )}
          </p>
        </div>
      </div>
    </li>
  );
}

Announcement.propTypes = {
  announcement: PropTypes.shape({
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired,
    publisher: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    files: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};


export default Announcement;