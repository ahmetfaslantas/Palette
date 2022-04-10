import React, { useImperativeHandle, useState } from "react";
import style from "./Toast.module.css";

const Toast = React.forwardRef(function Toast(props, ref) {
  const [isActive, setIsActive] = useState(false);
  const [message, setMessage] = useState("");

  useImperativeHandle(ref, () => ({
    show: (message) => {
      setMessage(message);
      setIsActive(true);
      setTimeout(() => {
        setIsActive(false);
      }, 2900);
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

export default Toast;
