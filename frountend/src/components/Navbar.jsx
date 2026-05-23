import React, { useState, useEffect } from "react";

function Navbar({ setSearch }) {

  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const logout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <header className="p-3 text-bg-dark shadow">
      <div className="container">
        <div className="d-flex flex-wrap align-items-center justify-content-between">

          {/* LOGO */}
          <a href="/" className="text-white text-decoration-none">
            <h4>💊 Smart Medicine</h4>
          </a>

          {/* NAV LINKS */}
          <ul className="nav me-auto ms-4">
            <li><a href="/" className="nav-link text-white">Home</a></li>
            <li><a href="#" className="nav-link text-white">Features</a></li>
            <li><a href="#" className="nav-link text-white">About</a></li>
          </ul>

          {/* SEARCH */}
          <input
            type="search"
            className="form-control me-3"
            placeholder="Search medicine..."
            style={{ width: "250px" }}
            onChange={handleSearch}
          />

          {/* AUTH SECTION */}
          <div>
            {user ? (
              <>
                <span className="text-white me-3">
                  👤 {user.name}
                </span>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={logout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  className="btn btn-outline-light me-2"
                  onClick={() => window.location.href = "/login"}
                >
                  Login
                </button>

                <button
                  className="btn btn-warning"
                  onClick={() => window.location.href = "/signup"}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}

export default Navbar;