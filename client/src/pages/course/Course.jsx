import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAuth from "@hooks/useAuth.jsx";
import Navbar from "@components/navbar/Navbar.jsx";
import CourseNavbar from "@components/coursenavbar/CourseNavbar.jsx";
import Title from "@components/title/Title.jsx";
import Toast from "@components/toast/Toast.jsx";
import Clock from "@assets/clock.svg";
import Done from "@assets/done.svg";
import style from "./Course.module.css";

function Course() {
  useAuth();
  const { courseId } = useParams();
  const [course, setCourse] = useState({
    doneAssignments: [],
    upcomingAssignments: [],
    newAnnouncements: [],
  });
  const toast = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCourse() {
      const response = await fetch(
        `${process.env.API_URL}/api/course/${courseId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (response.status !== 200) {
        toast.current.show("Error fetching course");
        return;
      }

      const data = await response.json();

      setCourse(data);
    }

    fetchCourse();
  }, []);

  return (
    <div className={style.main}>
      <Navbar />
      <CourseNavbar />
      <div className={style.page}>
        <Title title="Course" />
        <table className={style.summary}>
          <thead>
            <tr>
              <th colSpan={3}>Upcoming Assignments</th>
            </tr>
          </thead>
          <tbody>
            {course.doneAssignments.map((assignment) => (
              <tr key={assignment._id} onClick={() => {
                navigate(`/course/${courseId}/assignment/${assignment._id}`);
              }}>
                <td>
                  <img className={style.icon} src={Done} alt="Done" />
                  {assignment.name}
                </td>
                <td>{
                  new Date(assignment.dueDate).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                    }
                  )
                }</td>
                <td>{assignment.maxPoints}</td>
              </tr>
            ))}
            {course.upcomingAssignments.map((assignment) => (
              <tr key={assignment._id} onClick={() => {
                navigate(`/course/${courseId}/assignment/${assignment._id}`);
              }}>
                <td>
                  <img className={style.icon} src={Clock} alt="Clock" />
                  {assignment.name}
                </td>
                <td>{
                  new Date(assignment.dueDate).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                    }
                  )
                }</td>
                <td>{assignment.maxPoints}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <table className={style.summary}>
          <thead>
            <tr>
              <th colSpan={2}>New Announcements</th>
            </tr>
          </thead>
          <tbody>
            {course.newAnnouncements.map((announcement) => (
              <tr key={announcement._id} onClick={() => {
                navigate(`/course/${courseId}/announcement/${announcement._id}`);
              }}>
                <td>{announcement.title}</td>
                <td>{
                  new Date(announcement.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                  })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Toast ref={toast} />
    </div>
  );
}

export default Course;
