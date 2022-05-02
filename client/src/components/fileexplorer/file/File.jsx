import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import FileLogo from "@assets/file.svg";
import style from "./File.module.css";

function File(props) {
  const { item } = props;
  const { courseId } = useParams();

  const downloadFile = async (item) => {
    const result = await fetch(
      `${process.env.API_URL}/api/files/course/${courseId}/${item.path}`,
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
    link.setAttribute("download", item.name);
    
    document.body.appendChild(link);
    link.click();

    window.URL.revokeObjectURL(url);
    link.remove();
  };

  return ( 
    <div className={style.file} onClick={
      () => downloadFile(item)
    }>
      <img className={style.fileicon} src={FileLogo} alt="File Icon" />
      {item.name.substring(0, 8)}
    </div>
  );
}

File.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    children: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
};

export default File;