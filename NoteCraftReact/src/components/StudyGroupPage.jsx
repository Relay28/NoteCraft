import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tooltip,
  IconButton,
  Chip,
  TextField,
  Snackbar,
  Alert
} from "@mui/material";
import { 
  Add as AddIcon, 
  Groups as GroupsIcon, 
  Delete as DeleteIcon, 
  ExitToApp as LeaveIcon,
  Settings as SettingsIcon 
  
} from '@mui/icons-material';
import { Book as BookIcon } from '@mui/icons-material';
import { useTheme } from './ThemeProvider';

export default function StudyGroupPage() {
  const location = useLocation();
  const personalInfo = location.state?.user || { id: "", username: "" };
  const userId = personalInfo.id;

  const [studyGroups, setStudyGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState(null);
  const [loading, setLoading] = useState(false);

  // New state for create/join group modals
  const [createGroupModalOpen, setCreateGroupModalOpen] = useState(false);
  const [joinGroupModalOpen, setJoinGroupModalOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [groupCode, setGroupCode] = useState("");

  // Snackbar state for notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const apiBaseUrl = "http://localhost:8081/api/study-groups";
  const navigate = useNavigate();

  const fetchUserGroups = async () => {
    try {
      const response = await axios.get(
        `${apiBaseUrl}/getGroupsForUser/${userId}`
      );
      setStudyGroups(response.data || []);
    } catch (error) {
      console.error("Error fetching study groups:", error);
      handleSnackbarOpen('Error fetching notebooks', 'error');
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserGroups();
    }
  }, [userId]);

  // Snackbar handler
  const handleSnackbarOpen = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const handleGroupClick = (groupId) => {
    navigate(`/group-details/${groupId}`);
  };

  // Create Group Handler
  const handleCreateGroup = async () => {
    try {
      setLoading(true);
      const groupData = {
        groupName:groupName,
        description: groupDescription,
        owner:{id:userId}
      };

      const response = await axios.post(`${apiBaseUrl}/createStudyGroup`, groupData);
      
      // Add the new group to the list
      setStudyGroups(prev => [...prev, response.data]);
      
      // Reset form and close modal
      setGroupName("");
      setGroupDescription("");
      setCreateGroupModalOpen(false);
      
      handleSnackbarOpen('Notebook created successfully');
    } catch (error) {
      console.error("Error creating group:", error);
      handleSnackbarOpen('Failed to create notebook', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Join Group Handler
  const handleJoinGroup = async () => {
    try {
      setLoading(true);
      // Assuming there's an endpoint to join a group 
      const response = await axios.post(`${apiBaseUrl}/${groupCode}/add-users`, [parseInt(userId)]);
      
      // Fetch updated groups after joining
      await fetchUserGroups();
      
      // Reset and close modal
      setGroupCode("");
      setJoinGroupModalOpen(false);
      
      handleSnackbarOpen('Successfully joined notebook');
    } catch (error) {
      console.error("Error joining group:", error);
      handleSnackbarOpen('Failed to join notebook', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveGroup = async () => {
    if (!selectedGroup) return;

    try {
      setLoading(true);
      console.log(selectedGroup.groupId)
      await axios.post(`${apiBaseUrl}/leave?userId=${userId}&studyGroupId=${selectedGroup.groupId}`);


      // Remove the group from the list
      setStudyGroups(prev => prev.filter(group => group.groupId !== selectedGroup.groupId));
      setDialogOpen(false);
      
      handleSnackbarOpen('Successfully left notebook');
    } catch (error) {
      console.error("Error leaving group:", error);
      handleSnackbarOpen('Failed to leave notebook', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGroup = async () => {
    if (!selectedGroup) return;

    try {
      setLoading(true);
      await axios.delete(`${apiBaseUrl}/deleteStudyGroup/${selectedGroup.groupId}`, {
        params: { userId }
      });

      // Remove the group from the list
      setStudyGroups(prev => prev.filter(group => group.groupId !== selectedGroup.groupId));
      setDialogOpen(false);
      
      handleSnackbarOpen('Notebook deleted successfully');
    } catch (error) {
      console.error("Error deleting group:", error);
      handleSnackbarOpen('Failed to delete notebook', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openDialog = (group, type) => {
    setSelectedGroup(group);
    setDialogType(type);
    setDialogOpen(true);
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      padding: 3, 
      backgroundColor: '#f4f6f9', 
      marginRight:10,
      minHeight: '100vh' ,
      backgroundColor:(theme)=>theme.palette.background.default
    }}>
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 3 
      }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 'bold', 
            color: '#2c3e50',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            color:(theme)=>theme.palette.text.primary
          }}
        >
          <GroupsIcon fontSize="large" /> 
          My Notebooks
        </Typography>
        
        <Box sx={{marginRight:5}}> 
          <Tooltip title="Create Notebook">
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<AddIcon />}
              onClick={() => setCreateGroupModalOpen(true)}
              sx={{ marginRight: 2 }}
            >
              New Notebook
            </Button>
          </Tooltip>
        
        </Box>
      </Box>

      {/* Create Group Modal */}
      <Dialog
        open={createGroupModalOpen}
        onClose={() => setCreateGroupModalOpen(false)}
        aria-labelledby="create-group-dialog-title"
      >
        <DialogTitle id="create-group-dialog-title">Create New Notebook</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Notebook Name"
            fullWidth
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={groupDescription}
            onChange={(e) => setGroupDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateGroupModalOpen(false)} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleCreateGroup} 
            color="primary"
            disabled={!groupName || loading}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Join Group Modal */}
      <Dialog
        open={joinGroupModalOpen}
        onClose={() => setJoinGroupModalOpen(false)}
        aria-labelledby="join-group-dialog-title"
      >
        <DialogTitle id="join-group-dialog-title">Join Notebook</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Notebook Code"
            fullWidth
            value={groupCode}
            onChange={(e) => setGroupCode(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setJoinGroupModalOpen(false)} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleJoinGroup} 
            color="primary"
            disabled={!groupCode || loading}
          >
            Join
          </Button>
        </DialogActions>
      </Dialog>

      {/* Group List */}
      {studyGroups.length === 0 ? (
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '60vh',
            textAlign: 'center'
          }}
        >
          <Typography variant="h5" color="textSecondary">
            You haven't created any notebooks yet
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
            Start by creating a new notebook or joining an existing one
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
        {studyGroups.map((group) => (
          <Grid item xs={12} sm={6} md={4} key={group.groupId}>
            <Card 
              elevation={3} 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': { 
                  transform: 'translateY(-10px)',
                  boxShadow: '0 15px 30px rgba(0,0,0,0.1)' 
                }
              }}
            >
              <CardContent sx={{ 
                flexGrow: 1, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                p: 3 
              }}>
                <BookIcon 
                  sx={{ 
                    fontSize: 80, 
                    color: 'primary.main', 
                    mb: 2 
                  }} 
                />
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  width: '100%' 
                }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600, 
                      color: (theme)=>theme.palette.text.primary, 
                      textAlign: 'center'
                      
                    }}
                  >
                    {group.groupName}
                  </Typography>
                  {group.owner === userId && (
                    <Chip 
                      label="Owner" 
                      size="small" 
                      color="primary" 
                      variant="contained" 
                      sx={{ 
                        ml: 1,
                        fontWeight: 500,
                        borderRadius: 2 
                      }} 
                    />
                  )}
                </Box>
              </CardContent>
              <CardActions sx={{ 
                p: 2, 
                pt: 0, 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
              }}>
                <Button 
                  variant="outlined" 
                  color="primary"
                  size="small"
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500
                  }}
                  onClick={() => handleGroupClick(group.groupId)}
                >
                  Open
                </Button>
                <Box>
                  {group.owner === userId ? (
                    <Tooltip title="Delete Notebook">
                      <IconButton 
                        color="error"
                        size="small"
                        onClick={() => openDialog(group, 'delete')}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Leave Notebook">
                      <IconButton 
                        color="secondary"
                        size="small"
                        onClick={() => openDialog(group, 'leave')}
                      >
                        <LeaveIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      )}

      {/* Confirmation Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {dialogType === 'leave' 
            ? 'Leave Notebook' 
            : 'Delete Notebook'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialogType === 'leave'
              ? `Are you sure you want to leave the notebook "${selectedGroup?.groupName}"?`
              : `Are you sure you want to permanently delete the notebook "${selectedGroup?.groupName}"? This action cannot be undone.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={dialogType === 'leave' ? handleLeaveGroup : handleDeleteGroup} 
            color="error" 
            autoFocus
            disabled={loading}
          >
            {dialogType === 'leave' ? 'Leave' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}