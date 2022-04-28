import { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@components/navbar/Navbar.jsx";
import Title from "@components/title/Title.jsx";
import Toast from "@components/toast/Toast.jsx";
import style from "./AnnouncementDetails.module.css";

function AnnouncementDetails() {
  const toast = useRef();
  const [announcement, setAnnouncement] = useState({
    title: "",
    content: "",
    date: "",
    publisher: "",
  });

  const { courseId, announcementId } = useParams();

  useEffect(() => {
    async function getAnnouncement() {
      let result = await fetch(
        `${process.env.API_URL}/api/course/${courseId}/announcement/${announcementId}/`,
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
        toast.current.show("Error getting announcement");
        return;
      }

      let json = await result.json();

      setAnnouncement(json);
    }

    getAnnouncement();
  }, []);


  return (
    <div className={style.main}>
      <Navbar />
      <div className={style.page}>
        <Title title="Announcement Details" />
        <div className={style.announcement}>
          <h3 className={style.announcementtitle}>{announcement.title}</h3>
          <p className={style.announcementpublisher}>{announcement.publisher}</p>
          <p className={style.announcementcontent}>{announcement.content}</p>
        </div>
      </div>
      <Toast ref={toast} />
    </div>

  );
}

export default AnnouncementDetails;
