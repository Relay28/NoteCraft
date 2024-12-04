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
import { PersonAdd, People, AddCircle, Delete, Edit, Download } from '@mui/icons-material';
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
    groupId: groupId,
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
 
  const [members, setMembers] = useState([]);
  const [responseMessage, setResponseMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [openNoteModal, setOpenNoteModal] = useState(false);
  const [openFileModal, setOpenFileModal] = useState(false);
  const [openTodoModal, setOpenTodoModal] = useState(false);
  const [openAddMemberModal, setOpenAddMemberModal] = useState(false);
  const [openMemberDrawer, setOpenMemberDrawer] = useState(false);
  const [todo, setTodo] = useState({
    taskName: '',
    description: '',
    deadline: '',
    taskStarted: new Date().toISOString().split('T')[0],
    taskEnded: '',
    isCompleted: false,
    category: '',
    subTasks: [{ SubTaskName: '' }]
  });
  const [newNote, setNewNote] = useState('');
  const [todos, setTodos] = useState([]);
const [newTodoTitle, setNewTodoTitle] = useState('');
const [selectedTodo, setSelectedTodo] = useState(null);
const [openEditTodoModal, setOpenEditTodoModal] = useState(false);
  const [newFile, setNewFile] = useState(null);
  const [newMemberId, setNewMemberId] = useState('');
  const [openEditModal, setOpenEditModal] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState(null);
  const [fileToEdit, setFileToEdit] = useState(null);
const [openEditFileModal, setOpenEditFileModal] = useState(false);

  const [tabIndex, setTabIndex] = useState(0);

  const apiBaseUrl = 'http://localhost:8081/api/study-groups';
  //console.log(groupDetails.groupId)
  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/getStudyGroupById/${groupId}`);
        setGroupDetails(response.data);
        //console.log(response.data)
        setNotes(response.data.notes || []);
        setFiles(response.data.files || []);
        setTodos(response.data.todos || []);
        setMembers(response.data.users || []);
      } catch (error) {
        setResponseMessage('Error fetching group details.');
      }
    };
    fetchGroupData();
  }, [groupId]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
};
const fetchToDos = async () => {
  try {
    const response = await axios.get(`${apiBaseUrl}/group/${groupId}/user/${user.id}`);
    setTodos(response.data);
  } catch (error) {
    console.error('Failed to fetch To-Dos', error);
  }
};

const handleAddToDo = async () => {
  try {
    // Prepare the todo data for submission
    const todoWithDates = {
      ...todo,
      dateCreated: new Date().toISOString().split('T')[0],
      subTasks: todo.subTasks
        .filter(subtask => subtask.SubTaskName && subtask.SubTaskName.trim() !== '')
        .map(subtask => ({
          subTaskName: subtask.SubTaskName.trim()
        }))
    };

    const response = await axios.post(
      `${apiBaseUrl}/${groupId}/add-todo`, 
      todoWithDates, 
      { params: { userId: user.id } }
    );

    // Update the todos state with the new todo
    setTodos((prev) => [...prev, response.data]);
    
    // Reset the todo state
    setTodo({
      taskName: '',
      description: '',
      deadline: '',
      taskStarted: new Date().toISOString().split('T')[0],
      taskEnded: '',
      isCompleted: false,
      category: '',
      subTasks: [{ SubTaskName: '' }]
    });

    setOpenTodoModal(false);
  } catch (error) {
    console.error('Failed to add To-Do', error);
    alert(`Failed to save task: ${error.response?.data?.message || "Please try again."}`);
  }
};


// Edit To-Do
const handleEditToDo = async () => {
  try {
    // Store the original subtask IDs if they exist
    const originalSubtaskIds = selectedTodo.subTasks 
      ? selectedTodo.subTasks.map(subtask => subtask.subTaskID)
      : [];

    const updatedTodo = {
      ...selectedTodo,
      subTasks: selectedTodo.subTasks
        .filter(subtask => subtask.SubTaskName && subtask.SubTaskName.trim() !== '')
        .map((subtask, index) => ({
          ...(originalSubtaskIds[index] ? { subTaskID: originalSubtaskIds[index] } : {}),
          subTaskName: subtask.SubTaskName.trim() || ''
        }))
    };

    const response = await axios.put(
      `${apiBaseUrl}/${updatedTodo.id}/group/${groupId}/user/${user.id}`,
      updatedTodo
    );

    // Update the todos state
    setTodos((prev) => 
      prev.map((todo) => (todo.id === updatedTodo.id ? response.data : todo))
    );

    setOpenEditTodoModal(false);
    setSelectedTodo(null);
  } catch (error) {
    console.error('Failed to edit To-Do', error);
    alert(`Failed to edit task: ${error.response?.data?.message || "Please try again."}`);
  }
};

// Delete To-Do
const handleDeleteToDo = async (todoId) => {
  try {
    await axios.delete(`${apiBaseUrl}/${todoId}/group/${groupId}/user/${user.id}`);
    setTodos((prev) => prev.filter((todo) => todo.id !== todoId));
  } catch (error) {
    console.error('Failed to delete To-Do', error);
  }
};

const handleSubtaskChange = (index, value) => {
  setSelectedTodo((prevTodo) => {
    const newSubtasks = [...(prevTodo.subTasks || [])];
    newSubtasks[index] = { SubTaskName: value };
    return {
      ...prevTodo,
      subTasks: newSubtasks
    };
  });
};

const addSubtaskField = () => {
  setSelectedTodo((prevTodo) => ({
    ...prevTodo,
    subTasks: [...(prevTodo.subTasks || []), { SubTaskName: '' }]
  }));
};

const handleDeleteSubtask = (indexToRemove) => {
  setSelectedTodo((prevTodo) => ({
    ...prevTodo,
    subTasks: prevTodo.subTasks.filter((_, index) => index !== indexToRemove)
  }));
};
  

  const [note, setNote] = useState({
    noteId:'',
    title: '',
    description: '',
    content: '',
    dateCreated: new Date().toISOString(),
    userId: user ? user.id : null,
  });
  //console.log(notes)

  const handleDeleteNote = async (noteId) => {
    try {
      await axios.delete(`http://localhost:8081/api/note/deleteNote/${noteId}`);
      setNotes((prev) => prev.filter((note) => note.noteid !== noteId));
      setResponseMessage('Note deleted successfully!');
    } catch (error) {
      setResponseMessage('Failed to delete note.');
      console.error(error);
    }
  };
  
  const handleEditFile = async (fileId, updatedFile) => {
    try {
      const response = await axios.put(
        `${apiBaseUrl}/${groupId}/update-file/${fileId}`,
        updatedFile,
        { params: { userId: user.id } }
      );
      setFiles((prev) =>
        prev.map((file) => (file.fileId === fileId ? response.data : file))
      );
      setResponseMessage('File updated successfully!');
    } catch (error) {
      setResponseMessage('Failed to update file.');
      console.error('Edit File Error:', error);
    }
  };

  const handleDeleteFile = async (fileId) => {
    try {
      await axios.delete(`http://localhost:8081/api/files/delete/${fileId}`, {
  
      });
      setFiles((prev) => prev.filter((file) => file.fileId !== fileId));
      setResponseMessage('File deleted successfully!');
    } catch (error) {
      setResponseMessage('Failed to delete file.');
      console.error('Delete File Error:', error);
    }
  };
  
  const handleEditNote = async (noteId, updatedNote) => {
    try {
      const response = await axios.put(
        `${apiBaseUrl}/${noteId}/group`, // Corrected URL
        updatedNote,
        {
          params: { userId: user.id, studyGroupId: groupDetails.groupId },
        }
      );
  
      // Update the notes in state
      setNotes((prev) =>
        prev.map((note) => (note.noteid === noteId ? response.data : note))
      );
      setResponseMessage('Note updated successfully!');
    } catch (error) {
      setResponseMessage('Failed to update note.');
      console.error('Edit Note Error:', error);
    }
  };
  
  
  // Open modal for editing
  
  
  const handleOpenEditModal = (note) => {
    setNoteToEdit(note);
    setOpenEditModal(true);
  };
  
  const handleEditChange = (field, value) => {
    setNoteToEdit({ ...noteToEdit, [field]: value });
  };
  

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

  const handleUploadFile = async () => {
    if (!selectedFile) {
        alert("Please select a file to upload");
        return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
        const response = await axios.post(
            `${apiBaseUrl}/upload`,
            formData, // Pass the FormData directly
            {
                headers: {
                    "Content-Type": "multipart/form-data", // This ensures proper encoding for the file
                },
                params: { userId: user.id, studyGroupId: groupId }, // Move params here
            }
        );
        console.log(response)

        setFiles((prev) => [...prev, response.data]); // Update the file list
        setOpenFileModal(false);
        setResponseMessage("File uploaded successfully!");
    } catch (error) {
        console.error("File upload error:", error);
        setResponseMessage("Failed to upload file.");
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
      <Box>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => handleOpenEditModal(note)}
          sx={{ mr: 1 }}
        >
          Edit
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => handleDeleteNote(note.noteid)}
        >
          Delete
        </Button>
      </Box>
    </ListItem>
  ))}
