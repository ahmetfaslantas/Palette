import PropTypes from "prop-types";
import style from "./SubmissionFile.module.css";

function SubmissionFile(props) {
  const { file } = props;

  return (
    <div className={style.main}>
      <p>{file}</p>
    </div>
  );
}

SubmissionFile.propTypes = {
  file: PropTypes.string.isRequired,
};

export default SubmissionFile;
