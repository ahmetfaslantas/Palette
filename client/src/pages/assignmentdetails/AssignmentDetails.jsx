import { useCallback, useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import Navbar from "@components/navbar/Navbar.jsx";
import FileEntry from "@components/fileentry/FileEntry.jsx";
import Title from "@components/title/Title.jsx";
import Toast from "@components/toast/Toast.jsx";
import FileUpload from "@assets/fileupload.svg";
import style from "./AssignmentDetails.module.css";

function AssignmentDetails() {
  const toast = useRef();
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState({
    name: "",
    description: "",
    files: [],
    dueDate: "",
    maxPoints: 0,
    submission: {
      files: [],
      grade: 0,
      comments: "",
      submissionDate: "",
    },
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

      if (result.status !== 200) {
        toast.current.show("Error loading assignment");
        return;
      }

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

    const uploadRes = await fetch(`${process.env.API_URL}/api/files/user/upload`, {
      method: "POST",
      body: formData,
      credentials: "include",
      redirect: "follow",
    });

    if (uploadRes.status !== 200) {
      toast.current.show("Error uploading files!");
      return;
    }

    const uploadJson = await uploadRes.json();

    const submitRes = await fetch(
      `${process.env.API_URL}/api/course/${courseId}/assignment/${assignmentId}/submit`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        redirect: "follow",
        body: JSON.stringify({
          files: uploadJson.files,
        }),
      }
    );

    if (submitRes.status !== 200) {
      toast.current.show("Error submitting assignment!");
      return;
    }

    navigate(0);
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
            <p className={style.duedate}>
              Due Date:{" "}
              {new Date(assignment.dueDate).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
              })}
            </p>
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
                  <FileEntry
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
      <Toast ref={toast} />
    </div>
  );
}

export default AssignmentDetails;
