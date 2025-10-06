"use client";
import { useState } from "react";
import "./register.css";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaBirthdayCake,
  FaPhone,
  FaIdCard,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    birthdate: "",
    cellphone: "",
    dpi: "",
    address: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = (e) => {
    e.preventDefault();
    const { email, password, confirmPassword } = formData;

    if (!email || !password || !confirmPassword) {
      alert("Por favor, llena todos los campos antes de continuar.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    setStep(2);
  };

  const handleBack = (e) => {
    e.preventDefault();
    setStep(1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { fullName, birthdate, cellphone, dpi, address } = formData;

    if (!fullName || !birthdate || !cellphone || !dpi || !address) {
      alert("Por favor, completa todos los campos para registrarte.");
      return;
    }

    alert("✅ Registro completado correctamente.");
  };

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

          {/* Barra de progreso */}
          <div className="progressContainer">
            <div className="progressBar">
              <div
                className="progressFill"
                style={{ width: step === 1 ? "50%" : "100%" }}
              ></div>
            </div>
            <div className="progressSteps">
              <span className={step === 1 ? "activeStep" : ""}>Step 1</span>
              <span className={step === 2 ? "activeStep" : ""}>Step 2</span>
            </div>
          </div>

          <form className="form" onSubmit={handleSubmit}>
            {/* Paso 1: Account Info */}
            {step === 1 && (
              <div className="section active">
                <h3 className="sectionTitle">Account Info</h3>

                <div className="inputGroup">
                  <FaEnvelope className="icon" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="inputGroup passwordGroup">
                  <FaLock className="icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <span
                    className="toggleIcon"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>

                <div className="inputGroup passwordGroup">
                  <FaLock className="icon" />
                  <input
                    type={showConfirm ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <span
                    className="toggleIcon"
                    onClick={() => setShowConfirm(!showConfirm)}
                  >
                    {showConfirm ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>

                <div className="buttonWrapper">
                  <button className="btn nextBtn" onClick={handleNext}>
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Paso 2: Personal Info */}
            {step === 2 && (
              <div className="section active">
                <h3 className="sectionTitle">Personal Info</h3>

                <div className="inputGroup">
                  <FaUser className="icon" />
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="inputGroup">
                  <FaBirthdayCake className="icon" />
                  <input
                    type="date"
                    name="birthdate"
                    value={formData.birthdate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="inputGroup">
                  <FaPhone className="icon" />
                  <input
                    type="tel"
                    name="cellphone"
                    placeholder="Cellphone"
                    value={formData.cellphone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="inputGroup">
                  <FaIdCard className="icon" />
                  <input
                    type="text"
                    name="dpi"
                    placeholder="DPI"
                    value={formData.dpi}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="inputGroup">
                  <FaMapMarkerAlt className="icon" />
                  <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="buttonWrapper stepsButtons">
                  <button className="btn backBtn" onClick={handleBack}>
                    Back
                  </button>
                  <button type="submit" className="btn">
                    Register
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
