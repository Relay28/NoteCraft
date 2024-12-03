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
 <>
   <TheRoutes />
 </>
  );
}

export default App;
