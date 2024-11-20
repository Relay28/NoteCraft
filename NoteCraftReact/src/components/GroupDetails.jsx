import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import {
  Typography,
  Button,
  Box,
  TextField,
  List,
  ListItem,
  ListItemText,
  Modal,
  Divider,
  Tabs,
  Tab,
  Drawer,
  IconButton,
  Card,
  CardContent,
  Grid,
  Avatar,
} from '@mui/material';
import { PersonAdd, People, AddCircle } from '@mui/icons-material';
import axios from 'axios';
import { PersonalInfoContext } from './PersonalInfoProvider';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export default function GroupDetailsPage() {
  const { personalInfo } = useContext(PersonalInfoContext);
  const user = personalInfo;
  const { groupId } = useParams();
  const [groupDetails, setGroupDetails] = useState({});
  const [notes, setNotes] = useState([]);
  const [files, setFiles] = useState([]);
  const [todos, setTodos] = useState([]);
  const [members, setMembers] = useState([]);
  const [responseMessage, setResponseMessage] = useState('');

  const [openNoteModal, setOpenNoteModal] = useState(false);
  const [openFileModal, setOpenFileModal] = useState(false);
  const [openTodoModal, setOpenTodoModal] = useState(false);
  const [openAddMemberModal, setOpenAddMemberModal] = useState(false);
  const [openMemberDrawer, setOpenMemberDrawer] = useState(false);

  const [newNote, setNewNote] = useState('');
  const [newTodo, setNewTodo] = useState('');
  const [newFile, setNewFile] = useState(null);
  const [newMemberId, setNewMemberId] = useState('');

  const [tabIndex, setTabIndex] = useState(0);

  const apiBaseUrl = 'http://localhost:8081/api/study-groups';

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/getStudyGroupById/${groupId}`);
        setGroupDetails(response.data);
        setNotes(response.data.notes || []);
        setFiles(response.data.files || []);
        setTodos(response.data.todos || []);
        setMembers(response.data.members || []);
      } catch (error) {
        setResponseMessage('Error fetching group details.');
      }
    };
    fetchGroupData();
  }, [groupId]);

  const [note, setNote] = useState({
    title: "",
    description: "",
    content: "",
    dateCreated: new Date().toISOString(),
    userId: user ? user.id : null,
  });

  // Handle Note Creation
  const handleCreateNote = async () => {
    try {
      const payload = { ...note, userId: user.id };
      const response = await axios.post(`${apiBaseUrl}/${groupId}/add-note`, payload, { params: { userId: user.id } });
      setNotes((prev) => [...prev, response.data]); // Update the notes list
      setOpenNoteModal(false); // Close the modal
      setNote({ title: "", description: "", content: "", dateCreated: new Date().toISOString(), userId: user.id });
      setResponseMessage('Note added successfully!');
    } catch (error) {
      setResponseMessage('Failed to add note.');
      console.error(error);
    }
  };

  // Handle File Upload
  const handleUploadFile = async () => {
    const formData = new FormData();
    formData.append('file', newFile);

    try {
      const response = await axios.post(`${apiBaseUrl}/${groupId}/add-file`, formData);
      setFiles((prev) => [...prev, response.data]);
      setOpenFileModal(false);
      setResponseMessage('File uploaded successfully!');
    } catch {
      setResponseMessage('Failed to upload file.');
    }
  };

  // Handle Todo Creation
  const handleAddTodo = async () => {
    try {
      const response = await axios.post(`${apiBaseUrl}/${groupId}/add-todo`, { todo: newTodo });
      setTodos((prev) => [...prev, response.data]);
      setOpenTodoModal(false);
      setNewTodo('');
      setResponseMessage('To-do added successfully!');
    } catch {
      setResponseMessage('Failed to add to-do.');
    }
  };

  // Handle Adding a Member
  const handleAddMember = async () => {
    try {
      await axios.post(`${apiBaseUrl}/${groupId}/add-users`, [newMemberId]);
      setOpenAddMemberModal(false);
      setNewMemberId('');
      setResponseMessage('Member added successfully!');
    } catch {
      setResponseMessage('Failed to add member.');
    }
  };

  // Tab Switch Handler
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Box p={3} sx={{ maxWidth: '1200px', margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
        {groupDetails.groupName}
      </Typography>
      <Typography variant="subtitle1" align="center" sx={{ mb: 4 }}>
        {groupDetails.description}
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Tabs value={tabIndex} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
          <Tab label="Notes" />
          <Tab label="Files" />
          <Tab label="To-Dos" />
        </Tabs>

        <Box>
          <IconButton
            color="primary"
            onClick={() => setOpenMemberDrawer(true)}
            sx={{ mr: 2 }}
          >
            <People />
          </IconButton>

          <Button
            variant="outlined"
            onClick={() => setOpenAddMemberModal(true)}
            sx={{ textTransform: 'none' }}
          >
            Add Member
          </Button>
        </Box>
      </Box>

      <Box mt={2}>
        {tabIndex === 0 && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Button
                variant="contained"
                onClick={() => setOpenNoteModal(true)}
                startIcon={<AddCircle />}
                sx={{ mb: 2 }}
              >
                Add Note
              </Button>
              <List>
                {notes.map((note) => (
                  <ListItem key={note.noteid} sx={{ borderBottom: '1px solid #ddd' }}>
                    <ListItemText
                      primary={note.title}
                      secondary={`Created by: ${note.user?.name || 'Unknown'} on ${note.dateCreated}`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        )}
        {tabIndex === 1 && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Button
                variant="contained"
                onClick={() => setOpenFileModal(true)}
                startIcon={<AddCircle />}
                sx={{ mb: 2 }}
              >
                Upload File
              </Button>
              <List>
                {files.map((file) => (
                  <ListItem key={file.id} sx={{ borderBottom: '1px solid #ddd' }}>
                    <ListItemText
                      primary={file.fileName}
                      secondary={`Uploaded by: ${file.uploaderName}`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        )}
        {tabIndex === 2 && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Button
                variant="contained"
                onClick={() => setOpenTodoModal(true)}
                startIcon={<AddCircle />}
                sx={{ mb: 2 }}
              >
                Add To-Do
              </Button>
              <List>
                {todos.map((todo) => (
                  <ListItem key={todo.id} sx={{ borderBottom: '1px solid #ddd' }}>
                    <ListItemText primary={todo.task} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        )}
      </Box>

      {/* Member Drawer */}
      <Drawer
        anchor="right"
        open={openMemberDrawer}
        onClose={() => setOpenMemberDrawer(false)}
        sx={{ width: '300px' }}
      >
        <Box sx={{ width: 300, padding: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Group Members
          </Typography>
          <List>
            {members.map((member) => (
              <ListItem key={member.id}>
                <Avatar sx={{ mr: 2 }} />
                <ListItemText primary={member.name} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Modal for Add Note */}
      <Modal open={openNoteModal} onClose={() => setOpenNoteModal(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Add a Note
          </Typography>
          <TextField
            fullWidth
            label="Title"
            value={note.title}
            onChange={(e) => setNote({ ...note, title: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Description"
            value={note.description}
            onChange={(e) => setNote({ ...note, description: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Content"
            value={note.content}
            onChange={(e) => setNote({ ...note, content: e.target.value })}
            sx={{ mb: 2 }}
          />
          <Button
            fullWidth
            variant="contained"
            onClick={handleCreateNote}
            disabled={!note.title || !note.description || !note.content}
          >
            Add Note
          </Button>
        </Box>
      </Modal>

      {/* Modal for Uploading File */}
      <Modal open={openFileModal} onClose={() => setOpenFileModal(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6">Upload File</Typography>
          <input
            type="file"
            onChange={(e) => setNewFile(e.target.files[0])}
            style={{ marginBottom: '16px' }}
          />
          <Button
            fullWidth
            variant="contained"
            onClick={handleUploadFile}
            disabled={!newFile}
          >
            Upload
          </Button>
        </Box>
      </Modal>

      {/* Modal for Adding To-Do */}
      <Modal open={openTodoModal} onClose={() => setOpenTodoModal(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6">Add To-Do</Typography>
          <TextField
            fullWidth
            placeholder="Enter to-do task"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button fullWidth variant="contained" onClick={handleAddTodo}>
            Add To-Do
          </Button>
        </Box>
      </Modal>

      {/* Modal for Adding Member */}
      <Modal open={openAddMemberModal} onClose={() => setOpenAddMemberModal(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6">Add Member</Typography>
          <TextField
            fullWidth
            placeholder="Enter user ID"
            value={newMemberId}
            onChange={(e) => setNewMemberId(e.target.value)}
          />
          <Button fullWidth variant="contained" onClick={handleAddMember}>
            Add Member
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}
