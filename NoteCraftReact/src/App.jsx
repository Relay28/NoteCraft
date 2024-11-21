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

  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
      {!isAuthPage && (
        <>
          {/* Sidebar */}
          <NestedList open={isSidebarOpen} toggleNestedList={toggleSidebar} />
          {/* AppBar */}
          <PrimarySearchAppBar isSidebarOpen={isSidebarOpen} />
        </>
      )}

      {/* Main content area */}
      <Box
        sx={{
          flexGrow: 1,
          p: isAuthPage ? 0 : 4,
          marginLeft: isAuthPage ? 0 : isSidebarOpen ? '15%' : '5%', 
          transition: 'margin-left 0.3s ease',
          width: isAuthPage ? '100%' : '90%', 
          height: isAuthPage ? '100%' : 'calc(100% - 68px)', 
          marginTop: isAuthPage ? 0 : '68px', 
        }}
      >
        <TheRoutes />
      </Box>
    </div>
  );
}

export default App