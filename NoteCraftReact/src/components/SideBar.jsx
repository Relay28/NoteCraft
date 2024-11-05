import * as React from 'react';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DescriptionIcon from '@mui/icons-material/Description';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FolderIcon from '@mui/icons-material/Folder';
import MessageIcon from '@mui/icons-material/Message';
import { useNavigate } from 'react-router-dom';

export default function NestedList({ open, toggleNestedList }) { 
  const [isOpen, setIsOpen] = React.useState(true);
  const navigate=useNavigate();

  const handleMessagesClick = () => {
    navigate('/messages'); // Programmatically navigate to /messages
  };

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  React.useEffect(() => {
    if (!open) {
      setIsOpen(false);
    }
  }, [open]);

  return (
    <List
      sx={{ 
        width: '20%', 
        height:"100%",
        bgcolor: '  ', 
        position: 'fixed', 
        top: '60px', 
        color:"#487d4b",
        left: 0,
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)', 
        borderRadius:"20px",
      }} 
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader" sx={{ bgcolor: '#579A59' }}>
         
        </ListSubheader>
      }
    >
      <div style={{marginTop: "50px", justifyContent:"center"}}><h2 sx={{left:0}}>Workspace</h2></div>

      <div style={{marginLeft: "30px", marginTop:"30px"}}>
      <ListItemButton sx={{ mb: 2 ,mt:2}}> {/* Added marginBottom for spacing */}
        <ListItemIcon sx={{ minWidth: '40px', color:"#579A59" }}> 
          <DescriptionIcon sx={{ fontSize: '30px' }} />
        </ListItemIcon>
        <ListItemText primary="Notes" />
      </ListItemButton>

      <ListItemButton sx={{ mb: 2 }}> {/* Added marginBottom for spacing */}
        <ListItemIcon sx={{ minWidth: '40px', color:"#579A59" }}>
          <FormatListBulletedIcon sx={{ fontSize: '30px' }} />
        </ListItemIcon>
        <ListItemText primary="Todo List" />
      </ListItemButton>

      <ListItemButton sx={{ mb: 2 }}> {/* Added marginBottom for spacing */}
        <ListItemIcon sx={{ minWidth: '40px', color:"#579A59" }}>
          <FolderIcon sx={{ fontSize: '30px' }} />
        </ListItemIcon>
        <ListItemText primary="Files" />
      </ListItemButton>

      <ListItemButton sx={{ mb: 2 }} onClick={handleMessagesClick}> {/* Added marginBottom for spacing */}
        <ListItemIcon sx={{ minWidth: '40px', color:"#579A59" }}>
          <MessageIcon sx={{ fontSize: '30px' }} />
        </ListItemIcon>
        <ListItemText primary="Messages" />
      </ListItemButton>
      </div>
    </List>
  );
}