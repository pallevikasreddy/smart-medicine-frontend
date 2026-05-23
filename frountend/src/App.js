import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import Chatbot from "./components/Chatbot";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import 'bootstrap/dist/css/bootstrap.min.css';

function App(){

  const [search, setSearch] = useState("");

  return(
    <Router>

      {/* NAVBAR ALWAYS VISIBLE */}
      <Navbar setSearch={setSearch}/>

      {/* PAGE ROUTES */}
      <Routes>

        {/* HOME PAGE */}
        <Route 
          path="/" 
          element={
            <>
              <Home search={search}/>
              <Chatbot/>
              <Footer/>
            </>
          } 
        />

        {/* LOGIN PAGE */}
        <Route path="/login" element={<Login/>} />

        {/* SIGNUP PAGE */}
        <Route path="/signup" element={<Signup/>} />

      </Routes>

    </Router>
  );
}

export default App;