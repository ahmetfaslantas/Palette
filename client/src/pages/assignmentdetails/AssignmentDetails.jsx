import { useCallback, useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import useAuth from "@hooks/useAuth.jsx";
import useFetch from "@hooks/useFetch.jsx";
import Navbar from "@components/navbar/Navbar.jsx";
import CourseNavbar from "@components/coursenavbar/CourseNavbar.jsx";
import FileEntry from "@components/fileentry/FileEntry.jsx";
import Title from "@components/title/Title.jsx";
import Toast from "@components/toast/Toast.jsx";
import Spinner from "@components/spinner/Spinner.jsx";
import FileUpload from "@assets/fileupload.svg";
import style from "./AssignmentDetails.module.css";

function AssignmentDetails() {
  const toast = useRef();
  const navigate = useNavigate();
  const type = useAuth();

  const { courseId, assignmentId } = useParams();

  const {
    data: assignment,
    done,
    isError,
    fetchData: fetchAssignment,
  } = useFetch(`/api/course/${courseId}/assignment/${assignmentId}`);

  const {
    done: submissionDone,
    isError: submissionError,
    fetchData: submitSubmission,
  } = useFetch(
    `/api/course/${courseId}/assignment/${assignmentId}/submit`,
    {
      method: "POST",
    }
  );

  const [submissionFiles, setSubmissionFiles] = useState([]);

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
    fetchAssignment();
  }, []);

  useEffect(() => {
    if (isError) {
      toast.current.show("Error fetching assignment details");
    }
  }, [isError]);

  const submitAssignment = async () => {
    const formData = new FormData();
    submissionFiles.forEach((file) => {
      formData.append("files", file);
    });

    const uploadRes = await fetch(
      `${process.env.API_URL}/api/files/user/upload`,
      {
        method: "POST",
        body: formData,
        credentials: "include",
        redirect: "follow",
      }
    );

    if (uploadRes.status !== 200) {
      toast.current.show("Error uploading files!");
      return;
    }

    const uploadJson = await uploadRes.json();

    submitSubmission({
      files: uploadJson.files,
    });
  };

  useEffect(() => {
    if (submissionDone) {
      navigate(0);
    }
  }, [submissionDone]);

  useEffect(() => {
    if (submissionError) {
      toast.current.show("Error submitting assignment");
    }
  }, [submissionError]);

  return (
    <div className={style.main}>
      <Navbar />
      <CourseNavbar />
      <div className={style.page}>
        <div className={style.controls}>
          <Title title="Submission" />
          {type === "instructor" && (
            <button
              className={style.submit}
              onClick={() => {
                navigate(
                  `/course/${courseId}/assignment/${assignmentId}/grade`
                );
              }}
            >
              Grade
            </button>
          )}
        </div>
        {done ? (
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
        ) : (
          <Spinner />
        )}
      </div>
      <Toast ref={toast} />
    </div>
  );
}

export default AssignmentDetails;
