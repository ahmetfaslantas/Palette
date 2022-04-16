import PropTypes from "prop-types";
import style from "./FileEntry.module.css";
import Delete from "@assets/delete.svg";

function FileEntry(props) {
  const { file, onDelete } = props;

  return (
    <li className={style.fileitem}>
      <p>{file}</p>
      <img src={Delete} alt="delete" className={style.delete} onClick={onDelete} />
    </li>
  );
}

FileEntry.propTypes = {
  file: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default FileEntry;
