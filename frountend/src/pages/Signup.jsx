import React, { useState } from "react";
import axios from "axios";

function Signup() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      const res = await axios.post("https://medassist-ai-healthcare-chatbot.onrender.com", {
        name,
        email,
        password
      });

      alert(res.data.message);

      if (res.data.message === "Signup successful") {
        window.location.href = "/login";
      }

    } catch {
      alert("Signup failed");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h3 className="mb-3">📝 Sign Up</h3>

      <input
        className="form-control mb-2"
        placeholder="Name"
        onChange={(e)=>setName(e.target.value)}
      />

      <input
        className="form-control mb-2"
        placeholder="Email"
        onChange={(e)=>setEmail(e.target.value)}
      />

      <input
        type="password"
        className="form-control mb-3"
        placeholder="Password"
        onChange={(e)=>setPassword(e.target.value)}
      />

      <button className="btn btn-warning w-100" onClick={handleSignup}>
        Sign Up
      </button>
    </div>
  );
}

export default Signup;
