import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Divider,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
} from '@mui/material';
import { Edit } from '@mui/icons-material';
import profile from '/src/assets/profile.jpg';

export default function EditProfile({ token }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false); // Snackbar state

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [initialFormData, setInitialFormData] = useState({
    ...location.state?.personalInfo,
    birthdate: formatDate(location.state?.personalInfo?.birthdate),
  });

  const [formData, setFormData] = useState({ ...initialFormData });

  const calculateAge = (birthdate) => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImage(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setIsModalOpen(false); // Close the confirmation modal
  
    const updatedFormData = new FormData();
    for (const key in formData) {
      updatedFormData.append(key, formData[key]);
    }
    if (profileImage) {
      updatedFormData.append('profileImg', profileImage);
    }
  
    try {
      // Sending the update request
      const response = await axios.put(
        `http://localhost:8081/api/user/putUserDetails?id=${formData.id}`,
        updatedFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Navigate back to Profile with state to show Snackbar
      navigate('/myprofile', {
        state: { showSnackbar: true, personalInfo: formData },
      });
    } catch (error) {
      setError(error.response?.data?.message || 'Unknown error occurred');
    }
  };
  
  
  

  const handleCancel = () => {
    navigate('/myprofile', { state: { personalInfo: formData } });
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleCloseSnackbar = () => setOpenSnackbar(false);

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '14%',
        left: '9%',
        width: '87vw',
        height: '83vh',
        display: 'flex',
        flexDirection: 'column',
        padding: 1,
        overflow: 'hidden',
      }}
    >
      <Paper
        sx={{
          padding: 3,
          borderRadius: 2,
          marginBottom: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          border: '1px solid #D3D3D3',
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <Avatar
            src={
              profileImage
                ? URL.createObjectURL(profileImage)
                : formData.profileImg
                ? `http://localhost:8081/profileImages/${formData.profileImg}`
                : profile
            }
            alt="Profile"
            sx={{ width: 80, height: 80, border: '2px solid #ddd' }}
          />
          <IconButton
            component="label"
            color="primary"
            sx={{
              position: 'absolute',
              bottom: -10,
              left: '80%',
              transform: 'translateX(-50%)',
              background: '#fff',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
            }}
          >
            <Edit />
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />
          </IconButton>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
              position: 'absolute',
              bottom: 20,
              left: "160vh"
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenModal}
              sx={{ textTransform: 'none', "&:hover": { backgroundColor: "#1da23d" }, color: "white" }}
            >
              Save
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCancel}
              sx={{ textTransform: 'none' }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
       <Box sx={{ flex: 1, textAlign: 'left' }}>
          <Typography variant="h6" fontWeight="bold">
            {formData.firstName && formData.lastName
              ? `${formData.firstName} ${formData.lastName}`
              : 'Full Name'}
          </Typography>
        </Box>
      </Paper>

      <Paper
        sx={{
          padding: 3,
          borderRadius: 2,
          marginBottom: 3,
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          textAlign: 'left',
          border: '1px solid #D3D3D3',
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          marginBottom={2}
          fontSize={22}
        >
          Personal Information
        </Typography>
        <Divider />
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            marginTop: 2,
          }}
        >
          <TextField
            label="First Name"
            name="firstName"
            value={formData.firstName || ''}
            onChange={handleChange}
            fullWidth
            required
            sx={{ flex: '1 1 45%' }}
          />
          <TextField
            label="Last Name"
            name="lastName"
            value={formData.lastName || ''}
            onChange={handleChange}
            fullWidth
            required
            sx={{ flex: '1 1 45%' }}
          />
          <TextField
            label="Username"
            name="username"
            value={formData.username || ''}
            onChange={handleChange}
            fullWidth
            required
            sx={{ flex: '1 1 45%' }}
          />
          <TextField
            label="Birthday"
            name="birthdate"
            type="date"
            value={formData.birthdate || ''}
            onChange={handleChange}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
            inputProps={{
              max: formatDate(new Date()), // Sets the maximum selectable date to today
            }}
            sx={{ flex: '1 1 45%' }}
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email || ''}
            onChange={handleChange}
            fullWidth
            required
            sx={{ flex: '1 1 45%' }}
          />
          <Box
            sx={{
              flex: '1 1 45%',
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            <TextField
              label="Age"
              value={calculateAge(formData.birthdate)}
              variant="outlined"
              fullWidth
              InputProps={{
                readOnly: true, // Prevents typing
              }}
              sx={{
                borderRadius: '4px',
              }}
            />

          </Box>
        </Box>
      </Paper>

      {/* Confirmation Modal */}
      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">Confirm Update</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            Are you sure you want to update your profile?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
  open={openSnackbar}
  autoHideDuration={3000}
  onClose={handleCloseSnackbar}
  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
>
  <Alert
    onClose={handleCloseSnackbar}
    severity={error ? 'error' : 'success'}
    sx={{ width: '100%' }}
  >
    {error || 'Profile updated successfully!'}
  </Alert>
</Snackbar>

    </Box>
  );
}
