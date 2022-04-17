import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import Navbar from "@components/navbar/Navbar.jsx";
import Title from "@components/title/Title.jsx";
import style from "./Course.module.css";

function Course() {
  const [type, setType] = useState("");
  const navigate = useNavigate();
  const { courseId } = useParams();

  useEffect(() => {
    setType(Cookies.get("type"));
  }, []);

  return (
    <div className={style.main}>
      <Navbar />
      <div className={style.page}>
        <div className={style.controls}>
          <Title title="Course" />
          {type === "instructor" && (
            <button
              className={style.addstudent}
              onClick={() => {
                navigate(`/course/${courseId}/newstudent`);
              }}
            >
              Add Student
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Course;
