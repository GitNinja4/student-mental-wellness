import { useState } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

import "./App.css";

function App() {
  const [showRegister, setShowRegister] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // When user logs in
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
  };

  // When user registers
  const handleRegisterSuccess = (user) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
  };

  if (isLoggedIn) {
    return <Dashboard user={currentUser} />;
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