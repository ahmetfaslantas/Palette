import { useRef, useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@components/navbar/Navbar.jsx";
import Title from "@components/title/Title.jsx";
import Toast from "@components/toast/Toast.jsx";
import FileEntry from "@components/fileentry/FileEntry.jsx";
import style from "./AddAssignment.module.css";
import FileUpload from "@assets/fileupload.svg";

function AddAssignment() {
  const assignmentName = useRef();
  const assignmentDescription = useRef();
  const assignmentDueDate = useRef();
  const assignmentMaxPoints = useRef();
  const toast = useRef();

  const navigate = useNavigate();

  const { courseId } = useParams();

  const [assignmentFiles, setAssignmentFiles] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    setAssignmentFiles((assignmentFiles) => [
      ...assignmentFiles,
      ...acceptedFiles,
    ]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  const onSubmit = async (e) => {
    e.preventDefault();

    if (
      assignmentName.current.value === "" ||
      assignmentDescription.current.value === "" ||
      assignmentDueDate.current.value === "" ||
      assignmentMaxPoints.current.value === "" ||
      assignmentFiles.length === 0
    ) {
      toast.current.show("Please fill all fields!");
      return;
    }

    const formData = new FormData();

    assignmentFiles.forEach((file) => {
      formData.append("files", file);
    });

    const uploadRes = await fetch(
      `${process.env.API_URL}/api/files/course/${courseId}/upload/`,
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

    const newAssignmentRes = await fetch(
      `${process.env.API_URL}/api/course/${courseId}/assignment`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: assignmentName.current.value,
          description: assignmentDescription.current.value,
          dueDate: assignmentDueDate.current.value,
          maxPoints: assignmentMaxPoints.current.value,
          files: uploadJson.files,
        }),
        credentials: "include",
        redirect: "follow",
      });

    if (newAssignmentRes.status !== 200) {
      toast.current.show("Something went wrong!");
      return;
    }

    navigate(`/course/${courseId}/assignments`);
  };

  return ( 
    <div className={style.main}>
      <Navbar />
      <div className={style.page}>
        <Title title="Add Assignment" />
        <form onSubmit={onSubmit} className={style.assignmentform}>
          <label className={style.operationlabel + " " + style.title}>
            <p>Add a New Assignment</p>
          </label>
          <input
            className={style.textbox}
            type="text"
            placeholder="Assignment Name"
            ref={assignmentName}
          />
          <input
            className={style.textbox}
            type="text"
            placeholder="Assignment Description"
            ref={assignmentDescription}
          />
          <input
            className={style.textbox}
            type="datetime-local"
            placeholder="Assignment Due Date"
            ref={assignmentDueDate}
          />
          <input
            className={style.textbox}
            type="number"
            placeholder="Max Points"
            ref={assignmentMaxPoints}
          />

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
            {assignmentFiles.length > 0 && (
              <ul className={style.filelist}>
                {assignmentFiles.map((file) => (
                  <FileEntry
                    file={file.name}
                    onDelete={() => {
                      setAssignmentFiles((assignmentFiles) =>
                        assignmentFiles.filter((f) => f.name !== file.name)
                      );
                    }}
                    key={file.name}
                  />
                ))}
              </ul>
            )}
          </div>

          <button className={style.submit} type="submit">
            Create Assignment
          </button>
        </form>
      </div>
      <Toast ref={toast} />
    </div>
  );
}

export default AddAssignment;