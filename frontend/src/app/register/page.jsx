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

  const validateDPI = (dpi) => {
    const dpiRegex = /^\d{1,13}$/;
    return dpiRegex.test(dpi);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[\+]?[(]?[\d\s\-\(\)]{8,}$/;
    return phoneRegex.test(phone);
  };

  const formatPhone = (value) => {
    const numbers = value.replace(/[^\d+]/g, "");
    if (numbers.startsWith("+")) {
      return numbers;
    }
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    } else {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "cellphone") {
      formattedValue = formatPhone(value);
    }

    if (name === "dpi") {
      formattedValue = value.replace(/\D/g, "").slice(0, 13);
    }

    setFormData({ ...formData, [name]: formattedValue });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }

    if (name === "birthdate" && value) {
      const age = validateAge(value);
      if (age < 18) {
        setErrors({ ...errors, birthdate: "You must be at least 18 years old." });
      } else {
        const newErrors = { ...errors };
        delete newErrors.birthdate;
        setErrors(newErrors);
      }
    }

    if (name === "dpi" && value) {
      if (!validateDPI(value)) {
        setErrors({
          ...errors,
          dpi: "DPI must contain only numbers (maximum 13 digits).",
        });
      } else {
        const newErrors = { ...errors };
        delete newErrors.dpi;
        setErrors(newErrors);
      }
    }

    if (name === "cellphone" && value) {
      const cleanPhone = value.replace(/[^\d+]/g, "");
      if (!validatePhone(cleanPhone)) {
        setErrors({ ...errors, cellphone: "Enter a valid phone number." });
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
      newErrors.email = "Email is required.";
    } else if (!validateEmail(email)) {
      newErrors.email = "Enter a valid email.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm your password.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
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

    if (!fullName) newErrors.fullName = "Full name is required.";

    if (!birthdate) {
      newErrors.birthdate = "Date of birth is required.";
    } else {
      const age = validateAge(birthdate);
      if (age < 18) {
        newErrors.birthdate = "You must be at least 18 years old.";
      }
    }

    if (!cellphone) {
      newErrors.cellphone = "Phone number is required.";
    } else {
      const cleanPhone = cellphone.replace(/[^\d+]/g, "");
      if (!validatePhone(cleanPhone)) {
        newErrors.cellphone = "Enter a valid phone number.";
      }
    }

    if (!dpi) {
      newErrors.dpi = "DPI number is required.";
    } else if (!validateDPI(dpi)) {
      newErrors.dpi = "DPI must contain only numbers (maximum 13 digits).";
    }

    if (!address) newErrors.address = "Address is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
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
      const response = await api.patch("/users/me", {
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
            {step === 1 && (
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
                {errors.fullName && (
                  <span className="error-message">{errors.fullName}</span>
                )}

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
                    {formData.birthdate &&
                      `Age: ${validateAge(formData.birthdate)} years`}
                  </span>
                </div>
                {errors.birthdate && (
                  <span className="error-message">{errors.birthdate}</span>
                )}

                <div className="inputGroup">
                  <FaPhone className="icon" />
                  <input
                    type="tel"
                    name="cellphone"
                    placeholder="e.g., (502) 1234-5678 or +1 (555) 123-4567"
                    value={formData.cellphone}
                    onChange={handleChange}
                    className={errors.cellphone ? "error" : ""}
                  />
                </div>
                {errors.cellphone && (
                  <span className="error-message">{errors.cellphone}</span>
                )}

                <div className="inputGroup">
                  <FaIdCard className="icon" />
                  <input
                    type="text"
                    name="dpi"
                    placeholder="DPI (numbers only, max 13 digits)"
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
                {errors.address && (
                  <span className="error-message">{errors.address}</span>
                )}

                <div className="buttonWrapper stepsButtons">
                  <Link href={`/api/auth/logout?returnTo=/auth-redirect/${2}`}>
                    <button type="submit" className="btn" onClick={saveInfo}>
                      Register
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
