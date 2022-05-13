import PropTypes from "prop-types";
import DownloadLogo from "@assets/download.svg";
import style from "./GradeEntry.module.css";
import { useRef } from "react";

function GradeEntry(props) {
  const { submitter, studentId, files } = props.entry;
  const { maxPoints, setGrade } = props;
  const grade = useRef();

  const downloadSubmission = () => {
    files.forEach(async (file) => {
      const result = await fetch(
        `${process.env.API_URL}/api/files/user/${studentId}/${file}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          redirect: "follow",
        }
      );

      const blob = await result.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", file);

      document.body.appendChild(link);
      link.click();

      window.URL.revokeObjectURL(url);
      link.remove();
    });
  };

  return (
    <li className={style.entry}>
      <p>{submitter}</p>
      <img
        src={DownloadLogo}
        alt="Download Submission"
        onClick={downloadSubmission}
      />
      <input
        type="number"
        ref={grade}
        placeholder="Grade"
        max={maxPoints}
        min={0}
        onChange={(e) => {
          if (e.target.value > maxPoints) {
            e.target.value = maxPoints;
          }

          setGrade(studentId, parseInt(e.target.value));
        }}
      />
    </li>
  );
}

GradeEntry.propTypes = {
  entry: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    studentId: PropTypes.string.isRequired,
    submitter: PropTypes.string.isRequired,
    files: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  maxPoints: PropTypes.number.isRequired,
  setGrade: PropTypes.func.isRequired,
};

export default GradeEntry;
