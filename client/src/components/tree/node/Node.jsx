import PropTypes from "prop-types";
import Download from "@assets/download.svg";
import style from "./Node.module.css";

function Node(props) {
  const { item, level, toggleBranch } = props;

  return ( 
    <div className={style.entry} style={{paddingLeft: `${level * 16}px`}}>
      {
        item.type === "folder" ? (
          <details className={style.expandable} onClick={toggleBranch}>
            <summary>
              {item.name}
            </summary>
          </details>
        ) : (
          <span className={style.nonexpandable}>
            {item.name}
            <img className={style.download} src={Download} alt="file" />
          </span>
        )
      }
    </div>
  );
}

Node.propTypes = {
  item: PropTypes.object.isRequired,
  level: PropTypes.number.isRequired,
  toggleBranch: PropTypes.func.isRequired,
};

export default Node;