import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import "./App.css";
import { useEffect } from "react";

function App() {
  let navigate = useNavigate();

  useEffect(() => {
    if (!Cookies.get("token")) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="App">
      <p>Hello World</p>
    </div>
  );
}

export default App;
