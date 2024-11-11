// Note.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
    List, 
    ListItem, 
    ListItemText, 
    Button, 
    Card, 
    CardContent, 
    Box, 
    Typography, 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions 
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

export default function Note() {

    const [notes, setNotes] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [noteToDelete, setNoteToDelete] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Retrieve user info from route state
    const personalInfo = location.state?.user || { id: '', username: '' };
  
    useEffect(() => {
        if (personalInfo.id) {
            axios.get(`http://localhost:8081/api/note/getNotesByUser`, {
                params: { userId: personalInfo.id }
            })
                .then(response => {
                    setNotes(response.data);
                })
                .catch(error => {
                    console.error("There was an error fetching the notes!", error);
                });
        } else {
           
            console.warn("No user ID found. Redirecting to login.");
            navigate('/login');
        }
    }, [personalInfo.id, navigate]);

    // Edit a note
    const handleEditNote = (index) => {
        const noteId = notes[index].noteid;
        navigate(`/edit-note/${noteId}`, { state: { noteData: notes[index], user: personalInfo.id } });
    };

    // Open the delete confirmation dialog
    const openDeleteDialog = (id, index) => {
        setNoteToDelete({ id, index });
        setOpenDialog(true);
    };

    // Close the delete confirmation dialog
    const closeDeleteDialog = () => {
        setOpenDialog(false);
        setNoteToDelete(null);
    };

    // Delete a note after confirmation
    const handleDeleteNote = () => {
        if (noteToDelete) {
            const { id, index } = noteToDelete;
            axios.delete(`http://localhost:8081/api/note/deleteNote/${id}`)
                .then(() => {
                    const updatedNotes = notes.filter((_, i) => i !== index);
                    setNotes(updatedNotes);
                    closeDeleteDialog();
                })
                .catch(error => {
                    console.error("There was an error deleting the note!", error);
                });
        }
    };

    // Function to sanitize and style the content
    const styleNoteContent = (content) => {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = content;

        const images = tempDiv.querySelectorAll("img");
        images.forEach(img => {
            img.style.width = "200px";
            img.style.height = "auto";
            img.style.maxHeight = "200px";
            img.style.objectFit = "cover";
        });

        return tempDiv.innerHTML;
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "75%",
                padding: 2,
                marginLeft: 30
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    marginBottom: "20px",
                }}
            >
                <Typography variant="h4" component="h2">
                    Notes
                </Typography>
                <Button
                    variant="contained"
                    color="success"
                    onClick={() => navigate("/new-note", { state: { user: personalInfo } })}
                >
                    Add New Note
                </Button>
            </Box>

            <List sx={{ width: "100%", padding: "10px", borderRadius: "8px" }}>
                {notes.length === 0 ? (
                    <ListItem>
                        <ListItemText primary="No Notes Available" />
                    </ListItem>
                ) : (
                    notes.map((note, index) => (
                        <Card
                            key={note.noteid} // Use noteid as the key for better performance
                            sx={{
                                marginBottom: "15px",
                                backgroundColor: "#f0f0f0",
                                borderRadius: "10px",
                                textAlign: "left",
                                width: "100%",
                                boxShadow: 2,
                            }}
                        >
                            <CardContent>
                                <Typography variant="h6"><b>{note.title}</b></Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {note.description}
                                </Typography>
                                <Typography 
                                    variant="body1" 
                                    dangerouslySetInnerHTML={{ __html: styleNoteContent(note.content).split("\n")[0] }} 
                                />

                                <Box sx={{ marginTop: "10px", textAlign: "right" }}>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => handleEditNote(index)}
                                        sx={{ 
                                            marginRight: "10px",
                                            color: "#f0f0f0",
                                            backgroundColor: "#579A59",
                                            '&:hover': {
                                                backgroundColor: "#487d4b",
                                            }
                                        }}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={() => openDeleteDialog(note.noteid, index)}
                                        sx={{ 
                                            marginRight: "10px",
                                            color: "#f0f0f0",
                                            backgroundColor: "red",
                                            '&:hover': {
                                                backgroundColor: "#c62828",
                                            }
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    ))
                )}
            </List>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={openDialog}
                onClose={closeDeleteDialog}
            >
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this note?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={closeDeleteDialog} 
                        color="primary" 
                        sx={{
                            color: "#f0f0f0",
                            backgroundColor: "#579A59",
                            '&:hover': {
                                backgroundColor: "#487d4b",
                            }
                        }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleDeleteNote} 
                        color="error" 
                        variant="contained"
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
