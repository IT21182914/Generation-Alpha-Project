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

        console.log(response.data);

        if (response.data.Login) {
          localStorage.setItem("token", response.data.token);
          navigate("/");
        } else {
          alert("No record found");
        }
      } catch (error) {
        console.error("Error in login request:", error);

        // Handle backend errors
        if (error.response && error.response.data && error.response.data.errors) {
          setBackendErrors(error.response.data.errors);
        }
      }
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-dark vh=100">
      <div className="bg-white p-3 rounded w-25">
        <h2>Log in</h2>
        <form action="" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email"></label>
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              onChange={handleInput}
              className="form-control rounded-0"
            />
            <span>
              {" "}
              {errors.email && (
                <span className="text-danger"> {errors.email} </span>
              )}{" "}
            </span>
          </div>

          <div className="mb-3">
            <label htmlFor="password"></label>
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              onChange={handleInput}
              className="form-control rounded-0"
            />
            <span>
              {" "}
              {errors.password && (
                <span className="text-danger"> {errors.password} </span>
              )}{" "}
            </span>
          </div>
          <button type="submit" className="btn btn-success w-100">
            Log in
          </button>
          <p>You agree to our terms and policies</p>

          <Link to="/signup" className="btn btn-default border w-100">
            {" "}
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
