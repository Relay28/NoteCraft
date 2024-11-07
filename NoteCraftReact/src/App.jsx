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

  return (
    <Stack direction="row" sx={{ mt: 5, height: '100vh', width: '90vw' }}>
      {/* Conditionally render AppBar and Sidebar */}
      {!isAuthPage && <PrimarySearchAppBar />}
      {!isAuthPage && <NestedList sx={{ maxWidth: '20%' }} />}

      {/* Main content area with flexGrow and full width */}
      <Box sx={{ flexGrow: 6, p: 4, margin: 0, overflowY: 'auto' }}>
        <TheRoutes />
      </Box>
    </Stack>
  );
}

export default App;
