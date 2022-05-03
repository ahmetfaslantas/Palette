import { useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuth from "@hooks/useAuth.jsx";
import Toast from "@components/toast/Toast.jsx";
import Title from "@components/title/Title.jsx";
import Navbar from "@components/navbar/Navbar.jsx";
import CourseNavbar from "@components/coursenavbar/CourseNavbar.jsx";
import style from "./AddStudent.module.css";

function AddStudent() {
  useAuth();
  const studentEmail = useRef();
  const toast = useRef();

  const navigate = useNavigate();
  const { courseId } = useParams();

  const onSubmit = async (e) => {
    e.preventDefault();

    if (studentEmail.current.value === "") {
      toast.current.show("Please fill all fields!");
      return;
    }

    const res = await fetch(
      `${process.env.API_URL}/api/course/${courseId}/student/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: studentEmail.current.value,
        }),
        credentials: "include",
      }
    );

    if (res.status !== 200) {
      toast.current.show("Something went wrong!");
      return;
    }

    navigate(`/course/${courseId}/people`);
  };

  return (
    <div className={style.main}>
      <Navbar />
      <CourseNavbar />
      <div className={style.page}>
        <Title title="Add Student" />
        <form className={style.studentform} onSubmit={onSubmit}>
          <label className={style.operationlabel + " " + style.title}>
            <p>Add a New Student</p>
          </label>
          <input
            className={style.textbox}
            type="text"
            placeholder="Student Email"
            ref={studentEmail}
          />
          <button className={style.submit} type="submit">
            Add Student
          </button>
        </form>
      </div>
      <Toast ref={toast} />
    </div>
  );
}

export default AddStudent;
