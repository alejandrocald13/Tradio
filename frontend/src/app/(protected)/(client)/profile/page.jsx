"use client";
import { useState, useEffect, useMemo } from "react";
import "./settingsprofile.css";
import SidebarNav from "@/app/components/SidebarNav-Auth";
import Modal from "@/app/components/Modal";
import {
  FaUser,
  FaPhone,
  FaIdCard,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaEnvelope,
  FaCheckCircle,
} from "react-icons/fa";
import { api } from "@/app/lib/axios";

export default function SettingsProfile() {
  const [userEmail, setUserEmail] = useState("user@example.com");
  const [savedData, setSavedData] = useState({
    name: "",
    address: "",
    birthdate: "",
    phone: "",
    dpi: "",
  });
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    birthdate: "",
    phone: "",
    dpi: "",
  });
  const [errors, setErrors] = useState({});
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  const hasChanges = useMemo(() => {
    return (
      formData.name !== savedData.name ||
      formData.address !== savedData.address ||
      formData.birthdate !== savedData.birthdate ||
      formData.phone !== savedData.phone ||
      formData.dpi !== savedData.dpi
    );
  }, [formData, savedData]);

  const normalizePhone = (raw) => {
    const digits = String(raw || "").replace(/\D/g, "");
    if (digits.length <= 8) return digits;
    return digits.slice(-8);
  };

  const getMaxBirthdate = () => {
    const today = new Date();
    const maxDate = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );
    return maxDate.toISOString().split("T")[0];
  };

  const getMinBirthdate = () => {
    const today = new Date();
    const minDate = new Date(
      today.getFullYear() - 100,
      today.getMonth(),
      today.getDate()
    );
    return minDate.toISOString().split("T")[0];
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "dpi") {
      const numericValue = value.replace(/\D/g, "").slice(0, 13);
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
    } else if (name === "phone") {
      const normalized = normalizePhone(value);
      setFormData((prev) => ({ ...prev, [name]: normalized }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.birthdate.trim()) newErrors.birthdate = "Birthdate is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.dpi.trim()) newErrors.dpi = "DPI is required";
    if (formData.phone && !/^\d{8}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must have 8 digits";
    }
    if (formData.dpi && !/^\d{13}$/.test(formData.dpi)) {
      newErrors.dpi = "DPI must have exactly 13 digits";
    }
    if (formData.birthdate) {
      const birthDate = new Date(formData.birthdate);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }
      if (age < 18) newErrors.birthdate = "You must be 18 years or older";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveClick = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSaveModalOpen(true);
  };

  const confirmSave = async () => {
    await updateProfileData();
    setSaveModalOpen(false);
  };

  const handleCancel = () => {
    if (hasChanges || Object.keys(errors).length > 0) setCancelModalOpen(true);
  };

  const confirmCancel = () => {
    setFormData({ ...savedData });
    setErrors({});
    setCancelModalOpen(false);
  };

  const cancelCancel = () => setCancelModalOpen(false);

  const renderSaveModalContent = () => (
    <div className="modal-content-success">
      <FaCheckCircle className="modal-icon success" />
      <p>Are you sure you want to save the changes?</p>
      <div className="modal-buttons">
        <button className="btn-modal-cancel" onClick={() => setSaveModalOpen(false)}>
          Cancel
        </button>
        <button className="btn-modal-confirm" onClick={confirmSave}>
          Yes, Save
        </button>
      </div>
    </div>
  );

  const renderCancelModalContent = () => (
    <div className="modal-content-success">
      <FaCheckCircle className="modal-icon" />
      <p>You have unsaved changes. Discard them?</p>
      <div className="modal-buttons">
        <button className="btn-modal-cancel" onClick={cancelCancel}>
          Keep editing
        </button>
        <button className="btn-modal-confirm" onClick={confirmCancel}>
          Discard changes
        </button>
      </div>
    </div>
  );

  async function getProfileData() {
    try {
      const response = await api.get("/users/me");
      const data = response.data;
      const profile = data.profile;
      const incoming = {
        name: profile.name || "",
        address: profile.address || "",
        birthdate: profile.birth_date || "",
        phone: normalizePhone(profile.cellphone),
        dpi: (profile.dpi || "").toString().replace(/\D/g, "").slice(0, 13),
      };
      setFormData(incoming);
      setSavedData(incoming);
      setUserEmail(data.email);
    } catch (error) {
      console.error("Error when getting user profile.", error);
    }
  }

  async function updateProfileData() {
    try {
      const body = {
        profile: {
          name: formData.name,
          birth_date: formData.birthdate,
          address: formData.address,
          cellphone: normalizePhone(formData.phone),
          dpi: formData.dpi,
        },
      };
      await api.patch("/users/me", body);
      await getProfileData();
    } catch (error) {
      console.error("Error when updating user profile.", error);
    }
  }

  useEffect(() => {
    getProfileData();
  }, []);

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
          <div
            className="form-area"
            style={{
              maxHeight: "65vh",
              overflowY: "scroll",
              paddingRight: "10px",
            }}
          >
            <div className="form-header">
              <h2>General Information</h2>
              <p>Modify your personal data</p>
            </div>

            <form className="form-grid" onSubmit={(e) => handleSaveClick(e)}>
              <div className="input-box">
                <label>Name:</label>
                <div className={`input-icon ${errors.name ? "error" : ""}`}>
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
                <div className={`input-icon ${errors.address ? "error" : ""}`}>
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
                <div className={`input-icon ${errors.birthdate ? "error" : ""}`}>
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
                <div className={`input-icon ${errors.phone ? "error" : ""}`}>
                  <FaPhone />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Enter your cellphone (8 digits)"
                    value={formData.phone}
                    onChange={handleInputChange}
                    maxLength={8}
                    inputMode="numeric"
                  />
                </div>
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>

              <div className="input-box">
                <label>DPI:</label>
                <div className={`input-icon ${errors.dpi ? "error" : ""}`}>
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
                <span className="digit-counter">{formData.dpi.length}/13 digits</span>
              </div>

              <div className="input-box">
                <label>Email:</label>
                <div className="input-icon readonly">
                  <FaEnvelope />
                  <input type="email" value={userEmail} readOnly className="readonly-input" />
                </div>
                <span className="readonly-note">Email cannot be modified</span>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Modal isOpen={saveModalOpen} title="Confirm Save" onClose={() => setSaveModalOpen(false)}>
        {renderSaveModalContent()}
      </Modal>

      <Modal isOpen={cancelModalOpen} title="Discard Changes" onClose={cancelCancel}>
        {renderCancelModalContent()}
      </Modal>
    </div>
  );
}