</List>

            </CardContent>
          </Card>
        )}

        {tabIndex === 1 && (
          <Card sx={{ mb: 3, backgroundColor: 'background.paper', boxShadow: 2, borderRadius: 2 }}>
            <CardContent>
                        <Button
              variant="contained"
              color="success"
              onClick={() => setOpenFileModal(true)}
              startIcon={<AddCircle />}
              sx={{ mb: 2, fontWeight: 'bold', textTransform: 'none' }}
            >
              Upload File
            </Button>

            {files.length > 0 ? (
                <List>
                {files.map((file) => (
                  <ListItem key={file.fileId} sx={{ display: 'flex', alignItems: 'center' }}>
                    <ListItemText
                      primary={file.fileName || 'Unnamed File'}
                      secondary={`Uploaded by: ${file.uploader?.name || 'Unknown'}`}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ mr: 2 }}
                    >
                     <Download/>
                    </Button>
                    <IconButton
                      color="secondary"
                      onClick={() => {
                        setFileToEdit(file);
                        setOpenEditFileModal(true);
                      }}
                    >
                      {/* <Edit /> */}
                      <Edit/>
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDeleteFile(file.fileId)}>
                      {/* <Delete /> */}
                      < Delete/>
                    </IconButton>
                  </ListItem>
                ))}
              </List>
        
              ) : (
                <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
                  No files uploaded yet.
                </Typography>
              )}

            </CardContent>
          </Card>
        )}

