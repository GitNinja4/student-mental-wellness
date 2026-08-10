import { useState } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";

import "./App.css";

function App() {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <>
      {showRegister ? (
        <Register
          onLoginClick={() => setShowRegister(false)}
        />
      ) : (
        <Login
          onRegisterClick={() => setShowRegister(true)}
        />
      )}
    </>
  );
}

export default App;