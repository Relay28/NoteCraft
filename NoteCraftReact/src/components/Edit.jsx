import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Paper,
  Grid,
  Typography,
  TextField,
  Button,
  Avatar,
  Divider,
  IconButton,
} from '@mui/material';
import { Edit, ArrowBack } from '@mui/icons-material';

export default function EditProfile({ token }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isConfirmed = window.confirm('Are you sure you want to update your profile?');
    if (!isConfirmed) return;

    const updatedFormData = new FormData();
    for (const key in formData) {
      updatedFormData.append(key, formData[key]);
    }
    if (profileImage) {
      updatedFormData.append('profileImg', profileImage);
    }

    try {
      const response = await axios.put(
        `http://localhost:8081/api/user/putUserDetails?id=${formData.id}`,
        updatedFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
        
      );
    
      setFormData(response.data);
      setInitialFormData(response.data);
    
      alert('Profile updated successfully!');
      navigate('/myprofile', { state: { personalInfo: response.data } });
    } catch (error) {
      console.error('Error updating user details:', error);
      setError('Failed to update user details. Please try again.');
    }
  };

  const handleCancel = () => {
    navigate('/myprofile', { state: { personalInfo: formData } });
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '8%',
        left: '5%',
        width: '91vw',
        height: '125vh',
        display: 'flex',
        flexDirection: 'column',
        padding: 4,
        background: '#fff',
        overflow: 'hidden',
      }}
    >
      <Button
        startIcon={<ArrowBack />}
        onClick={handleCancel}
        sx={{
          textTransform: 'none',
          marginBottom: 3,
          color: '#007bff',
          alignSelf: 'flex-start',
        }}
      >
        Back
      </Button>

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
                : ''
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
        <Grid container spacing={2} sx={{ marginTop: 2 }}>
          <Grid item xs={6}>
            <TextField
              label="First Name"
              name="firstName"
              value={formData.firstName || ''}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Last Name"
              name="lastName"
              value={formData.lastName || ''}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Username"
              name="username"
              value={formData.username || ''}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={6}>
          <TextField
            label="Birthday"
            name="birthdate"
            type="date"
            value={formData.birthdate || ""}
            onChange={handleChange}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
            inputProps={{
              max: formatDate(new Date()), // Sets the maximum selectable date to today
            }}
          />

          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email || ''}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={6}>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              color="text.secondary"
              fontSize={16}
            >
              Age
            </Typography>
            <Typography
              sx={{
                backgroundColor: '#f4f4f4',
                padding: '8px',
                borderRadius: '4px',
              }}
            >
              {calculateAge(formData.birthdate)}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ display: 'flex', gap: 2, marginTop: 4 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{ textTransform: 'none' }}
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

      {error && <p style={{ color: 'red', marginTop: '20px' }}>{error}</p>}
    </Box>
  );
}
