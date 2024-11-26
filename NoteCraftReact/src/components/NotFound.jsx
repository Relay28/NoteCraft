import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';

export default function NotFound () {
  const navigate = useNavigate();
  navigate('/Login')
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '50vh',
        textAlign: 'center',
      }}
    >
      <Typography variant="h4" gutterBottom>
        404 - Page Not Found
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 3 }}>
        The page you are looking for doesn't exist or has been moved.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/home')}
        sx={{ backgroundColor: '#487d4b', padding: '10px 25px' }}
      >
        Go back to home
      </Button>
    </Box>
  );
};
