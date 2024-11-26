import React from 'react';
import './App.css';
import PrimarySearchAppBar from './components/AppBar';
import NestedList from './components/SideBar';
import TheRoutes from './components/TheRoutes';
import { Box } from '@mui/material';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = React.useState(false);

  // Toggle sidebar
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <Box style={{ height: '100vh', width: '100vw', display: 'flex' }}>
      {!isAuthPage && (
        <>
          {/* Sidebar */}
          <NestedList
            open={isSidebarOpen}
            toggleNestedList={toggleSidebar}
            setSidebarHovered={setIsSidebarHovered} // Pass hover state handler
          />
          {/* AppBar */}
          <PrimarySearchAppBar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        </>
      )}

      {/* Main content area */}
      <Box
        sx={{
          flexGrow: 1,
          padding: isAuthPage ? 0 : 4,
          marginLeft: isAuthPage ? 0 : isSidebarHovered ? '260px' : '90px',
          transition: 'margin-left 0.3s ease',
          width: '100%',
          height: isAuthPage ? '100%' : 'calc(100% - 68px)',
          marginTop: isAuthPage ? 0 : '68px',
        }}
      >
        <TheRoutes />
      </Box>
    </Box>
  );
}

export default App;
