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
  Drawer,
  IconButton,
  Card,
  CardContent,
  Avatar,
  Divider,
  Tabs,
  Tab,
} from '@mui/material';
import { PersonAdd, People, AddCircle } from '@mui/icons-material';
import axios from 'axios';
import { PersonalInfoContext } from './PersonalInfoProvider';

// Sidebar custom theme
const sidebarGreen = '#487d4b'; // Sidebar accent color

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
  const [groupDetails, setGroupDetails] = useState({
    groupId: null,
    groupName: '',
    description: '',
    files: [],
    groupChats: [],
    notes: [],
    toDoLists: [],
    users: []
});

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
    title: '',
    description: '',
    content: '',
    dateCreated: new Date().toISOString(),
    userId: user ? user.id : null,
  });

  // Handle Note Creation
  const handleCreateNote = async () => {
    try {
      const payload = { ...note, userId: user.id };
      const response = await axios.post(`${apiBaseUrl}/${groupId}/add-note`, payload, { params: { userId: user.id } });
      setNotes((prev) => [...prev, response.data]);
      setOpenNoteModal(false);
      setNote({ title: '', description: '', content: '', dateCreated: new Date().toISOString(), userId: user.id });
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

    
  const handleAddMember = async () => {
    try {
      const response = await axios.post(`${apiBaseUrl}/${groupId}/add-users`, [newMemberId]);
      setGroupDetails((prev) => ({
        ...prev,
        users: response.data.users,
      }));
      setMembers( response.data.users);
      setNewMemberId('');
      setOpenAddMemberModal(false);
      setResponseMessage('Member added successfully!');
    } catch {
      setResponseMessage('Failed to add member.');
    }
  };
useEffect
  // Tab Switch Handler
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Box p={3} sx={{ maxWidth: '75%', margin: '0 auto', marginLeft: 0 }}>
      {/* Group Title and Description */}
      <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', borderBottom: `2px solid ${sidebarGreen}`, pb: 1 }}>
        {groupDetails.groupName}
      </Typography>
      <Typography variant="subtitle1" align="center" sx={{ color: 'text.secondary', mb: 4 }}>
        {groupDetails.description}
      </Typography>

      {/* Tabs */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Tabs value={tabIndex} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
          <Tab label="Notes" />
          <Tab label="Files" />
          <Tab label="To-Dos" />
        </Tabs>
        <Box>
          <IconButton color="success" onClick={() => setOpenMemberDrawer(true)} sx={{ mr: 2 }}>
            <People />
          </IconButton>

          <Button variant="outlined" color="success" onClick={() => setOpenAddMemberModal(true)} sx={{ textTransform: 'none', fontWeight: 'bold' }}>
            Add Member
          </Button>
        </Box>
      </Box>

      {/* Tab Panels */}
      <Box>
        {tabIndex === 0 && (
          <Card sx={{ mb: 3, backgroundColor: 'background.paper', boxShadow: 2, borderRadius: 2 }}>
            <CardContent>
              <Button
                variant="contained"
                color="success"
                onClick={() => setOpenNoteModal(true)}
                startIcon={<AddCircle />}
                sx={{ mb: 2, fontWeight: 'bold', textTransform: 'none' }}
              >
                Add Note
              </Button>
              <List>
                {notes.map((note) => (
                  <ListItem key={note.noteid} sx={{ borderBottom: 1, borderColor: 'divider' }}>
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
          <Card sx={{ mb: 3, backgroundColor: 'background.paper', boxShadow: 2, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Files functionality coming soon!
              </Typography>
            </CardContent>
          </Card>
        )}

        {tabIndex === 2 && (
          <Card sx={{ mb: 3, backgroundColor: 'background.paper', boxShadow: 2, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                To-Dos functionality coming soon!
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>

      {/* Member Drawer */}
      <Drawer anchor="right" open={openMemberDrawer} onClose={() => setOpenMemberDrawer(false)} sx={{ width: 300 }}>
  <Box sx={{ width: 300, padding: 2 }}>
    <Typography variant="h6" sx={{ mb: 2 }}>
      Group Members
    </Typography>
    <List>
      {/* Render owner separately at the top */}
      {members.filter(member => member.isOwner).map(owner => (
        <ListItem key={owner.id} sx={{ backgroundColor: '#f0f0f0' }}>
          <Avatar sx={{ mr: 2 }} alt={owner.name} src={owner.profileImg || '/default-avatar.png'} />
          <ListItemText primary={`${owner.name} (Owner)`} />
        </ListItem>
      ))}
      
      {/* Render the rest of the members */}
      {members.filter(member => !member.isOwner).map(member => (
        <ListItem key={member.id}>
          <Avatar sx={{ mr: 2 }} alt={member.name} src={member.profileImg || '/default-avatar.png'} />
          <ListItemText primary={member.name} />
        </ListItem>
      ))}
    </List>
  </Box>
</Drawer>

      {/* Modals for Notes, Files, To-Dos, and Adding Members */}
      <Modal open={openNoteModal} onClose={() => setOpenNoteModal(false)}>
        <Box sx={modalStyle}>
          <TextField label="Title" fullWidth value={note.title} onChange={(e) => setNote({ ...note, title: e.target.value })} sx={{ mb: 2 }} />
          <TextField label="Description" fullWidth value={note.description} onChange={(e) => setNote({ ...note, description: e.target.value })} sx={{ mb: 2 }} />
          <TextField label="Content" fullWidth multiline rows={4} value={note.content} onChange={(e) => setNote({ ...note, content: e.target.value })} sx={{ mb: 2 }} />
          <Button variant="contained" color="success" onClick={handleCreateNote} sx={{ fontWeight: 'bold' }}>
            Save Note
          </Button>
        </Box>
      </Modal>

      {/* Add Member Modal */}
      <Modal open={openAddMemberModal} onClose={() => setOpenAddMemberModal(false)}>
        <Box sx={modalStyle}>
          <TextField label="Enter Member ID" fullWidth value={newMemberId} onChange={(e) => setNewMemberId(e.target.value)} sx={{ mb: 2 }} />
          <Button variant="contained" color="primary" onClick={handleAddMember} sx={{ fontWeight: 'bold' }}>
            Add Member
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}
