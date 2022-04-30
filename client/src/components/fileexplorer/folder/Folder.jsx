import PropTypes from "prop-types";
import FolderLogo from "@assets/folder.svg";
import style from "./Folder.module.css";

function Folder(props) {
  const { item, level, toggleBranch } = props;

  return (
    <div className={style.entry} style={{ paddingLeft: `${level * 16}px` }}>
      <details className={style.expandable} onClick={toggleBranch}>
        <summary>
          <img src={FolderLogo} alt="Folder Logo" className={style.logo} />
          {item.name}
        </summary>
      </details>
    </div>
  );
}

Folder.propTypes = {
  item: PropTypes.object.isRequired,
  level: PropTypes.number.isRequired,
  toggleBranch: PropTypes.func.isRequired,
};

export default Folder;
