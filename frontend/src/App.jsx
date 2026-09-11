import React from "react";
import { Routes, Route } from "react-router-dom";

import Login from "./Login";
import Register from "./Register";
import Home from "./Home";
import Practice from "./Practice";

function App() {
  return (
    <Routes>

      <Route
        path="/"
        element={<Login/>}
      />

      <Route
        path="/login"
        element={<Login/>}
      />

      <Route
        path="/register"
        element={<Register/>}
      />

      <Route
        path="/home"
        element={<Home />}
      />
      
      <Route path="/practice" element={<Practice/>} />
    </Routes>
  );
}

export default App;
