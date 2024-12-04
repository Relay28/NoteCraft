import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import profile from '/src/assets/profile.jpg'; // Ensure the correct path
import {
  Box,
  Avatar,
  Typography,
  Grid,
  Paper,
  IconButton,
  Divider,
  Button,
} from '@mui/material';
import { Edit } from '@mui/icons-material';

export default function Profile({ personalInfo, token }) {
  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-indexed, so add 1
    const day = d.getDate().toString().padStart(2, '0'); // Ensure day is 2 digits
    return `${year}-${month}-${day}`; // Return in yyyy-MM-dd format
  };

  const location = useLocation();
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(personalInfo || location.state?.account || {});

  console.log("Personal Info in Profile:", personalInfo);

  useEffect(() => {
    if (location.state?.personalInfo) {
      setUserInfo(location.state.personalInfo); // Update state if new data is passed
    }
  }, [location.state]);

  const handleDelete = async () => {
    if (!userInfo.id) {
      alert('Unable to delete. User ID is not found.');
      return;
    }

    const confirmDelete = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:8081/api/user/deleteUserDetails/${userInfo.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Account deleted successfully.');
      navigate('/login');
    } catch (error) {
      alert('Error deleting user: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  const handleDeactivate = async () => {
    const isConfirmed = window.confirm(
      'Are you sure you want to deactivate your account? This action cannot be undone.'
    );
    if (!isConfirmed) return;

    try {
      await axios.put(
        `http://localhost:8081/api/user/deactivate?id=${userInfo.id}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Your account has been successfully deactivated.');
      navigate('/logout');
    } catch (error) {
      alert('Error deactivating account: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

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
      {/* Profile Header */}
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
        <Avatar
          src={
            userInfo.profileImg
              ? `http://localhost:8081/profileImages/${userInfo.profileImg}`
              : profile
          }
          alt="Profile"
          sx={{ width: 80, height: 80, border: '2px solid #ddd' }}
        />
        <Box sx={{ flex: 1, textAlign: 'left' }}>
          <Typography variant="h6" fontWeight="bold">
            {`${userInfo.firstName || ''} ${userInfo.lastName || ''}`.trim() || 'Full Name'}
          </Typography>
        </Box>
        <Box>
          <IconButton
            color="primary"
            onClick={() => navigate('/myprofile/edit', { state: { personalInfo: userInfo } })} 
          >
            <Edit />
          </IconButton>
        </Box>
      </Paper>

      {/* Personal Information */}
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
        <Typography variant="h6" fontWeight="bold" marginBottom={2} fontSize={22}>
          Personal Information
        </Typography>
        <Divider />
        <Grid container spacing={2} sx={{ marginTop: 2 }}>
          {[
            { label: 'First Name', value: userInfo.firstName },
            { label: 'Last Name', value: userInfo.lastName },
            { label: 'Username', value: userInfo.username },
            { label: 'Birthday', value: userInfo.birthdate ? formatDate(userInfo.birthdate) : 'N/A' },
            { label: 'Email', value: userInfo.email },
            {
              label: 'Age',
              value: userInfo.birthdate ? calculateAge(userInfo.birthdate) : 'N/A',
            },
          ].map(({ label, value }, index) => (
            <Grid item xs={6} key={index}>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                color="text.secondary"
                fontSize={16}
              >
                {label}
              </Typography>
              <Typography variant="body1" fontSize={18}>
                {value || 'N/A'}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Account Actions */}
      <Grid item xs={6}>
        <Paper
          sx={{
            padding: '24px',
            borderRadius: 2,
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            textAlign: 'left',
            height: '200px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            border: '1px solid #D3D3D3',
          }}
        >
          <Typography variant="h6" fontWeight="bold" marginBottom={1.5} fontSize={22}>
            Account Removal
          </Typography>
          <Divider />
          <Typography variant="body2" color="text.secondary" marginTop={3.5}>
            Disabling your account means you can recover it at any time after taking this
            action.
          </Typography>
          <Grid container spacing={2} sx={{ marginTop: 2 }}>
            <Grid item xs={6}>
              <Button
                variant="contained"
                color="error"
                onClick={handleDeactivate}
                sx={{ textTransform: 'none', minWidth: '100%' }}
              >
                Disable Account
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="outlined"
                color="error"
                onClick={handleDelete}
                sx={{
                  textTransform: 'none',
                  minWidth: '100%',
                  border: '2px solid',
                }}
              >
                Delete Account
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Box>
  );
}
