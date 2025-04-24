import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { Link } from "react-router-dom"; // Use Link for navigation
import "./styles.css";

const RegisterComponent = () => {
  const { register } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    // Optional: call Node.js backend when user visits the register page
    console.log("RegisterComponent mounted — make backend call if needed");
    // Example:
    // fetch("/api/register-visit").then(res => res.json()).then(console.log);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      register(username, password);
    } else {
      alert("Passwords do not match");
    }
  };

  return (
    <div className="form-container">
      <div className="form-box">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <input
            className="input-field"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="input-field"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            className="input-field"
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button className="button" type="submit">
            Register
          </button>
        </form>
        <div className="link">
          <p>
            Already have an account?{" "}
            <Link className="link-action" to="/login">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterComponent;
