"use client";
import "./register.css";
import { FaUser, FaEnvelope, FaBirthdayCake, FaPhone, FaIdCard, FaMapMarkerAlt } from "react-icons/fa";

export default function RegisterPage() {
  return (
    <div className="background">
      <div className="container">
        {/* Lado Izquierdo */}
        <div className="left">
          <img src="/logo.png" alt="Logo" className="logo" />
          <h2 className="pageName">Tradio</h2>
        </div>

        {/* Lado Derecho */}
        <div className="right">
          <h2 className="title">Register</h2>
          <form className="form">
            <div className="inputGroup">
              <FaUser className="icon" />
              <input type="text" placeholder="Name" />
            </div>

            <div className="inputGroup">
              <FaEnvelope className="icon" />
              <input type="email" placeholder="Email" />
            </div>

            <div className="inputGroup">
              <FaBirthdayCake className="icon" />
              <input type="number" placeholder="Age" />
            </div>

            <div className="inputGroup">
              <FaPhone className="icon" />
              <input type="tel" placeholder="Cellphone" />
            </div>

            <div className="inputGroup">
              <FaIdCard className="icon" />
              <input type="text" placeholder="DPI" />
            </div>

            <div className="inputGroup">
              <FaMapMarkerAlt className="icon" />
              <input type="text" placeholder="Address" />
            </div>

            <div className="buttonWrapper">
              <button type="submit" className="btn">Register</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
