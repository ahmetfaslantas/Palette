import { useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuth from "@hooks/useAuth.jsx";
import useFetch from "@hooks/useFetch.jsx";
import Toast from "@components/toast/Toast.jsx";
import Title from "@components/title/Title.jsx";
import Navbar from "@components/navbar/Navbar.jsx";
import CourseNavbar from "@components/coursenavbar/CourseNavbar.jsx";
import Spinner from "@components/spinner/Spinner.jsx";
import style from "./AddAnnouncement.module.css";

// TODO: Add file upload functionality.
function AddAnnouncement() {
  useAuth();
  const { courseId } = useParams();

  const announcementTitle = useRef();
  const announcementContent = useRef();
  const toast = useRef();

  const navigate = useNavigate();

  const {
    data: result,
    isLoading,
    isError,
    fetchData: submitAnnouncement,
  } = useFetch(`/api/course/${courseId}/announcement`, {
    method: "POST",
  });

  const onSubmit = async (e) => {
    e.preventDefault();

    if (
      announcementTitle.current.value === "" ||
      announcementContent.current.value === ""
    ) {
      toast.current.show("Please fill all fields!");
      return;
    }

    submitAnnouncement({
      title: announcementTitle.current.value,
      content: announcementContent.current.value,
    });
  };

  useEffect(() => {
    if (isError) {
      toast.current.show("Error submitting announcement");
    }
  }, [isError]);

  useEffect(() => {
    if (result) {
      navigate(`/course/${courseId}/announcements/`);
    }
  }, [result]);

  return (
    <div className={style.main}>
      <Navbar />
      <CourseNavbar />
      <div className={style.page}>
        <Title title="Add Announcement" />
        <form className={style.announcementform} onSubmit={onSubmit}>
          <label className={style.operationlabel + " " + style.title}>
            <p>Add a New Announcement</p>
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
          {isLoading && <Spinner />}
        </form>
      </div>
      <Toast ref={toast} />
    </div>
  );
}

export default AddAnnouncement;
