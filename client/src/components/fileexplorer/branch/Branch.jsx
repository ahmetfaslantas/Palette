import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Folder from "../folder/Folder.jsx";

function Branch(props) {
  const { item, level, openId, selectFolder } = props;
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!item.children) return;

    const filter = (arr) => {
      return arr.reduce((acc, curr) => {
        if (curr.id === openId) {
          acc.push(curr);
        } else if (curr.children) {
          acc = acc.concat(filter(curr.children));
        }
        return acc;
      }, []);
    };

    const shouldExpand = filter(item.children).length > 0;

    if (shouldExpand || item.id === openId) {
      setExpanded(true);
    } else {
      setExpanded(false);
    }
  }, [openId]);

  const renderChildren = () => {
    if (item.children && item.children.length > 0) {
      return (
        <div>
          {item.children.map((child, index) => {
            return (
              <Branch
                key={index}
                item={child}
                level={level + 1}
                selectFolder={selectFolder}
                openId={openId}
              />
            );
          })}
        </div>
      );
    }

    return null;
  };

  return (
    <div>
      {item.type === "folder" && (
        <Folder
          item={item}
          level={level}
          toggleBranch={() => {
            if (!expanded) {
              selectFolder(item);
            }
            setExpanded(!expanded);
          }}
        />
      )}

      {expanded && renderChildren()}
    </div>
  );
}

Branch.propTypes = {
  item: PropTypes.object.isRequired,
  level: PropTypes.number.isRequired,
  openId: PropTypes.string.isRequired,
  selectFolder: PropTypes.func.isRequired,
};

export default Branch;
