import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8081", {
        headers: {
          "access-token": localStorage.getItem("token"),
        },
      })
      .then((res) => {
        if (res.data.valid) {
          setName(res.data.name);
        } else {
          navigate("/login");
        }
      })
      .catch((err) => {
        console.error("Error checking authentication:", err);
        navigate("/login");
      });
  }, [navigate]);

  const handleAuth = () => {
    axios
      .get("http://localhost:8081/checkAuth", {
        headers: {
          "access-token": localStorage.getItem("token"),
        },
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div>
      <h1>Welcome {name}</h1>
      <button onClick={handleAuth} className="btn btn-primary">
        CheckAuth
      </button>
    </div>
  );
}

export default Home;
