import PropTypes from "prop-types";
import style from "./SubmissionFile.module.css";
import Delete from "../../assets/delete.svg";

function SubmissionFile(props) {
  const { file, onDelete } = props;

  return (
    <li className={style.fileitem}>
      <p>{file}</p>
      <img src={Delete} alt="delete" className={style.delete} onClick={onDelete} />
    </li>
  );
}

SubmissionFile.propTypes = {
  file: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default SubmissionFile;
