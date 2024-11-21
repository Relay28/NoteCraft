import React, { useState, useContext } from 'react';
import { AppBar, Toolbar, Box, IconButton, Typography, Badge, InputBase, Menu, MenuItem } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { Mail as MailIcon, Notifications as NotificationsIcon, AccountCircle, Home as HomeIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { PersonalInfoContext } from './PersonalInfoProvider';
import SearchIcon from '@mui/icons-material/Search';
import Avatar from '@mui/material/Avatar';
import profile from '/src/assets/profile.jpg';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha('#b6b9bf', 0.2), 
  '&:hover': {
    backgroundColor: alpha('#b6b9bf', 0.4),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: '#333', 
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

export default function PrimarySearchAppBar({ isSidebarOpen }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const { personalInfo } = useContext(PersonalInfoContext);
  const navigate = useNavigate();

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMobileMoreAnchorEl(null);
  };

  const handleMyProfileClick = () => {
    navigate('/myprofile', { state: { account: personalInfo } });
    handleMenuClose();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    handleMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      open={isMenuOpen}
      onClose={handleMenuClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <MenuItem onClick={handleMyProfileClick}>My Profile</MenuItem>
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );

  return (
    <AppBar
  position="fixed"
  sx={{
    backgroundColor: '#fff',
    color: '#333',
    height: '76px',
    zIndex: 1, 
    width: isSidebarOpen ? 'calc(100% - 90px)' : 'calc(100% - 90px)', 
    marginLeft: isSidebarOpen ? '260px' : '90px', 
    transition: 'all 0.3s ease',
    boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.1)',
    borderBottom: '1px solid #e0e0e0',
  }}
>
      <Toolbar style={{marginTop:"0.5%"}}>
        <IconButton edge="start" color="inherit" onClick={() => navigate('/home')} sx={{ mr: 2 }}>
          <HomeIcon sx={{ fontSize: '28px', color: '#487d4b' }} />
        </IconButton>
        <Typography variant="h6" noWrap sx={{ fontWeight: 'bold', color: '#487d4b' }}>
          NoteCraft
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase placeholder="Search…" inputProps={{ 'aria-label': 'search' }} />
        </Search>

        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          <IconButton size="large" aria-label="show 4 new mails" color="inherit">
            <Badge badgeContent={3} color="error">
              <MailIcon sx={{ color: '#487d4b' }} />
            </Badge>
          </IconButton>
          <IconButton size="large" aria-label="show 17 new notifications" color="inherit">
            <Badge badgeContent={2} color="error">
              <NotificationsIcon sx={{ color: '#487d4b' }} />
            </Badge>
          </IconButton>
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
                
                <Box
  component="img"
  src={personalInfo?.profileImg || profile} 
  alt="Profile"
  sx={{
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    transition: 'all 0.3s ease', 
  }}
/>
          </IconButton>
        </Box>
      </Toolbar>
      {renderMenu}
    </AppBar>
  );
}
