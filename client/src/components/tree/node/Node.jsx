import PropTypes from "prop-types";

function Node(props) {
  const { item, level, toggleBranch } = props;

  return ( 
    <div style={{paddingLeft: `${level * 16}px`}}>
      {
        item.children && item.children.length > 0 ? (
          <details onClick={toggleBranch}>
            <summary>
              {item.name}
            </summary>
          </details>
        ) : (
          <span>
            {item.name}
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