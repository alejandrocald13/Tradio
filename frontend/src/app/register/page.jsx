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
import { api } from "../lib/axios";
import Link from "next/link";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    birthdate: "",
    cellphone: "",
    dpi: "",
    address: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateAge = (birthdate) => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const validateDPI = (dpi) => /^\d{1,13}$/.test(dpi);

  // ✅ Phone must be 8 digits only
  const validatePhone = (phone) => /^\d{8}$/.test(phone);
  const formatPhone = (value) => value.replace(/\D/g, "").slice(0, 8);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "cellphone") formattedValue = formatPhone(value);
    if (name === "dpi") formattedValue = value.replace(/\D/g, "").slice(0, 13);

    setFormData({ ...formData, [name]: formattedValue });

    if (errors[name]) setErrors({ ...errors, [name]: "" });

    if (name === "birthdate" && value) {
      const age = validateAge(value);
      if (age < 18) {
        setErrors({ ...errors, birthdate: "You must be at least 18 years old." });
      }
    }

    if (name === "dpi" && value && !validateDPI(formattedValue)) {
      setErrors({ ...errors, dpi: "DPI must contain only numbers (maximum 13 digits)." });
    }

    if (name === "cellphone") {
      if (formattedValue && !validatePhone(formattedValue)) {
        setErrors({ ...errors, cellphone: "Enter an 8-digit mobile number." });
      } else {
        const { cellphone, ...rest } = errors;
        setErrors(rest);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { fullName, birthdate, cellphone, dpi, address } = formData;
    const newErrors = {};

    if (!fullName) newErrors.fullName = "Full name is required.";
    if (!birthdate) newErrors.birthdate = "Date of birth is required.";
    else if (validateAge(birthdate) < 18) newErrors.birthdate = "You must be at least 18 years old.";

    if (!cellphone) newErrors.cellphone = "Phone number is required.";
    else if (!validatePhone(cellphone)) newErrors.cellphone = "Enter an 8-digit mobile number.";

    if (!dpi) newErrors.dpi = "DPI is required.";
    else if (!validateDPI(dpi)) newErrors.dpi = "DPI must contain only numbers (max 13 digits).";

    if (!address) newErrors.address = "Address is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    saveInfo();
  };

  const getMaxBirthdate = () => {
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    return maxDate.toISOString().split("T")[0];
  };

  const getMinBirthdate = () => {
    const today = new Date();
    const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
    return minDate.toISOString().split("T")[0];
  };

  const saveInfo = async () => {
    try {
      await api.patch("/users/me", {
        profile: {
          name: formData.fullName,
          birth_date: formData.birthdate,
          address: formData.address,
          cellphone: formData.cellphone, 
          dpi: formData.dpi,
        },
      });

      alert("Personal info saved successfully.");
    } catch (error) {
      console.log(error);
      alert("An error occurred while saving your info.");
    }
  };

  return (
    <div className="background">
      <div className="container">
        <div className="left">
          <img src="/logo_tradio_white.png" alt="Tradio Logo" className="logo" />
        </div>

        <div className="right">
          <form className="form" onSubmit={handleSubmit}>
            <div className="section active">
              <h2 className="sectionTitle">Complete Personal Info</h2>

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
                  min={getMinBirthdate()}
                  max={getMaxBirthdate()}
                  className={errors.birthdate ? "error" : ""}
                />
              </div>
              {errors.birthdate && <span className="error-message">{errors.birthdate}</span>}

              <div className="inputGroup">
                <FaPhone className="icon" />
                <input
                  type="tel"
                  name="cellphone"
                  placeholder="e.g., 12345678"
                  value={formData.cellphone}
                  onChange={handleChange}
                  className={errors.cellphone ? "error" : ""}
                  inputMode="numeric"
                  pattern="\d{8}"
                  maxLength={8}
                  autoComplete="tel"
                />
              </div>
              {errors.cellphone && <span className="error-message">{errors.cellphone}</span>}

              <div className="inputGroup">
                <FaIdCard className="icon" />
                <input
                  type="text"
                  name="dpi"
                  placeholder="DPI (max 13 digits)"
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
                <button type="submit" className="btn">Register</button>
              </div>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
