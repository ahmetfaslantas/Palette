import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import PropTypes from "prop-types";
import FolderLogo from "@assets/folder.svg";
import UploadLogo from "@assets/upload.svg";
import NewFolderLogo from "@assets/newfolder.svg";
import style from "./Folder.module.css";

function Folder(props) {
  const { item, level, toggleBranch } = props;
  const fileInput = useRef(null);
  const [type, setType] = useState("");

  const { courseId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    setType(Cookies.get("type"));
  }, []);

  const upload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("files", file);

    await fetch(
      `${process.env.API_URL}/api/files/course/${courseId}/upload/${item.path}`,
      {
        method: "POST",
        body: formData,
        credentials: "include",
      }
    );

    navigate(0);
  };

  const createFolder = async (folderName) => {
    await fetch(
      `${process.env.API_URL}/api/files/course/${courseId}/newfolder/${item.path}/${folderName}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    navigate(0);
  };

  return (
    <div className={style.entry} style={{ paddingLeft: `${level * 16}px` }}>
      <details className={style.expandable} onClick={toggleBranch}>
        <summary>
          <img src={FolderLogo} alt="Folder Logo" className={style.logo} />
          {item.name}
        </summary>
      </details>
      {type === "instructor" && (
        <div>
          <input
            type="file"
            ref={fileInput}
            className={style.fileinput}
            onChange={upload}
          />
          <img
            src={UploadLogo}
            alt="Upload Icon"
            className={style.logo}
            onClick={() => {
              fileInput.current.click();
            }}
          />
          <img
            src={NewFolderLogo}
            alt="Upload Icon"
            className={style.logo}
            onClick={() => {
              const res = prompt("Enter folder name");
              if (res) createFolder(res);
            }}
          />
        </div>
      )}
    </div>
  );
}

Folder.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    children: PropTypes.arrayOf(PropTypes.object),
    path: PropTypes.string.isRequired,
  }).isRequired,
  level: PropTypes.number.isRequired,
  toggleBranch: PropTypes.func.isRequired,
};

export default Folder;
