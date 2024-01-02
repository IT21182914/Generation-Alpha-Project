import React from "react";
import Login from "./Login";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import Signup from "./Signup";


function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Login />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
