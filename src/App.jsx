import React from 'react';
import './App.css';
import PrimarySearchAppBar from './components/AppBar';
import NestedList from './components/Sidebar';
import TheRoutes from './components/TheRoutes'; // Import the new routing file
import { Stack, Box } from '@mui/material';
import { BrowserRouter as Router } from 'react-router-dom';

function App() {
  return (
    <Router>
      <PrimarySearchAppBar />
      <Stack direction="row" sx={{ mt: 5, height: 'calc(100vh - 64px)', width: '90vw' }}>
        {/* Sidebar with fixed minimum width */}
        <NestedList sx={{ maxWidth: '20%' }} />

        {/* Main content area with flexGrow and full width */}
        <Box sx={{ flexGrow: 1, p: 1, margin: 0, overflowY: 'auto' }}>
          <TheRoutes /> {/* Use the new routing component */}
        </Box>
      </Stack>
    </Router>
  );
}

export default App;
