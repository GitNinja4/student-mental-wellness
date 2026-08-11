import { useState } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import CheckIn from "./pages/checkin";

import "./App.css";

function App() {
  const [showRegister, setShowRegister] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // If user has logged in, show Check-In page
  if (isLoggedIn) {
    return <CheckIn />;
  }

  return (
    <div className="auth-page">
      {showRegister ? (
        <Register
         onLoginClick={() => setShowRegister(false)}
         onRegisterSuccess={() => setIsLoggedIn(true)}
        />
      ) : (
        <Login
          onRegisterClick={() => setShowRegister(true)}
          onLoginSuccess={() => setIsLoggedIn(true)}
        />
      )}
    </div>
  );
}

export default App;