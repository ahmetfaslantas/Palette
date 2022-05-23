import { useParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import useAuth from "@hooks/useAuth.jsx";
import useFetch from "@hooks/useFetch.jsx";
import Title from "@components/title/Title.jsx";
import Toast from "@components/toast/Toast.jsx";
import Navbar from "@components/navbar/Navbar.jsx";
import CourseNavbar from "@components/coursenavbar/CourseNavbar.jsx";
import FileExplorer from "@components/fileexplorer/FileExplorer.jsx";
import Spinner from "@components/spinner/Spinner.jsx";
import style from "./CourseFiles.module.css";

function CourseFiles() {
  useAuth();
  const { courseId } = useParams();
  const toast = useRef();

  const {
    data: files,
    done,
    isError,
    fetchData: fetchFiles,
  } = useFetch(`/api/files/course/${courseId}`);

  useEffect(() => {
    fetchFiles();
  }, []);

  useEffect(() => {
    if (isError) {
      toast.current.show("Error fetching files");
    }
  }, [isError]);

  return (
    <div className={style.main}>
      <Navbar />
      <CourseNavbar />
      <div className={style.page}>
        <Title title="Course Files" />
        {done ? (
          <div className={style.files}>
            <FileExplorer data={files} />
          </div>
        ) : (
          <Spinner />
        )}
      </div>
      <Toast ref={toast} />
    </div>
  );
}

export default CourseFiles;
