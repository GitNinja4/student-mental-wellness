import { useEffect, useState } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

import "./App.css";

function App() {
  const [showRegister, setShowRegister] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [currentUser, setCurrentUser] = useState(null);

 
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsLoggedIn(false);
      return;
    }

  
    try {
      const storedUser =
        JSON.parse(
          localStorage.getItem("mindtrack_user")
        );

      setCurrentUser(storedUser || null);
      setIsLoggedIn(true);

    } catch (error) {
      console.error(
        "Unable to restore user session:",
        error
      );

      setCurrentUser(null);
      setIsLoggedIn(true);
    }

  }, []);


  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    setShowRegister(false);
  };


  const handleRegisterSuccess = () => {
    setShowRegister(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("mindtrack_user");

    setCurrentUser(null);
    setIsLoggedIn(false);
    setShowRegister(false);
  };

  if (isLoggedIn) {
    return (
      <Dashboard
        user={currentUser}
        onLogout={handleLogout}
      />
    );
  }


  return (
    <>
      {showRegister ? (
        <Register
          onLoginClick={() =>
            setShowRegister(false)
          }
          onRegisterSuccess={
            handleRegisterSuccess
          }
        />
      ) : (
        <Login
          onRegisterClick={() =>
            setShowRegister(true)
          }
          onLoginSuccess={
            handleLoginSuccess
          }
        />
      )}
    </>
  );
}

export default App;