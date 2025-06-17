"use client";

import type React from "react";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import VerifiedIcon from "@mui/icons-material/Verified";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Fade from "@mui/material/Fade";
import Grow from "@mui/material/Grow";
import defaultpic from "../assets/userdefault.png";
import axios from "axios";
import "./personal.css";
import { useUser } from "../context/UserContext"; // <-- IMPORT HOOK DARI CONTEXT

interface PersonalData {
  firstname: string;
  lastname: string;
  email: string;
  address: string;
  phonenumber: string;
  dateofbirth: string;
  profilepicture: string;
}

function Personal() {
  const { userProfile, updateProfilePicture, refetchUser } = useUser();

  const [personalData, setPersonalData] = useState<PersonalData>({
    firstname: "",
    lastname: "",
    email: "",
    address: "",
    phonenumber: "",
    dateofbirth: "",
    profilepicture: defaultpic,
  });
  const [editingField, setEditingField] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    if (userProfile) {
      try {
        const result = await axios.get(
          `https://myassets-backend.vercel.app/getProfile/${userProfile.email}`
        );
        const fetchedData = result.data;
        const formattedDateOfBirth = fetchedData.dateofbirth
          ? new Date(fetchedData.dateofbirth).toISOString().split("T")[0]
          : "";

        setPersonalData({
          firstname: fetchedData.firstname || "",
          lastname: fetchedData.lastname || "",
          email: userProfile.email,
          address: fetchedData.address || "",
          phonenumber: fetchedData.phonenumber || "",
          dateofbirth: formattedDateOfBirth,
          profilepicture:
            userProfile.profilepicture ||
            fetchedData.profilepicture ||
            defaultpic,
        });
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
      }
    }
  }, [userProfile]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setPersonalData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (fieldName: string) => {
    setIsLoading(true);
    try {
      const fieldValue = personalData[fieldName as keyof PersonalData];
      const updateData: any = {
        email: personalData.email,
        [fieldName]: fieldValue,
      };
      if (fieldName === "dateofbirth") {
        updateData.dateofbirth =
          fieldValue === ""
            ? null
            : new Date(fieldValue).toISOString().split("T")[0];
      }

      await axios.put("https://myassets-backend.vercel.app/updateProfile", {
        data: updateData,
      });
      setEditingField(null);
      refetchUser(); // Refresh data global setelah update
    } catch (err: any) {
      console.error(`Failed to update ${fieldName}:`, err.message);
    } finally {
      setIsLoading(false);
    }
  };

  async function uploadProfilePicture(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("profilepicture", file);
    try {
      const response = await axios.post(
        "https://myassets-backend.vercel.app/uploadProfilePicture",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return response.data.url;
    } catch (error) {
      console.error("Failed to upload profile picture:", error);
      throw error;
    }
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file && userProfile) {
      uploadProfilePicture(file)
        .then((url) => {
          return axios.put(
            "https://myassets-backend.vercel.app/updateProfile",
            {
              data: { email: userProfile.email, profilepicture: url },
            }
          );
        })
        .then(() => {
          const newUrl = personalData.profilepicture; // URL sudah diupdate di state lewat DB
          updateProfilePicture(newUrl); // Panggil fungsi dari context untuk update global
          fetchData(); // Ambil lagi data terbaru untuk halaman ini
        })
        .catch((error) => {
          console.error("Failed to upload and update profile picture:", error);
        });
    }
  }

  const editProfilePicture = () =>
    document.getElementById("fileInput")?.click();
  const profileFields = [
    { key: "firstname", label: "First Name", icon: PersonIcon, type: "text" },
    { key: "lastname", label: "Last Name", icon: PersonIcon, type: "text" },
    { key: "email", label: "Email", icon: EmailIcon, type: "email" },
    { key: "phonenumber", label: "Phone Number", icon: PhoneIcon, type: "tel" },
    { key: "address", label: "Address", icon: LocationOnIcon, type: "text" },
    {
      key: "dateofbirth",
      label: "Date of Birth",
      icon: CalendarTodayIcon,
      type: "date",
    },
  ];

  return (
    <div className="modern-profile-container">
      <div className="modern-header">
        <IconButton
          className="back-button"
          onClick={() => navigate("/Dashboard")}
          sx={{ color: "#6366f1" }}
        >
          <ArrowBackIcon fontSize="large" />
        </IconButton>
      </div>
      <div className="profile-content">
        <Fade in={true} timeout={800}>
          <div className="profile-header-card">
            <div className="profile-header-content">
              <div className="profile-picture-section">
                <div
                  className="profile-picture-container"
                  onClick={editProfilePicture}
                >
                  <img
                    src={personalData.profilepicture || defaultpic}
                    alt="Profile"
                    className="profile-image"
                  />
                  <div className="profile-overlay">
                    <CameraAltIcon sx={{ fontSize: 32, color: "white" }} />
                  </div>
                  <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleImageChange}
                  />
                </div>
                <Chip
                  icon={<VerifiedIcon />}
                  label="Online"
                  className="status-chip"
                  sx={{
                    backgroundColor: "#10b981",
                    color: "white",
                    fontWeight: "bold",
                    "& .MuiChip-icon": { color: "white" },
                  }}
                />
              </div>
              <div className="user-info-section">
                <h1 className="user-name">{userProfile?.username || "User"}</h1>
                <p className="user-email">{userProfile?.email}</p>
                <div className="user-badges">
                  <Chip label="Premium Member" className="premium-badge" />
                  <Chip label="Verified" className="verified-badge" />
                </div>
              </div>
            </div>
          </div>
        </Fade>

        <Grow in={true} timeout={1000}>
          <div className="personal-details-card">
            <div className="card-header">
              <h2 className="section-title">Personal Details</h2>
              <p className="section-subtitle">
                Manage your personal information and preferences
              </p>
            </div>
            <div className="form-grid">
              {profileFields.map((field, index) => {
                const Icon = field.icon;
                const isEditing = editingField === field.key;
                return (
                  <Fade in={true} timeout={600 + index * 100} key={field.key}>
                    <div className="form-field">
                      <div className="field-label">
                        <Icon
                          sx={{
                            fontSize: 18,
                            color: "#64748b",
                            marginRight: 1,
                          }}
                        />
                        <span>{field.label}</span>
                      </div>
                      <Paper
                        className={`field-input ${isEditing ? "editing" : ""}`}
                        elevation={isEditing ? 4 : 1}
                        sx={{
                          transition: "all 0.3s ease",
                          "&:hover": {
                            elevation: 2,
                            backgroundColor: "#f8fafc",
                          },
                        }}
                      >
                        <InputBase
                          type={field.type}
                          name={field.key}
                          value={personalData[field.key as keyof PersonalData]}
                          onChange={handleChange}
                          disabled={!isEditing}
                          placeholder={`Enter your ${field.label.toLowerCase()}`}
                          sx={{
                            ml: 2,
                            flex: 1,
                            fontSize: "16px",
                            "& input": { padding: "12px 0" },
                          }}
                        />
                        <IconButton
                          onClick={() => {
                            if (isEditing) {
                              handleSave(field.key);
                            } else {
                              setEditingField(field.key);
                            }
                          }}
                          disabled={isLoading}
                          className={`action-button ${
                            isEditing ? "save-button" : "edit-button"
                          }`}
                          sx={{
                            margin: "8px",
                            transition: "all 0.3s ease",
                            backgroundColor: isEditing
                              ? "#10b981"
                              : "transparent",
                            color: isEditing ? "white" : "#6366f1",
                            "&:hover": {
                              backgroundColor: isEditing
                                ? "#059669"
                                : "#e0e7ff",
                              transform: "scale(1.05)",
                            },
                          }}
                        >
                          {isEditing ? <SaveIcon /> : <EditIcon />}
                        </IconButton>
                      </Paper>
                    </div>
                  </Fade>
                );
              })}
            </div>
          </div>
        </Grow>

        <div className="info-cards-grid">
          <Fade in={true} timeout={1200}>
            <div className="info-card success-card">
              <div className="info-card-header">
                <div className="info-card-icon success-icon">
                  <PersonIcon />
                </div>
                <h3>Account Status</h3>
              </div>
              <p>Your account is fully verified and active.</p>
            </div>
          </Fade>
          <Fade in={true} timeout={1400}>
            <div className="info-card info-card-blue">
              <div className="info-card-header">
                <div className="info-card-icon blue-icon">
                  <CalendarTodayIcon />
                </div>
                <h3>Last Updated</h3>
              </div>
              <p>Profile was last updated today.</p>
            </div>
          </Fade>
        </div>
      </div>
    </div>
  );
}

export default Personal;