{tabIndex === 2 && (
  <Card sx={{ mb: 3, backgroundColor: 'background.paper', boxShadow: 2, borderRadius: 2 }}>
    <CardContent>
      <Button
        variant="contained"
        color="success"
        onClick={() => setOpenTodoModal(true)}
        startIcon={<AddCircle />}
        sx={{ mb: 2, fontWeight: 'bold', textTransform: 'none' }}
      >
        Add To-Do
      </Button>
      {todos.length > 0 ? (
        <List>
          {todos.map((todo) => (
            <ListItem key={todo.id} sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <ListItemText
                primary={todo.title}
                secondary={`Created on: ${new Date(todo.dateCreated).toLocaleDateString()}`}
              />
              <Box>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    setSelectedTodo(todo);
                    setOpenEditTodoModal(true);
                  }}
                  sx={{ mr: 1 }}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleDeleteToDo(todo.id)}
                >
                  Delete
                </Button>
              </Box>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
          No To-Dos yet. Start by adding one!
        </Typography>
      )}
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

{/* Add To-Do Modal */}
<Modal open={openTodoModal} onClose={() => setOpenTodoModal(false)}>
  <Box sx={modalStyle}>
    <TextField
      label="Task Name"
      fullWidth
      value={todo.taskName}
      onChange={(e) => setTodo({ ...todo, taskName: e.target.value })}
      sx={{ mb: 2 }}
    />
    <TextField
      label="Description"
      fullWidth
      multiline
      rows={3}
      value={todo.description}
      onChange={(e) => setTodo({ ...todo, description: e.target.value })}
      sx={{ mb: 2 }}
    />
    <TextField
      label="Deadline"
      type="date"
      fullWidth
      value={todo.deadline}
      onChange={(e) => setTodo({ ...todo, deadline: e.target.value })}
      sx={{ mb: 2 }}
    />
    <TextField
      label="Category"
      type="text"
      fullWidth
      value={todo.category}
      onChange={(e) => setTodo({ ...todo, category: e.target.value })}
      sx={{ mb: 2 }}
    />
    
    {/* Subtasks Section */}
    <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>Subtasks</Typography>
    {todo.subTasks.map((subtask, index) => (
      <Box key={index} display="flex" alignItems="center" sx={{ mb: 1 }}>
        <TextField
          label={`Subtask ${index + 1}`}
          fullWidth
          value={subtask.SubTaskName}
          onChange={(e) => {
            const newSubtasks = [...todo.subTasks];
            newSubtasks[index] = { SubTaskName: e.target.value };
            setTodo({ ...todo, subTasks: newSubtasks });
          }}
          sx={{ mr: 1 }}
        />
        {todo.subTasks.length > 1 && (
          <IconButton 
            color="error" 
            onClick={() => {
              setTodo({
                ...todo,
                subTasks: todo.subTasks.filter((_, i) => i !== index)
              });
            }}
          >
            <Delete />
          </IconButton>
        )}
      </Box>
    ))}
    <Button
      variant="outlined"
      color="primary"
      onClick={() => {
        setTodo({
          ...todo,
          subTasks: [...todo.subTasks, { SubTaskName: '' }]
        });
      }}
      sx={{ mb: 2 }}
    >
      Add Subtask
    </Button>

    <Button variant="contained" color="success" onClick={handleAddToDo}>
      Add To-Do
    </Button>
  </Box>
</Modal>

{/* Edit To-Do Modal */}
<Modal open={openEditTodoModal} onClose={() => setOpenEditTodoModal(false)}>
  <Box sx={modalStyle}>
    <TextField
      label="Task Name"
      fullWidth
      value={selectedTodo?.taskName || ''}
      onChange={(e) => setSelectedTodo({ ...selectedTodo, taskName: e.target.value })}
      sx={{ mb: 2 }}
    />
    <TextField
      label="Description"
      fullWidth
      multiline
      rows={3}
      value={selectedTodo?.description || ''}
      onChange={(e) => setSelectedTodo({ ...selectedTodo, description: e.target.value })}
      sx={{ mb: 2 }}
    />
    <TextField
      label="Deadline"
      type="date"
      fullWidth
      value={selectedTodo?.deadline || ''}
      onChange={(e) => setSelectedTodo({ ...selectedTodo, deadline: e.target.value })}
      sx={{ mb: 2 }}
    />
    <TextField
      label="Category"
      type="text"
      fullWidth
      value={selectedTodo?.category || ''}
      onChange={(e) => setSelectedTodo({ ...selectedTodo, category: e.target.value })}
      sx={{ mb: 2 }}
    />
    
    {/* Subtasks Section */}
    <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>Subtasks</Typography>
    {(selectedTodo?.subTasks || []).map((subtask, index) => (
      <Box key={index} display="flex" alignItems="center" sx={{ mb: 1 }}>
        <TextField
          label={`Subtask ${index + 1}`}
          fullWidth
          value={subtask.SubTaskName}
          onChange={(e) => handleSubtaskChange(index, e.target.value)}
          sx={{ mr: 1 }}
        />
        {(selectedTodo?.subTasks || []).length > 1 && (
          <IconButton 
            color="error" 
            onClick={() => handleDeleteSubtask(index)}
          >
            <Delete />
          </IconButton>
        )}
      </Box>
    ))}
    <Button
      variant="outlined"
      color="primary"
      onClick={addSubtaskField}
      sx={{ mb: 2 }}
    >
      Add Subtask
    </Button>

    <Button variant="contained" color="primary" onClick={handleEditToDo}>
      Save Changes
    </Button>
  </Box>
</Modal>


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

      
      

      <Modal open={openFileModal} onClose={() => setOpenFileModal(false)}>
    <Box sx={modalStyle}>
        <Typography variant="h6" sx={{ mb: 2 }}>
            Upload a File
        </Typography>
            <input type="file" onChange={handleFileChange} style={{ marginBottom: "10px", width: "100%" }} />
                    <Button 
                        variant="contained" 
                        color="success"
                        onClick={handleUploadFile}
                        sx={{ width: "100%" }}
                    >
                        Upload
                    </Button>
    </Box>
</Modal>

<Modal open={openEditFileModal} onClose={() => setOpenEditFileModal(false)}>
        <Box sx={{ padding: 4, bgcolor: 'background.paper', borderRadius: 2 }}>
          <Typography variant="h6">Edit File</Typography>
          <TextField
            label="File Name"
            value={fileToEdit?.fileName || ''}
            onChange={(e) =>
              setFileToEdit((prev) => ({ ...prev, fileName: e.target.value }))
            }
            fullWidth
            sx={{ mt: 2 }}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleEditFile}
            sx={{ mt: 2, display: 'block' }}
          >
            Save Changes
          </Button>
        </Box>
      </Modal>

      <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
  <Box sx={modalStyle}>
    <TextField
      label="Title"
      fullWidth
      value={noteToEdit?.title || ''}
      onChange={(e) => handleEditChange('title', e.target.value)}
      sx={{ mb: 2 }}
    />
    <TextField
      label="Description"
      fullWidth
      value={noteToEdit?.description || ''}
      onChange={(e) => handleEditChange('description', e.target.value)}
      sx={{ mb: 2 }}
    />
    <TextField
      label="Content"
      fullWidth
      multiline
      rows={4}
      value={noteToEdit?.content || ''}
      onChange={(e) => handleEditChange('content', e.target.value)}
      sx={{ mb: 2 }}
    />
    <Button
      variant="contained"
      color="success"
      onClick={() => {
        handleEditNote(noteToEdit.noteid, noteToEdit);
        setOpenEditModal(false);
      }}
      sx={{ fontWeight: 'bold' }}
    >
      Save Changes
    </Button>
  </Box>
</Modal>

    </Box>
  );
}
