import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DescriptionIcon from '@mui/icons-material/Description';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FolderIcon from '@mui/icons-material/Folder';
import MessageIcon from '@mui/icons-material/Message';
import { PersonalInfoContext } from './PersonalInfoProvider';
import Box from '@mui/material/Box';
import profile from '/src/assets/profile.jpg';
import { Book, BookSharp, Group } from '@mui/icons-material';
import { useTheme } from './ThemeProvider';
import logo from '/src/assets/Logo.png';

export default function NestedList({  open, toggleNestedList, setSidebarHovered}) {
  const navigate = useNavigate();
  const { personalInfo } = React.useContext(PersonalInfoContext);
  const [isHovered, setIsHovered] = React.useState(false);
  const user = personalInfo
  const [imgSrc, setImgSrc] = React.useState(profile);
  const { darkMode,toggleTheme,theme  } = useTheme(); // Prevent `undefined` access

  React.useEffect(() => {
    if (user?.profileImg) {
      const imageUrl = `http://localhost:8081/profileImages/${user.profileImg}`;
      setImgSrc(imageUrl);
    }
  }, [user?.profileImg]);
  // Handlers for hover events
  const handleMouseEnter = () => {
    setSidebarHovered(true);
    toggleNestedList();
    setIsHovered(true)
  };

  const handleMouseLeave = () => {
    setSidebarHovered(false);
    toggleNestedList();
    setIsHovered(false)
  };

  const isSidebarOpen = isHovered ;

  const handleHomeClick = () => {
    navigate('/home', { state: { user: personalInfo } });
  };
  
  const handleMessagesClick = () => {
    navigate('/messages', { state: { user: personalInfo } });
  };

  const handleNotesClick = () => {
    navigate('/notes', { state: { user: personalInfo } });
  };

  const handleFileClick = () => {
    navigate('/files');
  };

  const handleTodolistClick = () => {
    navigate('/todolist', { state: { user: personalInfo } });
  };

  const handleGroupClick = () => {
    navigate('/group', { state: { user: personalInfo } });
  };

  const goHome = () => {
    navigate('/home');
  };

  return (
    <div
      style={{
        height: '100vh',
        position: 'fixed',
        left: 0,
        marginRight:0,
        top: 0,
        overflow:"hidden",
        
        display: 'flex',
        gap:0,
        backgroundColor: (theme) => theme.palette.background.default,  // Using theme for background color
        color: (theme) => theme.palette.text.primary, 
        flexDirection: 'column',
        zIndex: 2,
      }}
    >
      <List
        sx={{
          width: isSidebarOpen ? '260px' : '90px', 
          height: '100%',
          bgcolor: 'white',
          position: 'relative',
          backgroundColor: (theme) => theme.palette.background.default,  // Using theme for background color
          color: (theme) => theme.palette.text.primary,
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          borderRight: darkMode?'1px solid green':'1px solid #e0e0e0',
          display: 'flex',
          marginRight:0,
          gap:0,
          flexDirection: 'column',
          transition: 'width 0.6s ease', 
          overflow: 'hidden', 
        }}
        onMouseEnter={handleMouseEnter} // Expand sidebar on hover
        onMouseLeave={handleMouseLeave} // Collapse sidebar on mouse leave

        component="nav"
      >
        {/* Sidebar Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isSidebarOpen ? 'space-between' : 'center',
            padding: '15px',
            borderBottom: darkMode?'1px solid green':'1px solid #e0e0e0',
            transition: 'all 0.8s ease', 
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: isSidebarOpen ? '10px' : '0',
              transition: 'gap 0.3s ease', 
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                backgroundImage: `url(${logo})`, // Replace with your logo's URL
                backgroundSize: 'cover',
                cursor:"pointer",
                backgroundPosition: 'center',
                
              }}
              onClick={handleHomeClick}
            />
            {isSidebarOpen && (
              <Typography
                variant="h6"
                noWrap
                sx={{
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  color: '#487d4b',
                  fontFamily: 'Minecraftia, sans-serif',
                  fontSize: '16px',
                  opacity: isSidebarOpen ? 1 : 0,
                  transition: 'opacity 1s ease',
                }}
                onClick={handleHomeClick} // Add the same onClick event handler
              >
                NoteCraft
              </Typography>
            )}
          </div>
        </div>

        <Divider />

         {/* List Items */}
         <div style={{ flexGrow: 1, marginTop: '25px' }}>
          {[
            { label: 'Notes', icon: <DescriptionIcon />, onClick: handleNotesClick },
            { label: 'Todo List', icon: <FormatListBulletedIcon />, onClick: handleTodolistClick },
            { label: 'Files', icon: <FolderIcon />, onClick: handleFileClick },
            { label: 'Messages', icon: <MessageIcon />, onClick: handleMessagesClick },
            { label: 'Notebooks', icon: <Book />, onClick: handleGroupClick },
          ].map((item, index) => (
            <ListItemButton
              key={index}
              onClick={item.onClick}
              sx={{
                justifyContent: isSidebarOpen ? 'flex-start' : 'center',
                alignItems: 'center',
                padding: isSidebarOpen ? '8px 16px' : '8px 0',
                minHeight: '48px',
                transition: 'all 0.8s ease',
              
                display: 'flex',
                flexDirection: 'row',
                gap: isSidebarOpen ? '16px' : 0, 
              }}
            >
              <ListItemIcon
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: '#579A59',
                  minWidth: '48px', // Ensures consistent spacing between icons and text
                  width: '48px',
                  
                  height: '60px',
                  transition: 'all 0.8s ease',
                  '& svg': {
                    fontSize: '1.7rem',
                  },
                }}
              >
                {item.icon}
              </ListItemIcon>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  overflow: 'hidden',
                  opacity: isSidebarOpen ? 1 : 0,
                  visibility: isSidebarOpen ? 'visible' : 'hidden',
                  transition: 'opacity 0.8s ease, visibility 0.3s ease, width 0.8s ease',
                  whiteSpace: 'nowrap',
                  width: isSidebarOpen ? 'auto': 0,
                }}
              >
                <ListItemText
                  primary={item.label}
                  sx={{
                    '& span': {
                      color: (theme)=>theme.palette.text.primary,
                      fontSize: '15px',
                      fontWeight: 500,
                      transition: 'opacity 0.8s ease',
                    },
                  }}
                />
              </Box>
            </ListItemButton>
            
          ))}
          
        </div>
        {/* Profile Section */}
        <Box
          sx={{
            display: 'flex',
            
            justifyContent: isSidebarOpen ? 'flex-start' : 'center',
            padding: '25px',
            gap: '15px',
            borderTop: darkMode?'1px solid green':'1px solid #e0e0e0',
            transition: 'all 0.3s ease',
          }}
        >
          <Box
            component="img"
            src={imgSrc} 
            alt="Profile"
            sx={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              transition: 'all 0.8s ease',
            }}
          />
          {isSidebarOpen && (
            <Box sx={{ textAlign: 'left' }}>
              <Typography
                variant="body1"
                sx={{ fontWeight: 'bold', fontSize: '15px', color:darkMode?"#fff": '#333' }}
              >
                {personalInfo?.firstName+" "+personalInfo.lastName|| 'Guest'} 
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '13px', color:darkMode?"#fff": '#333'  }}>
                {personalInfo?.email || 'guest@email.com'} 
              </Typography>
            </Box>
          )}
        </Box>
      </List>

    </div>
  );
}
