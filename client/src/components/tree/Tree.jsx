import PropTypes from "prop-types";
import Branch from "./branch/Branch.jsx";

function Tree(props) {
  const { data } = props;

  return ( 
    <div className="tree">
      {data.map((item) => (
        <Branch key={item.id} item={item} level={0} />
      ))}
    </div>
  );
}

Tree.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Tree;