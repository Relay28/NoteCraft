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
    <Box style={{ height: '100vh', width: '100vw', display: 'flex', marginLeft:-100,overflow:"hidden"}}
    sx={{ backgroundColor: (theme) => theme.palette.background.default,overflow:"hidden"}}>
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
      style={{backgroundColor: (theme) => theme.palette.background.default,
          overflow:"hidden"}}
        sx={{
          flexGrow: 2,
          backgroundColor: (theme) => theme.palette.background.default,
          marginLeft: isSidebarHovered ? '20%' : '10%',
          transition: 'margin-left 0.3s ease',
          width: '100%',
          left:"0",
          marginTop:1,
          marginRight:0,
          overflow:"hidden",
           
       
          
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AuthLayout;
