import axios from 'axios';
import React from 'react'

function Home() {

  const handleAuth = () => {
   
    axios.get("http://localhost:8081/checkAuth", {
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
      
<h1>Home</h1>

<button onClick={handleAuth} className="btn btn-primary">
            CheckAuth
          </button>

    </div>
  )
}

export default Home