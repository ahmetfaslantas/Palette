import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import Navbar from "@components/navbar/Navbar.jsx";
import SubmissionFile from "@components/submissionfile/SubmissionFile.jsx";
import Title from "@components/title/Title.jsx";
import FileUpload from "@assets/fileupload.svg";
import style from "./AssignmentDetails.module.css";

function AssignmentDetails() {
  const [assignment, setAssignment] = useState({
    name: "",
    description: "",
    files: [],
    dueDate: "",
    maxPoints: 0,
  });

  const [submissionFiles, setSubmissionFiles] = useState([]);

  const { courseId, assignmentId } = useParams();
  const onDrop = useCallback((acceptedFiles) => {
    setSubmissionFiles((submissionFiles) => [
      ...submissionFiles,
      ...acceptedFiles,
    ]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  useEffect(() => {
    async function getAssignment() {
      let result = await fetch(
        `${process.env.API_URL}/api/course/${courseId}/assignment/${assignmentId}/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          redirect: "follow",
        }
      );
      let json = await result.json();

      setAssignment(json);
    }

    getAssignment();
  }, []);

  const submitAssignment = async () => {
    const formData = new FormData();
    submissionFiles.forEach((file) => {
      formData.append("files", file);
    });

    await fetch(
      `${process.env.API_URL}/api/course/${courseId}/assignment/${assignmentId}/submit/`,
      {
        method: "POST",
        body: formData,
        credentials: "include",
        redirect: "follow",
      }
    );
  };

  return (
    <div className={style.main}>
      <Navbar />
      <div className={style.page}>
        <Title title="Submission" />
        <div className={style.assignment}>
          <div className={style.assignmentheader}>
            <p className={style.title}>{assignment.name}</p>
            <p className={style.maxpoints}>
              {assignment.maxPoints} Possible Points
            </p>
            <button
              style={
                submissionFiles.length > 0
                  ? { backgroundColor: "#5f9cc2" }
                  : { backgroundColor: "lightgrey" }
              }
              className={style.submit}
              onClick={submitAssignment}
            >
              Submit
            </button>
          </div>
          <div className={style.assignmentbody}>
            <p className={style.description}>{assignment.description}</p>
            <p className={style.duedate}>Due Date: {
              new Date(assignment.dueDate).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
              })
            }</p>
          </div>

          <div className={style.upload}>
            <div {...getRootProps()} className={style.files}>
              <img src={FileUpload} alt="File Upload" />
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the files here ...</p>
              ) : (
                <p>Drag &apos;n&apos; drop some files here.</p>
              )}
            </div>
            {submissionFiles.length > 0 && (
              <ul className={style.filelist}>
                {submissionFiles.map((file) => (
                  <SubmissionFile
                    file={file.name}
                    onDelete={() => {
                      setSubmissionFiles((submissionFiles) =>
                        submissionFiles.filter((f) => f.name !== file.name)
                      );
                    }}
                    key={file.name}
                  />
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssignmentDetails;
