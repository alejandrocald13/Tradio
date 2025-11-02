"use client";
import "./login.css";
import { useState } from "react";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="background">
      <div className="container">
        {/* Panel izquierdo */}
        <div className="left">
          <img src="/logo_tradio_white.png" alt="Tradio Logo" className="logo" /> 
          

        </div>

        {/* Panel derecho */}
        <div className="right">
          <h2 className="title">Login</h2>
          <form className="form">
            {/* Email */}
            <div className="inputGroup">
              <FiMail className="icon" />
              <input type="email" placeholder="Email" required />
            </div>

            {/* Password */}
            <div className="inputGroup">
              <FiLock className="icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
              />
           <button
            type="button"
            className="toggleIcon"
            onClick={() => setShowPassword(!showPassword)}
                >

                {showPassword ? (
                  <FiEyeOff className="icon" />
                ) : (
                  <FiEye className="icon" />
                )}
              </button>
            </div>

            {/* Botón */}
            <div className="buttonWrapper">
              <button type="submit" className="btn">
                Log in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
