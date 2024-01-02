// Login.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Validation from "./LoginValidation";
import axios from "axios";

function Login() {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [backendErrors, setBackendErrors] = useState([]);
  const navigate = useNavigate();

  const handleInput = (event) => {
    setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  axios.defaults.withCredentials = true;
const handleSubmit = async (event) => {
  event.preventDefault();
  setErrors(Validation(values));
  
  if (errors.email === "" && errors.password === "") {
    try {
      const response = await axios.post("http://localhost:8081/login", values);

      if (response.data.Login) {
        const { token, role } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);

        // Navigate based on the user's role
        if (role === 'User') {
          navigate("/");
        } else if (role === 'Professional') {
          navigate("/prof");
        }
      } else {
        // Display a proper message for authentication failure
        setBackendErrors([{ msg: "Invalid email or password" }]);
      }
    } catch (error) {
      console.error("Error in login request:", error);

      // Handle specific error cases
      if (error.response && error.response.status === 401) {
        setBackendErrors([{ msg: "Invalid email or password" }]);
      } else if (error.response && error.response.data && error.response.data.error) {
        // Use response.data.error instead of response.data.errors
        setBackendErrors([{ msg: error.response.data.error }]);
      } else {
        // Display a generic error message
        setBackendErrors([{ msg: "An error occurred during login" }]);
      }
    }
  }
};

  return (
    <div className="d-flex justify-content-center align-items-center bg-dark vh-100">
      <div className="bg-white p-3 rounded w-25">
        <h2>Log in</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              name="email"
              onChange={handleInput}
              value={values.email}
              className="form-control rounded-0"
            />
            <span>{errors.email && <span className="text-danger">{errors.email}</span>}</span>
          </div>

          <div className="mb-3">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              name="password"
              onChange={handleInput}
              value={values.password}
              className="form-control rounded-0"
            />
            <span>{errors.password && <span className="text-danger">{errors.password}</span>}</span>
          </div>

          <button type="submit" className="btn btn-success w-100">
            Log in
          </button>

          <p>You agree to our terms and policies</p>

          <Link to="/signup" className="btn btn-default border w-100">
            Create Account
          </Link>
        </form>

        {backendErrors.length > 0 && (
          <div className="mt-3 alert alert-danger">
            {backendErrors.map((error, index) => (
              <p key={index}>{error.msg}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
