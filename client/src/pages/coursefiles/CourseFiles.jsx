import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Title from "@components/title/Title.jsx";
import Toast from "@components/toast/Toast.jsx";
import Navbar from "@components/navbar/Navbar.jsx";
import Tree from "@components/tree/Tree.jsx";
import File from "@assets/file.svg";
import style from "./CourseFiles.module.css";

function CourseFiles() {
  const [files, setFiles] = useState([]);
  const { courseId } = useParams();
  const toast = useRef();

  useEffect(() => {
    async function getCourseFiles() {
      const response = await fetch(
        `${process.env.API_URL}/api/files/course/${courseId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (response.status !== 200) {
        toast.current.show("Error loading files");
        return;
      }

      const files = await response.json();

      setFiles(files);
    }

    getCourseFiles();
  }, []);

  return (
    <div className={style.main}>
      <Navbar />
      <div className={style.page}>
        <Title title="Course Files" />
        {files.length > 0 ? (
          <div className={style.files}>
            <Tree data={files} />
          </div>
        ) : (
          <div className={style.empty}>
            <img className={style.logo} src={File} alt="File" />
            <p>No files found</p>
          </div>
        )}
      </div>
      <Toast ref={toast} />
    </div>
  );
}

export default CourseFiles;
