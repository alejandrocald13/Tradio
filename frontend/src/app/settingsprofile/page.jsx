"use client";
import { useState } from "react";
import "./settingsprofile.css";
import SidebarNav from "../components/SidebarNav-Auth";
import Modal from "../components/Modal";
import {
  FaUser,
  FaPhone,
  FaIdCard,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaEnvelope,
  FaCheckCircle,
} from "react-icons/fa";

export default function SettingsProfile() {
  const [userEmail] = useState("user@example.com"); // Auth0 email (read-only)

  // Form fields
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    birthdate: "",
    phone: "",
    dpi: "",
  });

  // Error states
  const [errors, setErrors] = useState({});
  
  // Confirmation modal state
  const [saveModalOpen, setSaveModalOpen] = useState(false);

  // Calculate maximum date (18 years ago from today)
  const getMaxBirthdate = () => {
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    return maxDate.toISOString().split('T')[0];
  };

  // Calculate minimum date (100 years ago)
  const getMinBirthdate = () => {
    const today = new Date();
    const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
    return minDate.toISOString().split('T')[0];
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for DPI field - only allow numbers and limit to 13 digits
    if (name === "dpi") {
      // Remove any non-digit characters and limit to 13 digits
      const numericValue = value.replace(/\D/g, '').slice(0, 13);
      setFormData((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.birthdate.trim()) newErrors.birthdate = "Birthdate is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.dpi.trim()) newErrors.dpi = "DPI is required";
    
    // Specific validations
    if (formData.phone && !/^\d{8}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = "Phone number must have 8 digits";
    }
    if (formData.dpi && !/^\d{13}$/.test(formData.dpi)) {
      newErrors.dpi = "DPI must have exactly 13 digits";
    }
    
    // Validate age (must be 18 or older)
    if (formData.birthdate) {
      const birthDate = new Date(formData.birthdate);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      if (age < 18) {
        newErrors.birthdate = "You must be 18 years or older";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Open confirmation modal for save
  const handleSaveClick = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert("❌ Please fix the errors in the form before saving.");
      return;
    }

    setSaveModalOpen(true);
  };

  // Confirm and save changes
  const confirmSave = () => {
    alert("✅ Changes saved successfully.");
    setErrors({});
    setSaveModalOpen(false);
  };

  const handleCancel = () => {
    const hasErrors = Object.keys(errors).length > 0;
    const hasChanges = Object.values(formData).some(value => value.trim() !== "");
    
    if (hasErrors || hasChanges) {
      const confirmCancel = window.confirm(
        "⚠️ You have unsaved changes. Are you sure you want to cancel?"
      );
      
      if (confirmCancel) {
        setFormData({
          name: "",
          address: "",
          birthdate: "",
          phone: "",
          dpi: "",
        });
        setErrors({});
        alert("❎ Changes cancelled.");
      }
    } else {
      alert("ℹ️ No pending changes to cancel.");
    }
  };

  // Confirmation modal content
  const renderSaveModalContent = () => {
    return (
      <div className="modal-content-success">
        <FaCheckCircle className="modal-icon success" />
        <p>Are you sure you want to save the changes?</p>
        <div className="modal-buttons">
          <button 
            className="btn-modal-cancel" 
            onClick={() => setSaveModalOpen(false)}
          >
            Cancel
          </button>
          <button 
            className="btn-modal-confirm" 
            onClick={confirmSave}
          >
            Yes, Save
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="settings-layout">
      <div className="sidebar-area">
        <SidebarNav />
      </div>

      <div className="main-content">
        <div className="header-bar">
          <h1>Settings</h1>
          <div className="header-buttons">
            <button className="btn-cancel" onClick={handleCancel}>
              Cancel
            </button>
            <button className="btn-save" onClick={handleSaveClick}>
              Save changes
            </button>
          </div>
        </div>

        <div className="settings-card">
          <div className="form-area">
            <div className="form-header">
              <h2>General Information</h2>
              <p>Modify your personal data</p>
            </div>
            
            <form className="form-grid" onSubmit={(e) => handleSaveClick(e)}>
              <div className="input-box">
                <label>Name:</label>
                <div className={`input-icon ${errors.name ? 'error' : ''}`}>
                  <FaUser />
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>

              <div className="input-box">
                <label>Address:</label>
                <div className={`input-icon ${errors.address ? 'error' : ''}`}>
                  <FaMapMarkerAlt />
                  <input
                    type="text"
                    name="address"
                    placeholder="Enter your address"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>
                {errors.address && <span className="error-message">{errors.address}</span>}
              </div>

              <div className="input-box">
                <label>Birthdate:</label>
                <div className={`input-icon ${errors.birthdate ? 'error' : ''}`}>
                  <FaCalendarAlt />
                  <input
                    type="date"
                    name="birthdate"
                    value={formData.birthdate}
                    onChange={handleInputChange}
                    max={getMaxBirthdate()}
                    min={getMinBirthdate()}
                  />
                </div>
                {errors.birthdate && <span className="error-message">{errors.birthdate}</span>}
              </div>

              <div className="input-box">
                <label>Cellphone:</label>
                <div className={`input-icon ${errors.phone ? 'error' : ''}`}>
                  <FaPhone />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Enter your cellphone (8 digits)"
                    value={formData.phone}
                    onChange={handleInputChange}
                    maxLength={8}
                  />
                </div>
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>

              {/* DPI with 13-digit limit */}
              <div className="input-box">
                <label>DPI:</label>
                <div className={`input-icon ${errors.dpi ? 'error' : ''}`}>
                  <FaIdCard />
                  <input
                    type="text"
                    name="dpi"
                    placeholder="Enter your DPI (13 digits)"
                    value={formData.dpi}
                    onChange={handleInputChange}
                    maxLength={13}
                    inputMode="numeric"
                  />
                </div>
                {errors.dpi && <span className="error-message">{errors.dpi}</span>}
                <span className="digit-counter">
                  {formData.dpi.length}/13 digits
                </span>
              </div>

              {/* Email next to DPI */}
              <div className="input-box">
                <label>Email:</label>
                <div className="input-icon readonly">
                  <FaEnvelope />
                  <input
                    type="email"
                    value={userEmail}
                    readOnly
                    className="readonly-input"
                  />
                </div>
                <span className="readonly-note">Email cannot be modified</span>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Modal 
        isOpen={saveModalOpen} 
        title="Confirm Save"
        onClose={() => setSaveModalOpen(false)}
      >
        {renderSaveModalContent()}
      </Modal>
    </div>
  );
}