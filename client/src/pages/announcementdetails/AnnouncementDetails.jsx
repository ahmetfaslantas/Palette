import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAuth from "@hooks/useAuth.jsx";
import useFetch from "@hooks/useFetch.jsx";
import Navbar from "@components/navbar/Navbar.jsx";
import CourseNavbar from "@components/coursenavbar/CourseNavbar.jsx";
import Title from "@components/title/Title.jsx";
import Toast from "@components/toast/Toast.jsx";
import Spinner from "@components/spinner/Spinner.jsx";
import Comment from "@components/comment/Comment.jsx";
import style from "./AnnouncementDetails.module.css";

function AnnouncementDetails() {
  useAuth();
  const comment = useRef();
  const toast = useRef();
  const { courseId, announcementId } = useParams();

  const {
    data: announcement,
    done,
    isError,
    fetchData: fetchAnnouncement,
  } = useFetch(`/api/course/${courseId}/announcement/${announcementId}`);

  const {
    data: comments,
    isError: commentsIsError,
    fetchData: fetchSubmitComment,
    isLoading: isSubmitCommentLoading,
  } = useFetch(`/api/course/${courseId}/announcement/${announcementId}/comment`, {
    method: "POST",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchAnnouncement();
  }, []);

  useEffect(() => {
    if (isError) {
      toast.current.show("Error fetching announcement details");
    }
  }, [isError]);

  const submitComment = async () => {
    if (!comment.current.value) {
      toast.current.show("Comment cannot be empty");
      return;
    }

    if (comment.current.value.length > 1000) {
      toast.current.show("Comment cannot be more than 1000 characters");
      return;
    }

    fetchSubmitComment({
      content: comment.current.value,
    });
  };

  useEffect(() => {
    if (commentsIsError) {
      toast.current.show("Error submitting comment");
    }
  }, [commentsIsError]);

  useEffect(() => {
    if (comments) {
      navigate(0);
    }
  }, [comments]);

  return (
    <div className={style.main}>
      <Navbar />
      <CourseNavbar />
      <div className={style.page}>
        <Title title="Announcement Details" />
        {done ? (
          <div className={style.announcement}>
            <h3 className={style.title}>{announcement.title}</h3>
            <p className={style.publisher}>{announcement.publisher}</p>
            <p className={style.content}>{announcement.content}</p>
            <hr />
            <div className={style.commentcontrol}>
              <textarea ref={comment} />
              <button onClick={submitComment}>Submit Comment</button>
            </div>
            {isSubmitCommentLoading && <Spinner />}
            {announcement.comments.length > 0 && (
              <div className={style.comments}>
                <h3>Comments</h3>
                <ul>
                  {announcement.comments.map((comment) => (
                    <Comment comment={comment} key={comment._id} />
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <Spinner />
        )}
      </div>
      <Toast ref={toast} />
    </div>
  );
}

export default AnnouncementDetails;
