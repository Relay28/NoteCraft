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
import { Group } from '@mui/icons-material';

export default function NestedList({ open, toggleNestedList }) {
  const navigate = useNavigate();
  const { personalInfo } = React.useContext(PersonalInfoContext);

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
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 2,
      }}
    >
      <List
        sx={{
          width: open ? '260px' : '90px', // Sidebar width with smooth transition
          height: '100vh',
          bgcolor: 'white',
          position: 'relative',
          color: '#487d4b',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          borderRight: '1px solid #e0e0e0',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.3s ease', // Smooth width transition
          overflow: 'hidden', // Prevent content from overflowing during the transition
        }}
        component="nav"
      >
        {/* Sidebar Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: open ? 'space-between' : 'center',
            padding: '15px',
            borderBottom: '1px solid #e0e0e0',
            transition: 'all 0.3s ease', // Ensure smooth header transition
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: open ? '10px' : '0',
              transition: 'gap 0.3s ease', // Smooth gap adjustment
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                backgroundColor: '#d9d9d9',
                borderRadius: '50%',
              }}
            />
            {open && (
              <Typography
                variant="h6"
                noWrap
                sx={{
                  fontWeight: 'bold',
                  color: '#487d4b',
                  fontSize: '16px',
                  opacity: open ? 1 : 0,
                  transition: 'opacity 0.3s ease', // Smooth text fade-in
                }}
              >
                NoteCraft
              </Typography>
            )}
          </div>
          <div
            style={{
              cursor: 'pointer',
              transition: 'transform 0.3s ease', // Smooth icon rotation
            }}
            onClick={toggleNestedList} // Call the toggleSidebar function from App
          >
            {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </div>
        </div>

        <Divider />

        {/* List Items */}
        <div style={{ flexGrow: 1, marginTop: open ? '25px' : '25px' }}>
          {[
            { label: 'Notes', icon: <DescriptionIcon />, onClick: handleNotesClick },
            { label: 'Todo List', icon: <FormatListBulletedIcon />, onClick: handleTodolistClick },
            { label: 'Files', icon: <FolderIcon />, onClick: handleFileClick },
            { label: 'Messages', icon: <MessageIcon />, onClick: handleMessagesClick },
            { label: 'Group', icon: <Group />, onClick: handleGroupClick },
          ].map((item, index) => (
            <ListItemButton
              key={index}
              onClick={item.onClick}
              sx={{
                justifyContent: open ? 'flex-start' : 'center',
                alignItems: 'center',
                padding: open ? '8px 16px' : '8px 0',
                minHeight: '48px',
                transition: 'all 0.3s ease', // Smooth transitions for padding and alignment
                display: 'flex',
                flexDirection: 'row',
              }}
            >
              <ListItemIcon
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: '#579A59',
                  width: open ? '60px' : 'auto', // Adjust icon container width
                  height: '60px', // Maintain consistent height for smooth transitions
                  transition: 'all 0.3s ease', // Smooth transitions
                  '& svg': {
                    fontSize: '1.7rem', // Icon size
                  },
                }}
              >
                {item.icon}
              </ListItemIcon>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  overflow: 'hidden', // Prevent overflow during transitions
                  opacity: open ? 1 : 0,
                  visibility: open ? 'visible' : 'hidden', // Prevent rendering when closed
                  transition: 'opacity 0.3s ease, visibility 0.3s ease, width 0.3s ease', // Smooth fade-in/out and resizing
                  whiteSpace: 'nowrap', // Prevent text from wrapping
                  width: open ? 'auto' : 0, // Smoothly adjust text container width
                }}
              >
                <ListItemText
                  primary={item.label}
                  sx={{
                    '& span': {
                      fontSize: '15px',
                      fontWeight: 500,
                      transition: 'opacity 0.3s ease', // Ensure text opacity transitions match
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
            alignItems: 'center',
            justifyContent: open ? 'flex-start' : 'center',
            padding: '15px',
            gap: '15px',
            borderTop: '1px solid #e0e0e0',
            transition: 'all 0.3s ease',
          }}
        >
          <Box
            component="img"
            src={personalInfo?.profileImg || profile} // Use the imported profile image if profileImg is null
            alt="Profile"
            sx={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              transition: 'all 0.3s ease',
            }}
          />
          {open && (
            <Box sx={{ textAlign: 'left' }}>
              <Typography
                variant="body1"
                sx={{ fontWeight: 'bold', fontSize: '15px', color: '#333' }}
              >
                {personalInfo?.name || 'John Doe'} {/* Placeholder name if name is null */}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '13px', color: '#666' }}>
                {personalInfo?.email || 'no-email@domain.com'} {/* Placeholder email */}
              </Typography>
            </Box>
          )}
        </Box>
      </List>
    </div>
  );
}
