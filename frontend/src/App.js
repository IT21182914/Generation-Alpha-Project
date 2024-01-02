import React from "react";
import Login from "./Login";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import Signup from "./Signup";
import Home from "./Home";


function App() {
  return (
    <div>
      <Router>
        <Routes>
        <Route path="/" element={<Home />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
         
        </Routes>
      </Router>
    </div>
  );
}

export default App;
