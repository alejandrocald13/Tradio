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
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateAge = (birthdate) => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    return age;
  };

  // Validar DPI (solo números, máximo 13 dígitos)
  const validateDPI = (dpi) => {
    const dpiRegex = /^\d{1,13}$/;
    return dpiRegex.test(dpi);
  };

  // Validar teléfono (permite código de área y formato internacional)
  const validatePhone = (phone) => {
    const phoneRegex = /^[\+]?[(]?[\d\s\-\(\)]{8,}$/;
    return phoneRegex.test(phone);
  };

  // Formatear teléfono mientras se escribe
  const formatPhone = (value) => {
    // Eliminar todo excepto números y el signo +
    const numbers = value.replace(/[^\d+]/g, '');
    
    // Si empieza con +, permitir formato internacional
    if (numbers.startsWith('+')) {
      return numbers;
    }
    
    // Formato local: (+502) 1234-5678 o similar
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `(${numbers.slice(0,3)}) ${numbers.slice(3)}`;
    } else {
      return `(${numbers.slice(0,3)}) ${numbers.slice(3,7)}-${numbers.slice(7,11)}`;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Aplicar formato al teléfono
    if (name === "cellphone") {
      formattedValue = formatPhone(value);
    }

    // Validar DPI (solo números)
    if (name === "dpi") {
      // Permitir solo números y limitar a 13 caracteres
      formattedValue = value.replace(/\D/g, '').slice(0, 13);
    }

    setFormData({ ...formData, [name]: formattedValue });
    
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }

    // Validación en tiempo real para la fecha de nacimiento
    if (name === "birthdate" && value) {
      const age = validateAge(value);
      if (age < 18) {
        setErrors({ ...errors, birthdate: "Debes ser mayor de edad (18+ años)" });
      } else {
        const newErrors = { ...errors };
        delete newErrors.birthdate;
        setErrors(newErrors);
      }
    }

    // Validación en tiempo real para DPI
    if (name === "dpi" && value) {
      if (!validateDPI(value)) {
        setErrors({ ...errors, dpi: "El DPI debe contener solo números (máximo 13 dígitos)" });
      } else {
        const newErrors = { ...errors };
        delete newErrors.dpi;
        setErrors(newErrors);
      }
    }

    // Validación en tiempo real para teléfono
    if (name === "cellphone" && value) {
      const cleanPhone = value.replace(/[^\d+]/g, '');
      if (!validatePhone(cleanPhone)) {
        setErrors({ ...errors, cellphone: "Ingresa un número de teléfono válido" });
      } else {
        const newErrors = { ...errors };
        delete newErrors.cellphone;
        setErrors(newErrors);
      }
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    const { email, password, confirmPassword } = formData;
    const newErrors = {};

    if (!email) {
      newErrors.email = "El email es requerido";
    } else if (!validateEmail(email)) {
      newErrors.email = "Ingresa un email válido";
    }

    if (!password) {
      newErrors.password = "La contraseña es requerida";
    } else if (password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirma tu contraseña";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setStep(2);
  };

  const handleBack = (e) => {
    e.preventDefault();
    setStep(1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { fullName, birthdate, cellphone, dpi, address } = formData;
    const newErrors = {};

    if (!fullName) newErrors.fullName = "El nombre completo es requerido";
    
    if (!birthdate) {
      newErrors.birthdate = "La fecha de nacimiento es requerida";
    } else {
      const age = validateAge(birthdate);
      if (age < 18) {
        newErrors.birthdate = "Debes ser mayor de edad (18+ años)";
      }
    }

    if (!cellphone) {
      newErrors.cellphone = "El teléfono es requerido";
    } else {
      const cleanPhone = cellphone.replace(/[^\d+]/g, '');
      if (!validatePhone(cleanPhone)) {
        newErrors.cellphone = "Ingresa un número de teléfono válido";
      }
    }

    if (!dpi) {
      newErrors.dpi = "El DPI es requerido";
    } else if (!validateDPI(dpi)) {
      newErrors.dpi = "El DPI debe contener solo números (máximo 13 dígitos)";
    }

    if (!address) newErrors.address = "La dirección es requerida";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    alert("✅ Registro completado correctamente.");
  };

  // Calcular fecha máxima (18 años atrás desde hoy)
  const getMaxBirthdate = () => {
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    return maxDate.toISOString().split('T')[0];
  };

  // Calcular fecha mínima (100 años atrás desde hoy)
  const getMinBirthdate = () => {
    const today = new Date();
    const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
    return minDate.toISOString().split('T')[0];
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
              <span className={step === 1 ? "activeStep" : ""}>Account Info</span>
              <span className={step === 2 ? "activeStep" : ""}>Personal Info</span>
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
                    className={errors.email ? "error" : ""}
                  />
                </div>
                {errors.email && <span className="error-message">{errors.email}</span>}

                <div className="inputGroup passwordGroup">
                  <FaLock className="icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? "error" : ""}
                  />
                  <span
                    className="toggleIcon"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                {errors.password && <span className="error-message">{errors.password}</span>}

                <div className="inputGroup passwordGroup">
                  <FaLock className="icon" />
                  <input
                    type={showConfirm ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={errors.confirmPassword ? "error" : ""}
                  />
                  <span
                    className="toggleIcon"
                    onClick={() => setShowConfirm(!showConfirm)}
                  >
                    {showConfirm ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}

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
                    className={errors.fullName ? "error" : ""}
                  />
                </div>
                {errors.fullName && <span className="error-message">{errors.fullName}</span>}

                <div className="inputGroup">
                  <FaBirthdayCake className="icon" />
                  <input
                    type="date"
                    name="birthdate"
                    value={formData.birthdate}
                    onChange={handleChange}
                    className={errors.birthdate ? "error" : ""}
                    min={getMinBirthdate()}
                    max={getMaxBirthdate()}
                  />
                  <span className="age-info">
                    {formData.birthdate && `Edad: ${validateAge(formData.birthdate)} años`}
                  </span>
                </div>
                {errors.birthdate && <span className="error-message">{errors.birthdate}</span>}

                <div className="inputGroup">
                  <FaPhone className="icon" />
                  <input
                    type="tel"
                    name="cellphone"
                    placeholder="Ej: (502) 1234-5678 o +1 (555) 123-4567"
                    value={formData.cellphone}
                    onChange={handleChange}
                    className={errors.cellphone ? "error" : ""}
                  />
                </div>
                {errors.cellphone && <span className="error-message">{errors.cellphone}</span>}

                <div className="inputGroup">
                  <FaIdCard className="icon" />
                  <input
                    type="text"
                    name="dpi"
                    placeholder="DPI (solo números, máximo 13 dígitos)"
                    value={formData.dpi}
                    onChange={handleChange}
                    className={errors.dpi ? "error" : ""}
                    maxLength={13}
                  />
                </div>
                {errors.dpi && <span className="error-message">{errors.dpi}</span>}

                <div className="inputGroup">
                  <FaMapMarkerAlt className="icon" />
                  <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleChange}
                    className={errors.address ? "error" : ""}
                  />
                </div>
                {errors.address && <span className="error-message">{errors.address}</span>}

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