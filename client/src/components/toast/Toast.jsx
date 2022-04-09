import PropTypes from "prop-types";
import React, { useImperativeHandle, useState } from "react";
import style from "./Toast.module.css";

const Toast = React.forwardRef(function Toast(props, ref) {
  const [isActive, setIsActive] = useState(false);

  const { message, duration } = props;

  useImperativeHandle(ref, () => ({
    show: () => {
      setIsActive(true);
      setTimeout(() => {
        setIsActive(false);
      }, duration);
    },
  }));

  return (
    <div
      className={
        isActive ? [style.toast, style.show].join(" ") : style.toast
      }
    >
      {message}
    </div>
  );
});

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  duration: PropTypes.number,
};

Toast.defaultProps = {
  duration: 3000,
};

export default Toast;
