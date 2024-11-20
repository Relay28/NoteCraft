import React from 'react';
import './App.css';
import PrimarySearchAppBar from './components/AppBar';
import NestedList from './components/SideBar';
import TheRoutes from './components/TheRoutes';
import { Stack, Box } from '@mui/material';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
      {/* Conditionally render Sidebar and AppBar */}
      {!isAuthPage && (
        <>
          {/* Sidebar is layered above the AppBar */}
          <NestedList open={isSidebarOpen} toggleNestedList={toggleSidebar} />
          <PrimarySearchAppBar isSidebarOpen={isSidebarOpen} />
        </>
      )}

      {/* Main content area */}
      <Box
        sx={{
          flexGrow: 1,
          p: 4,
          marginLeft: isSidebarOpen ? '260px' : '90px', // Adjust margin for closed/open sidebar
          transition: 'margin-left 0.3s ease',
          height: 'calc(100% - 68px)', // Adjust for AppBar height
          marginTop: '68px', // Account for AppBar height
        }}
      >
        <TheRoutes />
      </Box>
    </div>
  );
}

export default App;
