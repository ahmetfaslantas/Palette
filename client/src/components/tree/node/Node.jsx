import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import Download from "@assets/download.svg";
import style from "./Node.module.css";

function Node(props) {
  const { item, level, toggleBranch } = props;
  const { courseId } = useParams();

  const downloadFile = async () => {
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
    <div className={style.entry} style={{ paddingLeft: `${level * 16}px` }}>
      {item.type === "folder" ? (
        <details className={style.expandable} onClick={toggleBranch}>
          <summary>{item.name}</summary>
        </details>
      ) : (
        <span className={style.nonexpandable}>
          {item.name}
          <img onClick={downloadFile} className={style.download} src={Download} alt="file" />
        </span>
      )}
    </div>
  );
}

Node.propTypes = {
  item: PropTypes.object.isRequired,
  level: PropTypes.number.isRequired,
  toggleBranch: PropTypes.func.isRequired,
};

export default Node;
