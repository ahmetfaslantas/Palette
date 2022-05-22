import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "@hooks/useAuth.jsx";
import useFetch from "@hooks/useFetch.jsx";
import Title from "@components/title/Title.jsx";
import Navbar from "@components/navbar/Navbar.jsx";
import Toast from "@components/toast/Toast.jsx";
import Spinner from "@components/spinner/Spinner.jsx";
import style from "./AddCourse.module.css";

function AddCourse() {
  useAuth();
  const courseName = useRef();
  const courseDescription = useRef();
  const toast = useRef();

  const {
    data: result,
    isLoading,
    isError,
    fetchData: submitCourse,
  } = useFetch("/api/course/newcourse", {
    method: "POST",
  });

  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();

    if (courseName.current.value === "" || courseDescription.current.value === "") {
      toast.current.show("Please fill all fields!");
      return;
    }

    submitCourse({
      name: courseName.current.value,
      description: courseDescription.current.value,
    });
  };

  useEffect(() => {
    if (isError) {
      toast.current.show("Error submitting course");
    }
  }, [isError]);

  useEffect(() => {
    if (result) {
      navigate("/dashboard");
    }
  }, [result]);

  return (
    <div className={style.main}>
      <Navbar />
      <div className={style.page}>
        <Title title="Add Course" />
        <form onSubmit={onSubmit} className={style.courseform}>
          <label className={style.operationlabel + " " + style.title}>
            <p>Add a New Course</p>
          </label>
          <input
            className={style.textbox}
            type="text"
            placeholder="Course Name"
            ref={courseName}
          />
          <input
            className={style.textbox}
            type="text"
            placeholder="Course Description"
            ref={courseDescription}
          />
          <button className={style.submit} type="submit">
            Create Course
          </button>
          {isLoading && <Spinner />}
        </form>
      </div>
      <Toast ref={toast} />
    </div>
  );
}

export default AddCourse;
