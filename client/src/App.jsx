import React from "react";
import { Button } from "./components/ui/button";
import Signup from "./components/Signup";
import { BrowserRouter, Routes, Route } from "react-router";
import Login from "./components/Login";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
