import { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuth from "@hooks/useAuth.jsx";
import useFetch from "@hooks/useFetch.jsx";
import Navbar from "@components/navbar/Navbar.jsx";
import CourseNavbar from "@components/coursenavbar/CourseNavbar.jsx";
import Title from "@components/title/Title.jsx";
import Spinner from "@components/spinner/Spinner.jsx";
import Announcement from "@components/announcement/Announcement.jsx";
import Toast from "@components/toast/Toast.jsx";
import AnnouncementLogo from "@assets/announcement.svg";
import style from "./Announcements.module.css";

function Announcements() {
  const type = useAuth();
  const toast = useRef();

  const { courseId } = useParams();

  const {
    data: announcements,
    isLoading,
    isError,
    fetchData: fetchAnnouncements,
  } = useFetch(`/api/course/${courseId}/announcement`);

  const navigate = useNavigate();

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  useEffect(() => {
    if (isError) {
      toast.current.show("Error fetching announcements");
    }
  }, [isError]);

  return (
    <div className={style.main}>
      <Navbar />
      <CourseNavbar />
      <div className={style.page}>
        <div className={style.controls}>
          <Title title="Announcements" />
          {type === "instructor" && (
            <button
              className={style.addannouncement}
              onClick={() => {
                navigate(`/course/${courseId}/announcements/new`);
              }}
            >
              Add Announcement
            </button>
          )}
        </div>
        {isLoading ? (
          <Spinner />
        ) : announcements.length === 0 ? (
          <div className={style.noannouncements}>
            <img
              src={AnnouncementLogo}
              alt="Announcement Logo"
              className={style.noannouncementslogo}
            />
            <p>No announcements yet!</p>
          </div>
        ) : (
          <ul className={style.announcementcontainer}>
            {announcements.map((announcement) => (
              <Announcement
                key={announcement._id}
                announcement={announcement}
              />
            ))}
          </ul>
        )}
      </div>
      <Toast ref={toast} />
    </div>
  );
}

export default Announcements;
