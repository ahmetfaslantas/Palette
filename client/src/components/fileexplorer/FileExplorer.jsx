import PropTypes from "prop-types";
import { useState } from "react";
import Branch from "./branch/Branch.jsx";
import File from "./file/File.jsx";
import style from "./FileExplorer.module.css";

function FileExplorer(props) {
  const { data } = props;
  const [files, setFiles] = useState([]);
  const [openId, setOpenId] = useState("null");

  const selectFolder = (folder) => {
    setFiles(folder.children);
    setOpenId(folder.id);
  };

  return (
    <div className={style.tree}>
      <table>
        <tbody>
          <tr>
            <td>
              {data.map((item) => {
                if (item.children) {
                  return (
                    <Branch
                      key={item.id}
                      item={item}
                      className={style.branch}
                      level={0}
                      selectFolder={selectFolder}
                      openId={openId}
                    />
                  );
                }
              })}
            </td>

            <td>
              {files.map((file) => {
                if (file.type === "file") {
                  return (
                    <File
                      key={file.id}
                      item={file}
                      className={style.file}
                    />
                  );
                }
              })}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

FileExplorer.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      children: PropTypes.arrayOf(PropTypes.object),
      path: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default FileExplorer;