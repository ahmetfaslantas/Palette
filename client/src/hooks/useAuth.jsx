import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

function useAuth() {
  const [type, setType] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!Cookies.get("token") || !Cookies.get("type")) {
      navigate("/login", { replace: true });
      return;
    }

    setType(Cookies.get("type"));
  }, []);

  return type;
}

export default useAuth;