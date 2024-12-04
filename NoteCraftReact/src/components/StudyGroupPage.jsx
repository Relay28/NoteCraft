import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  Modal,
  Box,
  TextField,
  CircularProgress,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export default function StudyGroupPage() {
  const location = useLocation();
  const personalInfo = location.state?.user || { id: "", username: "" };
  const userId = personalInfo.id;

  const [studyGroups, setStudyGroups] = useState([]);
  const [responseMessage, setResponseMessage] = useState("");
  const [responseType, setResponseType] = useState("info");
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openJoinModal, setOpenJoinModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [groupIdToJoin, setGroupIdToJoin] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const apiBaseUrl = "http://localhost:8081/api/study-groups";
  const navigate = useNavigate();

  const fetchUserGroups = async () => {
    try {
      const response = await axios.get(
        `${apiBaseUrl}/getGroupsForUser/${userId}`
      );
      setStudyGroups(response.data || []);
      console.log("Updated studyGroups:", studyGroups);
      console.log(response)
    } catch (error) {
      console.error("Error fetching study groups:", error);
      setResponseMessage("Error fetching study groups.");
      setResponseType("error");
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserGroups();
    }
  }, [userId]);

  const handleGroupClick = (groupId) => {
    navigate(`/group-details/${groupId}`);
  };

  const handleCreateGroup = async () => {
    if (!groupName || !description) {
      setResponseMessage("Group name and description are required.");
      setResponseType("warning");
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);
    try {
      const newGroup = {
        groupName: groupName,
        description: description,
        owner: { id: userId },
      };

      const response = await axios.post(`${apiBaseUrl}/createStudyGroup`, newGroup);
      if (response.data) {
        setStudyGroups((prev) => [...(prev || []), response.data]);
        setResponseMessage("Group created successfully!");
        setResponseType("success");
        setOpenCreateModal(false);
        setGroupName("");
        setDescription("");
      }
    } catch (error) {
      console.error("Error creating group:", error);
      setResponseMessage("Failed to create group. Try again.");
      setResponseType("error");
    } finally {
      setLoading(false);
      setSnackbarOpen(true);
    }
  };

  const handleJoinGroup = async () => {
    if (!groupIdToJoin) {
      setResponseMessage("Group ID is required to join a group.");
      setResponseType("warning");
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${apiBaseUrl}/${groupIdToJoin}/add-users`,
        [userId]
      );
      if (response.data) {
        setStudyGroups((prev) => [...(prev || []), response.data]);
        setResponseMessage("Joined group successfully!");
        setResponseType("success");
        setOpenJoinModal(false);
        setGroupIdToJoin("");
      }
    } catch (error) {
      console.error("Error joining group:", error);
      setResponseMessage("Failed to join group. Check the Group ID.");
      setResponseType("error");
    } finally {
      setLoading(false);
      setSnackbarOpen(true);
    }
  };

  const closeSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ display: "flex", left: "0", margin: "0", width: "75%", height: "100vh", }}>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" sx={{ mb: 2, color: "#487d4b" }}>
          Group Manager
        </Typography>

        {/* Buttons at the top */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Box>
            <Button
              variant="contained"
              color="success"
              onClick={() => setOpenCreateModal(true)}
              sx={{ mr: 2 }}
            >
              Create New Group
            </Button>
            <Button
              variant="outlined"
              color="success"
              onClick={() => setOpenJoinModal(true)}
            >
              Join Group
            </Button>
          </Box>
        </Box>

        <Typography variant="h6" sx={{ mb: 2, color: "#333" }}>
          Your Groups
        </Typography>

        {studyGroups.length > 0 ? (
          <List sx={{ maxHeight: "70vh", overflow: "auto", padding: 0 }}>
            {studyGroups.map((group) => (
              <React.Fragment key={group.groupId}>
                <ListItem button onClick={() => handleGroupClick(group.groupId)}>
                  <ListItemText
                    primary={group.groupName}
                    secondary={`Description: ${group.description}`}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No groups found. Create or join a group to get started!
          </Typography>
        )}

        {/* Create Group Modal */}
        <Modal 
          open={openCreateModal} 
          onClose={() => setOpenCreateModal(false)}
          // Add these props to prevent undefined error
          aria-labelledby="create-group-modal-title"
          aria-describedby="create-group-modal-description"
        >
          <Box sx={modalStyle}>
            <Typography id="create-group-modal-title" variant="h6" sx={{ mb: 2 }}>
              Create a New Study Group
            </Typography>
            <TextField
              fullWidth
              margin="normal"
              label="Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Button
              fullWidth
              variant="contained"
              color="success"
              onClick={handleCreateGroup}
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : "Create Group"}
            </Button>
          </Box>
        </Modal>

        {/* Join Group Modal */}
        <Modal 
          open={openJoinModal} 
          onClose={() => setOpenJoinModal(false)}
          // Add these props to prevent undefined error
          aria-labelledby="join-group-modal-title"
          aria-describedby="join-group-modal-description"
        >
          <Box sx={modalStyle}>
            <Typography id="join-group-modal-title" variant="h6" sx={{ mb: 2 }}>
              Join a Study Group
            </Typography>
            <TextField
              fullWidth
              margin="normal"
              label="Group ID"
              value={groupIdToJoin}
              onChange={(e) => setGroupIdToJoin(e.target.value)}
            />
            <Button
              fullWidth
              variant="contained"
              color="success"
              onClick={handleJoinGroup}
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : "Join Group"}
            </Button>
          </Box>
        </Modal>

        {/* Snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={closeSnackbar}
        >
          <Alert onClose={closeSnackbar} severity={responseType}>
            {responseMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}