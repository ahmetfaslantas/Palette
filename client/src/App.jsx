import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import "./App.css";
import { useEffect } from "react";

function App() {
  let navigate = useNavigate();

  useEffect(() => {
    if (!Cookies.get("token")) {
      navigate("/login");
    } else {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="App">
      <p>Redirecting...</p>
    </div>
  );
}

export default App;
