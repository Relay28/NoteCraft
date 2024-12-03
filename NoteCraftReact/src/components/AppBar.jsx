import React, { useState, useContext, useEffect } from 'react';
import { AppBar, Toolbar, Box, IconButton, Typography, Badge, InputBase, Menu, MenuItem } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { Mail as MailIcon, Notifications as NotificationsIcon, DarkMode, Light } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { PersonalInfoContext } from './PersonalInfoProvider';
import SearchIcon from '@mui/icons-material/Search';
import profile from '/src/assets/profile.jpg';
import { useTheme } from './ThemeProvider'; // Import useTheme from ThemeProvider

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.text.primary, 0.2),  // Using theme color for background
  '&:hover': {
    backgroundColor: alpha(theme.palette.text.primary, 0.4),  // Using theme color for hover effect
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
  color: theme.palette.text.primary,  // Using theme color for input text
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

export default function PrimarySearchAppBar({ isSidebarOpen, toggleSidebar  }) {
  const { darkMode, toggleTheme, theme } = useTheme(); 
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const { personalInfo } = useContext(PersonalInfoContext);
  const navigate = useNavigate();
  const user = personalInfo;

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const [imgSrc, setImgSrc] = React.useState(profile);

  React.useEffect(() => {
    if (user?.profileImg) {
      const imageUrl = `http://localhost:8081/profileImages/${user.profileImg}`;
      setImgSrc(imageUrl);
    }
  }, [user?.profileImg]);

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
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      PaperProps={{
        elevation: 0,
        sx: {
          mt: 1,
          borderRadius: 1,
          minWidth: '200px',
          bgcolor: '#fff', // This is fine as it should be white for the menu
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
          '&:before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: '#fff',
            transform: 'translateY(-50%) rotate(45deg)',
            zIndex: 1,
          },
        },
      }}
    >
      <MenuItem
        onClick={handleMyProfileClick}
        sx={{
          fontSize: '0.875rem',
          fontWeight: '500',
          py: 1.5,
          px: 2,
          color: '#333',
          '&:hover': {
            bgcolor: alpha('#487d4b', 0.1),
          },
        }}
      >
        My Profile
      </MenuItem>
      <MenuItem
        onClick={handleLogout}
        sx={{
          fontSize: '0.875rem',
          fontWeight: '500',
          py: 1.5,
          px: 2,
          color: '#333',
          '&:hover': {
            bgcolor: alpha('#487d4b', 0.1),
          },
        }}
      >
        Logout
      </MenuItem>
    </Menu>
  );
  
  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: (theme) => theme.palette.background.default,  // Using theme for background color
        color: (theme) => theme.palette.text.primary,  // Using theme for text color
        height: '76px',
        zIndex: 1, 
        fontFamily:(theme)=>theme.typography.fontFamily,
        width: isSidebarOpen ? 'calc(100% - 90px)' : 'calc(100% - 90px)', 
        marginLeft: isSidebarOpen ? '260px' : '90px', 
        transition: 'all 0.3s ease',
        boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.1)',
        borderBottom: '1px solid #e0e0e0',
      }}
    >
      <Toolbar style={{marginTop:"0.5%"}}>
        <Box sx={{ textAlign: 'left' }}>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 'bold',
              fontSize: '20px',
              fontFamily:(theme)=>theme.typography.fontFamily,
              color: (theme) => theme.palette.text.primary,  // Using theme color for text
            }}
          > Hello, {personalInfo?.name || 'Guest'} 
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase placeholder="Search…" inputProps={{ 'aria-label': 'search' }} />
        </Search>
        <IconButton
          onClick={toggleTheme}
          sx={{ ml: 1, color: darkMode ? '#ffeb3b' : '#333' }}
        >
          {darkMode ? <Light /> : <DarkMode />}
        </IconButton>
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
              src={imgSrc} 
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
