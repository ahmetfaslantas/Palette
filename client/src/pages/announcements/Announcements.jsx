import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Navbar from "@components/navbar/Navbar.jsx";
import Title from "@components/title/Title.jsx";
import Announcement from "@components/announcement/Announcement.jsx";
import Toast from "@components/toast/Toast.jsx";
import AnnouncementLogo from "@assets/announcement.svg";
import style from "./Announcements.module.css";

function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [type, setType] = useState("");
  const toast = useRef();

  const { courseId } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    setType(Cookies.get("type"));
    async function getAnnouncements() {
      let result = await fetch(
        `${process.env.API_URL}/api/course/${courseId}/announcement`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          redirect: "follow",
        }
      );

      if (result.status !== 200) {
        toast.current.show("Something went wrong!");
        return;
      }

      let json = await result.json();
      setAnnouncements(json);
    }

    getAnnouncements();
  }, []);

  return ( 
    <div className={style.main}>
      <Navbar />
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
        {announcements.length === 0 ? (
          <div className={style.noannouncements}>
            <img src={AnnouncementLogo} alt="Announcement Logo" />
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