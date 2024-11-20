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
  Container,
  Paper,
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

const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#f4f4f4",
    minHeight: "100vh",
  },
  header: {
    textAlign: "center",
    color: "#2e7d32", // Green theme
    fontWeight: "bold",
    marginBottom: "20px",
  },
  sectionTitle: {
    color: "#388e3c",
    marginBottom: "15px",
  },
  listItem: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    marginBottom: "10px",
  },
  button: {
    marginTop: "15px",
    padding: "12px 24px",
    backgroundColor: "#388e3c", // Green button
    color: "#fff",
    '&:hover': {
      backgroundColor: "#2e7d32",
    },
  },
};

export default function StudyGroupPage() {
  const location = useLocation();
  const personalInfo = location.state?.user || { id: "", username: "" };
  const userId = personalInfo.id;

  const [studyGroups, setStudyGroups] = useState([]);
  const [responseMessage, setResponseMessage] = useState("");
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openJoinModal, setOpenJoinModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [groupIdToJoin, setGroupIdToJoin] = useState("");
  const [loading, setLoading] = useState(false);

  const apiBaseUrl = "http://localhost:8081/api/study-groups";
  const navigate = useNavigate();

  const fetchUserGroups = async () => {
    try {
      const response = await axios.get(
        `${apiBaseUrl}/getStudyGroupByOwner/owner/${userId}`
      );
      setStudyGroups(response.data);
    } catch (error) {
      console.error("Error fetching study groups:", error);
      setResponseMessage("Error fetching study groups.");
    }
  };

  useEffect(() => {
    fetchUserGroups();
  }, [userId]);

  const handleGroupClick = (groupId) => {
    navigate(`/group-details/${groupId}`);
  };

  const handleCreateGroup = async () => {
    if (!groupName || !description) {
      setResponseMessage("Group name and description are required.");
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
      setOpenCreateModal(false);
      setGroupName("");
      setDescription("");
    } catch (error) {
      console.error("Error creating group:", error);
      setResponseMessage("Failed to create group. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async () => {
    if (!groupIdToJoin) {
      setResponseMessage("Group ID is required to join a group.");
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
      setOpenJoinModal(false);
      setGroupIdToJoin("");
    } catch (error) {
      console.error("Error joining group:", error);
      setResponseMessage("Failed to join group. Check the Group ID.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container style={styles.container}>
      <Typography variant="h4" style={styles.header}>
        Study Group Manager
      </Typography>
      <Typography variant="h6" style={styles.sectionTitle}>
        Your Study Groups
      </Typography>
      <List>
        {studyGroups.map((group) => (
          <ListItem
            button
            key={group.groupId}
            onClick={() => handleGroupClick(group.groupId)}
            style={styles.listItem}
          >
            <ListItemText
              primary={group.groupName}
              secondary={`Description: ${group.description}`}
            />
          </ListItem>
        ))}
      </List>
      {responseMessage && (
        <Typography color="error" style={{ marginTop: "15px" }}>
          {responseMessage}
        </Typography>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenCreateModal(true)}
        style={styles.button}
      >
        Create New Group
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => setOpenJoinModal(true)}
        style={{ ...styles.button, marginLeft: "10px", backgroundColor: "#e0e0e0" }}
      >
        Join Group
      </Button>
    </Container>
  );
}
