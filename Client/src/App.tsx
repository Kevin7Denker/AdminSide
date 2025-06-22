import Login from "./Pages/Login/Login";
import Dashboard from "./Pages/Dashboard/Dashboard";
import { useState, useEffect } from "react";

function App() {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuth(!!token);
  }, []);

  return (
    <div className="App">
      {isAuth ? (
        <Dashboard setAuth={setIsAuth} />
      ) : (
        <Login setAuth={setIsAuth} />
      )}
    </div>
  );
}

export default App;
