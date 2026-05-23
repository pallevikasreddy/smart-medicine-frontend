import React, { useState } from "react";
import axios from "axios";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/login", {
        email,
        password
      });

      alert(res.data.message);

      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        window.location.href = "/";
      }

    } catch {
      alert("Login failed");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h3 className="mb-3">🔐 Login</h3>

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

      <button className="btn btn-primary w-100" onClick={handleLogin}>
        Login
      </button>
    </div>
  );
}

export default Login;