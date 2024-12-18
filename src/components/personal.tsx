import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import defaultpic from "../assets/userdefault.png";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./personal.css";

function Personal() {
  const [profilePicture, setProfilePicture] = useState<string>(defaultpic);
  const [userData, setUserData] = useState<any>(null);
  const [personalData, setPersonalData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    address: "",
    phonenumber: "",
    dateofbirth: "",
    profilepicture: profilePicture,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const data = localStorage.getItem("data");
      if (data) {
        const user = JSON.parse(data);
        setUserData(user);
        setPersonalData((prev) => ({
          ...prev,
          email: user.email,
        }));

        try {
          const result = await axios.get(
            `https://myassets-backend.vercel.app/getProfile/${user.email}`
          );
          console.log(result.data);

          const formattedDateOfBirth = result.data.dateofbirth
            ? new Date(result.data.dateofbirth).toISOString().split("T")[0]
            : "";

          setPersonalData((prev) => ({
            ...prev,
            ...result.data,
            dateofbirth: formattedDateOfBirth,
            profilepicture: result.data.profilepicture || defaultpic,
          }));
          setProfilePicture(result.data.profilepicture || defaultpic);
        } catch (error) {
          console.error("Failed to fetch profile data:", error);
        }
      }
    };
    fetchData();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setPersonalData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClick = async () => {
    try {
      const updatedData = {
        ...personalData,
        dateofbirth:
          personalData.dateofbirth === "" ? null : personalData.dateofbirth,
      };

      const formattedDateOfBirth = updatedData.dateofbirth
        ? new Date(updatedData.dateofbirth).toISOString().split("T")[0]
        : "";

      // Get the token from localStorage
      const token = localStorage.getItem("session-token");

      if (!token) {
        console.error("User is not authenticated");
        return;
      }

      const result = await axios.put(
        "https://myassets-backend.vercel.app/updateProfile",
        {
          data: { ...updatedData, dateofbirth: formattedDateOfBirth },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Use the token from localStorage
          },
        }
      );

      console.log(result.data);
    } catch (err: any) {
      console.log(err.message);
    }
  };

  async function uploadProfilePicture(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("profilepicture", file);

    try {
      const response = await axios.post(
        "https://myassets-backend.vercel.app/uploadProfilePicture",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("Profile picture URL: ", response.data.url);
      return response.data.url;
    } catch (error) {
      console.error("Failed to upload profile picture:", error);
      throw error;
    }
  }

  function handleClickRedirect() {
    navigate("/Dashboard");
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      uploadProfilePicture(file)
        .then((url) => {
          setProfilePicture(url);
          setPersonalData((prev) => ({
            ...prev,
            profilepicture: url,
          }));
          return axios.put(
            "https://myassets-backend.vercel.app/updateProfile",
            {
              data: { ...personalData, profilepicture: url },
            }
          );
        })
        .then((response) => {
          console.log("Profile updated successfully", response.data);
        })
        .catch((error) => {
          console.error("Failed to upload profile picture:", error);
        });
    }
  }

  function editProfilePicture() {
    document.getElementById("fileInput")?.click();
  }

  return (
    <div className="profileContainer">
      <ArrowBackIcon
        className="back-btn"
        style={{ color: "yellow" }}
        fontSize="large"
        onClick={handleClickRedirect}
      />
      <div className="personalContainer">
        <div className="profile-header">
          <div
            className="profilePicture"
            style={{
              backgroundImage: `url(${profilePicture || defaultpic})`,
              backgroundSize: "cover",

              backgroundRepeat: "no-repeat",
            }}
            onClick={editProfilePicture}
          >
            <input
              id="fileInput"
              type="file"
              alt="edit"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
            <IconButton className="editIcon">
              <EditIcon fontSize="large" style={{ color: "white" }} />
            </IconButton>
          </div>

          <h1> {userData ? userData.username : "User"} </h1>
        </div>
        <div className="personal-detail">
          <h2> Personal Detail</h2>
          <div className="personal-input">
            <div className="personal-input-field">
              <p> First Name</p>
              <Paper
                component="form"
                sx={{
                  p: "2px 4px",
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <InputBase
                  type="text"
                  sx={{ ml: 1, flex: 1 }}
                  name="firstname"
                  placeholder="First Name.."
                  inputProps={{ "aria-label": "Search.." }}
                  onChange={handleChange}
                  value={personalData.firstname}
                />
                <IconButton
                  type="button"
                  sx={{ p: "10px", gap: "8px" }}
                  aria-label="search"
                  className="icons"
                  onClick={handleClick}
                >
                  <SaveIcon />
                </IconButton>
              </Paper>
            </div>
            <div className="personal-input-field">
              <p> Last Name</p>
              <Paper
                component="form"
                sx={{
                  p: "2px 4px",
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <InputBase
                  type="text"
                  sx={{ ml: 1, flex: 1 }}
                  name="lastname"
                  placeholder="Last Name.."
                  inputProps={{ "aria-label": "Search.." }}
                  onChange={handleChange}
                  value={personalData.lastname}
                />
                <IconButton
                  type="button"
                  sx={{ p: "10px", gap: "8px" }}
                  aria-label="search"
                  className="icons"
                  onClick={handleClick}
                >
                  <SaveIcon />
                </IconButton>
              </Paper>
            </div>
            <div className="personal-input-field">
              <p> Date of Birth</p>
              <Paper
                component="form"
                sx={{
                  p: "2px 4px",
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <InputBase
                  type="date"
                  sx={{ ml: 1, flex: 1 }}
                  name="dateofbirth"
                  placeholder="Date of Birth.."
                  inputProps={{ "aria-label": "Search.." }}
                  onChange={handleChange}
                  value={personalData.dateofbirth}
                />
                <IconButton
                  type="button"
                  sx={{ p: "10px", gap: "8px" }}
                  aria-label="search"
                  className="icons"
                  onClick={handleClick}
                >
                  <SaveIcon />
                </IconButton>
              </Paper>
            </div>
            <div className="personal-input-field">
              <p> Email </p>
              <Paper
                component="form"
                sx={{
                  p: "2px 4px",
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <InputBase
                  type="text"
                  sx={{ ml: 1, flex: 1 }}
                  name="email"
                  placeholder="Email.."
                  inputProps={{ "aria-label": "Search.." }}
                  onChange={handleChange}
                  value={personalData.email}
                />
                <IconButton
                  type="button"
                  sx={{ p: "10px", gap: "8px" }}
                  aria-label="search"
                  className="icons"
                  onClick={handleClick}
                >
                  <SaveIcon />
                </IconButton>
              </Paper>
            </div>
            <div className="personal-input-field">
              <p> Address</p>
              <Paper
                component="form"
                sx={{
                  p: "2px 4px",
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <InputBase
                  type="text"
                  sx={{ ml: 1, flex: 1 }}
                  name="address"
                  placeholder="Address.."
                  inputProps={{ "aria-label": "Search.." }}
                  onChange={handleChange}
                  value={personalData.address}
                />
                <IconButton
                  type="button"
                  sx={{ p: "10px", gap: "8px" }}
                  aria-label="search"
                  className="icons"
                  onClick={handleClick}
                >
                  <SaveIcon />
                </IconButton>
              </Paper>
            </div>
            <div className="personal-input-field">
              <p> Phone</p>
              <Paper
                component="form"
                sx={{
                  p: "2px 4px",
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <InputBase
                  type="text"
                  sx={{ ml: 1, flex: 1 }}
                  name="phonenumber"
                  placeholder="Phone.."
                  inputProps={{ "aria-label": "Search.." }}
                  onChange={handleChange}
                  value={personalData.phonenumber}
                />
                <IconButton
                  type="button"
                  sx={{ p: "10px", gap: "8px" }}
                  aria-label="search"
                  className="icons"
                  onClick={handleClick}
                >
                  <SaveIcon />
                </IconButton>
              </Paper>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Personal;
