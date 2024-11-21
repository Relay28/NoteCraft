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
import NestedList from "./SideBar"; // Assuming Sidebar is in the same directory

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
      setStudyGroups(response.data);
    } catch (error) {
      console.error("Error fetching study groups:", error);
      setResponseMessage("Error fetching study groups.");
      setResponseType("error");
      setSnackbarOpen(true);
    }
  };
  console.log(studyGroups)
  useEffect(() => {
    fetchUserGroups();
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
        groupName,
        description,
        owner: { id: userId },
      };

      const response = await axios.post(`${apiBaseUrl}/createStudyGroup`, newGroup);
      setStudyGroups((prev) => [...prev, response.data]);
      setResponseMessage("Group created successfully!");
      setResponseType("success");
      setOpenCreateModal(false);
      setGroupName("");
      setDescription("");
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
      setStudyGroups((prev) => [...prev, response.data]);
      setResponseMessage("Joined group successfully!");
      setResponseType("success");
      setOpenJoinModal(false);
      setGroupIdToJoin("");
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
    <Box sx={{ display: "flex",left:"0",margin:"0" }}>
    
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" sx={{ mb: 2, color: "#487d4b" }}>
          Study Group Manager
        </Typography>

        <Typography variant="h6" sx={{ mb: 2, color: "#333" }}>
          Your Study Groups
        </Typography>

        <List>
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

        {/* Buttons */}
        <Box sx={{ mt: 3 }}>
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

        {/* Create Group Modal */}
        <Modal open={openCreateModal} onClose={() => setOpenCreateModal(false)}>
          <Box sx={modalStyle}>
            <Typography variant="h6" sx={{ mb: 2 }}>
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
        <Modal open={openJoinModal} onClose={() => setOpenJoinModal(false)}>
          <Box sx={modalStyle}>
            <Typography variant="h6" sx={{ mb: 2 }}>
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
