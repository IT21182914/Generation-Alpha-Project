import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import Validation from "./LoginValidation";
import axios from "axios"; // Corrected import statement
import { useNavigate } from "react-router-dom";

function Login() {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInput = (event) => {
    setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = Validation(values);
    setErrors(validationErrors);

    if (!validationErrors.email && !validationErrors.password) {
      try {
        const response = await axios.post(
          "http://localhost:8081/login",
          values
        );

        if (response.data === "Success") {
          navigate("/home");
        } else {
          alert("No user found");
        }

        console.log(response);
      } catch (error) {
        console.log(error);
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
          <p>You are agree to our terms and policies</p>

          <Link to="/signup" className="btn btn-default border w-100">
            {" "}
            Create Account
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
