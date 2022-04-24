import { useState } from "react";
import PropTypes from "prop-types";
import Node from "../node/Node.jsx";

function Branch(props) {
  const { item, level } = props;
  const [isOpen, setIsOpen] = useState(false);

  const renderChildren = () => {
    if (item.children && item.children.length > 0) {
      return (
        <div>
          {item.children.map((child) => (
            <Branch key={child.id} item={child} level={level + 1} />
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div>
      <Node
        item={item}
        level={level}
        toggleBranch={() => {
          setIsOpen(!isOpen);
        }}
      />
      {isOpen && renderChildren()}
    </div>
  );
}

Branch.propTypes = {
  item: PropTypes.object.isRequired,
  level: PropTypes.number.isRequired,
};

export default Branch;
