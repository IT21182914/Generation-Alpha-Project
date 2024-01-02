import React from "react";
import { Link } from "react-router-dom";
import Validation from "./SignupValidation";
import { useState } from "react";
import axious from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const [errors, setErrors] = useState({});

  const handleInput = (event) => {
    setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors(Validation(values));

    if (errors.name === "" && errors.email === "" && errors.password === "") {
     
         axious.post("http://localhost:8081/signup", values)
            .then((res) => {
            navigate("/");
            console.log(res);
            })
            .catch((err) => {
            console.log(err);
            });

    }
  };
  return (
    <div className="d-flex justify-content-center align-items-center bg-dark vh=100">
      <div className="bg-white p-3 rounded w-25">
        <h2>Sign up</h2>
        <form action="" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name">
              <strong>Name</strong>
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter Email"
              onChange={handleInput}
              className="form-control rounded-0"
            />
             <span> {errors.name && <span className="text-danger"> {errors.name} </span>} </span>
          </div>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Email</strong>
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              onChange={handleInput}
              className="form-control rounded-0"
            />
             <span> {errors.email && <span className="text-danger"> {errors.email} </span>} </span>
          </div>

          <div className="mb-3">
            <label htmlFor="passowrd">
              <strong>Password</strong>
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              onChange={handleInput}
              className="form-control rounded-0"
            />
             <span> {errors.password && <span className="text-danger"> {errors.password} </span>} </span>
          </div>
          <button type="submit" className="btn btn-success w-100">Sign up</button>
          <p>You are agree to our terms and policies</p>

          <Link to="/login" className="btn btn-default border w-100">
            {" "}
            Log in
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Signup;
