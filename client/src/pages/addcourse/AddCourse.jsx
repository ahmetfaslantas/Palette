import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Title from "@components/title/Title.jsx";
import Navbar from "@components/navbar/Navbar.jsx";
import style from "./AddCourse.module.css";

function AddCourse() {
  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");

  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();

    if (courseName === "" || courseDescription === "") {
      // TODO: use snackbar to show errors
      return;
    }

    await fetch(`${process.env.API_URL}/api/course/newcourse`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: courseName,
        description: courseDescription,
      }),
      credentials: "include",
      redirect: "follow",
    });

    navigate("/dashboard");
  };

  return (
    <div className={style.main}>
      <Navbar />
      <div className={style.page}>
        <Title title="Add Course" />
        <form onSubmit={onSubmit}>
          <label className={style.operationlabel}>
            <p>Add a New Course</p>
          </label>
          <input
            type="text"
            placeholder="Course Name"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Course Description"
            value={courseDescription}
            onChange={(e) => setCourseDescription(e.target.value)}
          />
          <button className={style.submit} type="submit">
            Create Course
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddCourse;
