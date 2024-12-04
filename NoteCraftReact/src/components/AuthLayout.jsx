import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PrimarySearchAppBar from './AppBar';
import NestedList from './SideBar';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // Redirect to login if no token is found
    }
  }, [navigate]);

  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = React.useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <Box style={{ height: '80vh', width: '100vw', display: 'flex', marginLeft:0,paddingLeft:0}}
    sx={{  backgroundColor: (theme) => theme.palette.background.default,}}>
      {/* Sidebar */}
      <NestedList
        open={isSidebarOpen}
        toggleNestedList={toggleSidebar}
        setSidebarHovered={setIsSidebarHovered}
      />
      {/* AppBar */}
      <PrimarySearchAppBar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          backgroundColor: (theme) => theme.palette.background.default,
          marginLeft: isSidebarHovered ? '260px' : '90px',
          transition: 'margin-left 0.3s ease',
          width: '100vw',
          left:"0",
          overflow:"auto",
          height: '100%',
          marginTop: '55px',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AuthLayout;
