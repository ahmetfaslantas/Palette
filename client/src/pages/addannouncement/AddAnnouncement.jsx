import { useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Toast from "@components/toast/Toast.jsx";
import Title from "@components/title/Title.jsx";
import Navbar from "@components/navbar/Navbar.jsx";
import style from "./AddAnnouncement.module.css";

// TODO: Add file upload functionality.
function AddAnnouncement() {
  const announcementTitle = useRef();
  const announcementContent = useRef();
  const toast = useRef();

  const navigate = useNavigate();

  const { courseId } = useParams();

  const onSubmit = async (e) => {
    e.preventDefault();

    if (
      announcementTitle.current.value === "" ||
      announcementContent.current.value === ""
    ) {
      toast.current.show("Please fill all fields!");
      return;
    }

    const res = await fetch(
      `${process.env.API_URL}/api/course/${courseId}/announcement/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: announcementTitle.current.value,
          content: announcementContent.current.value,
        }),
        credentials: "include",
      }
    );

    if (res.status !== 200) {
      toast.current.show("Something went wrong!");
      return;
    }

    navigate(`/courses/${courseId}/announcements/`);
  };

  return (
    <div className={style.main}>
      <Navbar />
      <div className={style.page}>
        <Title title="Add Announcement" />
        <form className={style.announcementform} onSubmit={onSubmit}>
          <label className={style.operationlabel + " " + style.title}>
            <p>Add a New Course</p>
          </label>
          <input
            className={style.textbox}
            type="text"
            placeholder="Announcement Title"
            ref={announcementTitle}
          />
          <textarea
            className={style.textareacontent}
            type="text"
            placeholder="Announcement Content"
            ref={announcementContent}
          />
          <button className={style.submit} type="submit">
            Publish Announcement
          </button>
        </form>
      </div>
      <Toast ref={toast} />
    </div>
  );
}

export default AddAnnouncement;
