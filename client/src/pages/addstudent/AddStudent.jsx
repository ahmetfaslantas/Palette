import { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuth from "@hooks/useAuth.jsx";
import useFetch from "@hooks/useFetch.jsx";
import Toast from "@components/toast/Toast.jsx";
import Title from "@components/title/Title.jsx";
import Navbar from "@components/navbar/Navbar.jsx";
import CourseNavbar from "@components/coursenavbar/CourseNavbar.jsx";
import Spinner from "@components/spinner/Spinner.jsx";
import style from "./AddStudent.module.css";

function AddStudent() {
  useAuth();
  const { courseId } = useParams();
  const studentEmail = useRef();
  const toast = useRef();

  const {
    data: result,
    isLoading,
    isError,
    fetchData: submitStudent,
  } = useFetch(`/api/course/${courseId}/student`, {
    method: "POST",
  });

  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();

    if (studentEmail.current.value === "") {
      toast.current.show("Please fill all fields!");
      return;
    }

    submitStudent({
      email: studentEmail.current.value,
    });
  };

  useEffect(() => {
    if (isError) {
      toast.current.show("Error submitting student");
    }
  }, [isError]);

  useEffect(() => {
    if (result) {
      navigate(`/course/${courseId}/people`);
    }
  }, [result]);

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
          {isLoading && <Spinner />}
        </form>
      </div>
      <Toast ref={toast} />
    </div>
  );
}

export default AddStudent;
