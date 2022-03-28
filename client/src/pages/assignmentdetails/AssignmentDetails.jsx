import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import Navbar from "../../components/navbar/Navbar.jsx";
import SubmissionFile from "../../components/submissionfile/SubmissionFile.jsx";
import Title from "../../components/title/Title.jsx";
import FileUpload from "../../assets/fileupload.svg";
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
    setSubmissionFiles(submissionFiles => [...submissionFiles, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  useEffect(() => {
    async function getAssignment() {
      let result = await fetch(
        `http://localhost:4000/api/course/${courseId}/assignment/${assignmentId}/`,
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
              className={style.submit}
              onClick={() => {
                // TODO: submit assignment
              }}
            >
              Submit
            </button>
          </div>
          <div className={style.assignmentbody}>
            <p className={style.description}>{assignment.description}</p>
            <p className={style.duedate}>Due Date: {assignment.dueDate}</p>
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
          </div>
          <div>
            {submissionFiles.map((file) => (
              <SubmissionFile file={file.name} key={file.name} />
            ))}

          </div>
        </div>
      </div>
    </div>
  );
}

export default AssignmentDetails;
