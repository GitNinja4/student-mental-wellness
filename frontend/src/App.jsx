import { useEffect, useState } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

import "./App.css";

function App() {
  const [showRegister, setShowRegister] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [currentUser, setCurrentUser] = useState(null);

  const [checkingAuth, setCheckingAuth] = useState(true);

  
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsLoggedIn(false);
        setCurrentUser(null);
        setCheckingAuth(false);
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/auth/verify",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          localStorage.removeItem("token");

          setIsLoggedIn(false);
          setCurrentUser(null);
          setCheckingAuth(false);

          return;
        }

       
        setCurrentUser(data.user);
        setIsLoggedIn(true);

      } catch (error) {
        console.error(
          "Authentication verification error:",
          error
        );

       
        setIsLoggedIn(false);
        setCurrentUser(null);

      } finally {
        setCheckingAuth(false);
      }
    };

    verifyToken();
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    setShowRegister(false);
  };

  const handleRegisterSuccess = () => {
   
    setCurrentUser(null);
    setIsLoggedIn(false);
    setShowRegister(false);
  };

  
  const handleLogout = () => {
  
    localStorage.removeItem("token");

    setCurrentUser(null);
    setIsLoggedIn(false);
    setShowRegister(false);
  };

 
  if (checkingAuth) {
    return null;
  }

  
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
          onLoginClick={() => setShowRegister(false)}
          onRegisterSuccess={handleRegisterSuccess}
        />
      ) : (
        <Login
          onRegisterClick={() => setShowRegister(true)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </>
  );
}

export default App;