import { useState } from "react";

function Register({ onLoginClick, onRegisterSuccess }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check password confirmation
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    // Get all previously registered users
    const existingUsers =
      JSON.parse(localStorage.getItem("users")) || [];

    // Check if this email already exists
    const userAlreadyExists = existingUsers.some(
      (user) =>
        user.email.toLowerCase() === email.toLowerCase()
    );

    if (userAlreadyExists) {
      alert(
        "An account with this email already exists. Please login."
      );
      return;
    }

    // Create new user
    const newUser = {
      name: fullName.trim(),
      email: email.trim().toLowerCase(),
      password: password,
    };

    // Add new user to users list
    existingUsers.push(newUser);

    // Save all users
    localStorage.setItem(
      "users",
      JSON.stringify(existingUsers)
    );

    // Automatically log in the newly registered user
    localStorage.setItem(
      "currentUser",
      JSON.stringify(newUser)
    );

    // Open dashboard directly
    onRegisterSuccess(newUser);
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

        <h1>Create Account</h1>

        <p className="auth-subtitle">
          Start your wellness journey with us.
          <br />
          Your mental well-being matters.
        </p>

        <form onSubmit={handleSubmit}>

          {/* Full Name */}
          <div className="input-group">
            <label htmlFor="full-name">
              Full Name
            </label>

            <input
              id="full-name"
              type="text"
              value={fullName}
              onChange={(e) =>
                setFullName(e.target.value)
              }
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Email */}
          <div className="input-group">
            <label htmlFor="register-email">
              Email
            </label>

            <input
              id="register-email"
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
            <label htmlFor="register-password">
              Password
            </label>

            <div className="password-wrapper">

              <input
                id="register-password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Create a password"
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

          {/* Confirm Password */}
          <div className="input-group">
            <label htmlFor="confirm-password">
              Confirm Password
            </label>

            <div className="password-wrapper">

              <input
                id="confirm-password"
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                placeholder="Confirm your password"
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
              >
                {showConfirmPassword
                  ? "🙈"
                  : "👁"}
              </button>

            </div>
          </div>

          {/* Create Account */}
          <button
            type="submit"
            className="auth-button"
          >
            Create Account
          </button>

        </form>

        <div className="divider">
          <span>or</span>
        </div>

        <p className="switch-text">
          Already have an account?{" "}

          <button
            type="button"
            className="text-link"
            onClick={onLoginClick}
          >
            Login
          </button>
        </p>

        <p className="privacy-text">
          Your information is private and secure.
        </p>

      </div>
    </div>
  );
}

export default Register;