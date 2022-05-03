import PropTypes from "prop-types";
import style from "./Comment.module.css";

function Comment(props) {
  const { content, date, publisher } = props.comment;

  return (
    <li className={style.comment}>
      <p className={style.publisher}>{publisher}</p>
      <p className={style.date}>
        {new Date(date).toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          }
        )}
      </p>
      <p className={style.content}>{content}</p>
    </li>
  );
}

Comment.propTypes = {
  comment: PropTypes.shape({
    content: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    publisher: PropTypes.string.isRequired,
  }).isRequired,
};

export default Comment;
