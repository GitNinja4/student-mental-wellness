import { useState } from "react";

function Login({ onRegisterClick, onLoginSuccess }) {
  const [showPassword, setShowPassword] =
    useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Get all registered users
    const existingUsers =
      JSON.parse(localStorage.getItem("users")) || [];

    // Find user by email
    const user = existingUsers.find(
      (user) =>
        user.email.toLowerCase() ===
        email.trim().toLowerCase()
    );

    // User has NOT registered
    if (!user) {
      alert(
        "You haven't registered yet. Please create an account first."
      );
      return;
    }

    // User exists but password is wrong
    if (user.password !== password) {
      alert(
        "Incorrect password. Please try again."
      );
      return;
    }

    // Login successful
    localStorage.setItem(
      "currentUser",
      JSON.stringify(user)
    );

    // Open dashboard
    onLoginSuccess(user);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* Logo */}
        <div className="wellness-logo">
          <span>🧠</span>
        </div>

        {/* Brand */}
        <div className="brand-name">
          Student Mental Wellness
        </div>

        <h1>Welcome Back!</h1>

        <p className="auth-subtitle">
          Take a moment for yourself.
          <br />
          Login to continue your wellness journey.
        </p>

        <form onSubmit={handleSubmit}>

          {/* Email */}
          <div className="input-group">

            <label htmlFor="login-email">
              Email
            </label>

            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Enter your email"
              required
            />

          </div>

          {/* Password */}
          <div className="input-group">

            <label htmlFor="login-password">
              Password
            </label>

            <div className="password-wrapper">

              <input
                id="login-password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Enter your password"
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? "🙈" : "👁"}
              </button>

            </div>

          </div>

          {/* Forgot Password */}
          <div className="forgot-password">
            Forgot Password?
          </div>

          {/* Login */}
          <button
            type="submit"
            className="auth-button"
          >
            Login
          </button>

        </form>

        <div className="divider">
          <span>or</span>
        </div>

        <p className="switch-text">
          Don't have an account?{" "}

          <button
            type="button"
            className="text-link"
            onClick={onRegisterClick}
          >
            Create an account
          </button>
        </p>

        <p className="privacy-text">
          Your mental wellness journey is private and secure.
        </p>

      </div>
    </div>
  );
}

export default Login;