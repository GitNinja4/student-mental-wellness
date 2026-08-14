import { useState } from "react";

function Login({ onRegisterClick, onLoginSuccess }) {
  const [showPassword, setShowPassword] =
    useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Login failed.");
        return;
      }

      localStorage.setItem("token", data.token);

      localStorage.setItem(
        "mindtrack_user",
        JSON.stringify(data.user)
      );

      onLoginSuccess(data.user);

    } catch (error) {
      console.error("Login error:", error);
      alert("Unable to connect to the server.");
    } finally {
      setIsLoading(false);
    }
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
            disabled={isLoading}
          >
            {isLoading
              ? "Logging in..."
              : "Login"}
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