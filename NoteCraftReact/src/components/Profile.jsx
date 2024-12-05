import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import profile from '/src/assets/profile.jpg';
import {
  Box,
  Avatar,
  Typography,
  Paper,
  IconButton,
  Divider,
  Button,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { Edit } from '@mui/icons-material';
import { PersonalInfoContext } from './PersonalInfoProvider';

export default function Profile({ token }) {
  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const location = useLocation();
  const navigate = useNavigate();
  const { personalInfo, setPersonalInfo } = useContext(PersonalInfoContext);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openDeactivateModal, setOpenDeactivateModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);

  // Handle Snackbar State from Navigation
  useEffect(() => {
    if (location.state?.showSnackbar && isUpdated) {
      setOpenSnackbar(true);
    }
  }, [location.state, isUpdated]);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  useEffect(() => {
    if (location.state?.personalInfo) {
      setPersonalInfo(location.state.personalInfo);
      setIsUpdated(true); // Mark as updated when personalInfo is received
    }
  }, [location.state]);

  const handleDeactivate = async () => {
    try {
      await axios.put(
        `http://localhost:8081/api/user/deactivate?id=${personalInfo.id}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOpenDeactivateModal(false);
      navigate('/logout');
    } catch (error) {
      console.error('Error deactivating account:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8081/api/user/deleteUserDetails/${personalInfo.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOpenDeleteModal(false);
      navigate('/login');
    } catch (error) {
      console.error('Error deleting account:', error);
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
        top: '14%',
        left: '9%',
        width: '87vw',
        height: '80vh', // Adjust height to viewport height
        display: 'flex',
        flexDirection: 'column',
        padding: 1,
        overflow: 'hidden', // Prevent scrolling
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
            personalInfo?.profileImg
              ? `http://localhost:8081/profileImages/${personalInfo.profileImg}`
              : profile
          }
          alt="Profile"
          sx={{ width: 80, height: 80, border: '2px solid #ddd' }}
        />
        <Box sx={{ flex: 1, textAlign: 'left' }}>
          <Typography variant="h6" fontWeight="bold">
            {`${personalInfo?.firstName || ''} ${personalInfo?.lastName || ''}`.trim() || 'Full Name'}
          </Typography>
        </Box>
        <Box>
          <IconButton
            color="primary"
            onClick={() => navigate('/myprofile/edit', { state: { personalInfo } })}
          >
            <Edit />
          </IconButton>
        </Box>
      </Paper>

      {/* Flexbox Layout */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap', // Stacks items on smaller screens
        }}
      >
        {/* Personal Information */}
        <Paper
          sx={{
            flex: 2.5,
            padding: 3,
            borderRadius: 2,
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            textAlign: 'left',
            border: '1px solid #D3D3D3',
          }}
        >
          <Typography variant="h6" fontWeight="bold" marginBottom={2} fontSize={22}>
            Personal Information
          </Typography>
          <Divider />
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              marginTop: 2,
            }}
          >
            {/* Column 1 */}
            <Box sx={{ flex: 1, paddingRight: 2 }}>
              {[{ label: 'First Name', value: personalInfo?.firstName }, { label: 'Last Name', value: personalInfo?.lastName }, { label: 'Username', value: personalInfo?.username }].map(({ label, value }, index) => (
                <Box key={index} sx={{ marginBottom: 2 }}>
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
                </Box>
              ))}
            </Box>

            {/* Column 2 */}
            <Box sx={{ flex: 1, paddingLeft: 2 }}>
              {[{ label: 'Birthday', value: personalInfo?.birthdate ? formatDate(personalInfo.birthdate) : 'N/A' }, { label: 'Email', value: personalInfo?.email }, { label: 'Age', value: personalInfo?.birthdate ? calculateAge(personalInfo.birthdate) : 'N/A' }].map(({ label, value }, index) => (
                <Box key={index} sx={{ marginBottom: 2 }}>
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
                </Box>
              ))}
            </Box>
          </Box>
        </Paper>

        <Paper
          sx={{
            flex: 1,
            padding: 3,
            borderRadius: 2,
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            border: '1px solid #D3D3D3',
          }}
        >
          <Typography variant="h6" fontWeight="bold" fontSize={22} sx={{marginBottom: "-23px"}}>
            Account Removal
          </Typography>
          <Divider />
          <Typography variant="body2" color="text.secondary" marginTop={0}>
            Disabling your account means you can recover it at any time after taking this action.
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 2 }}>
            <Button
              variant="contained"
              color="error"
              onClick={() => setOpenDeactivateModal(true)}
              sx={{ textTransform: 'none' }}
            >
              Deactivate Account
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => setOpenDeleteModal(true)}
              sx={{
                textTransform: 'none',
                border: '2px solid',
              }}
            >
              Delete Account
            </Button>
          </Box>
        </Paper>

        {/* Deactivate Account Modal */}
        <Dialog open={openDeactivateModal} onClose={() => setOpenDeactivateModal(false)}>
          <DialogTitle>Deactivate Account</DialogTitle>
          <DialogContent>
            Are you sure you want to deactivate your account? This action can be undone.
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeactivateModal(false)}>Cancel</Button>
            <Button onClick={handleDeactivate} color="error">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Account Modal */}
        <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
          <DialogTitle>Delete Account</DialogTitle>
          <DialogContent>
            Are you sure you want to permanently delete your account? This action cannot be undone.
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteModal(false)}>Cancel</Button>
            <Button onClick={handleDelete} color="error">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/* Snackbar for update success */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Profile updated successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
}
