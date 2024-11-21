import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    List,
    ListItem,
    Card,
    CardContent,
    Box,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Button,  // Use Button instead of IconButton for better control over styling
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";

export default function Note() {
    const [notes, setNotes] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [noteToDelete, setNoteToDelete] = useState(null);
    const [selectedNote, setSelectedNote] = useState(null); // For modal preview
    const navigate = useNavigate();
    const location = useLocation();

    // Retrieve user info from route state
    const personalInfo = location.state?.user || { id: '', username: '' };

    useEffect(() => {
        if (personalInfo.id) {
            axios.get(`http://localhost:8081/api/note/getNotesByUser`, {
                params: { userId: personalInfo.id },
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

    const handleEditNote = (index) => {
        const noteId = notes[index].noteid;
        navigate(`/notes/edit/${noteId}`, { state: { noteData: notes[index], user: personalInfo.id } });
    };

    const openDeleteDialog = (id, index) => {
        setNoteToDelete({ id, index });
        setOpenDialog(true);
    };

    const closeDeleteDialog = () => {
        setOpenDialog(false);
        setNoteToDelete(null);
    };

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

    // Open preview modal
    const openNotePreview = (note) => {
        setSelectedNote(note);
    };

    // Close preview modal
    const closeNotePreview = () => {
        setSelectedNote(null);
    };

    return (
        <Box
            sx={{
                display: "flex",
             
                flexDirection: "column",
                alignItems: "center",
                width: "75%",
                padding: 2,
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
                <IconButton
                    onClick={() => navigate("/notes/new", { state: { user: personalInfo } })}
                    color="success"
                    sx={{
                        backgroundColor: "#579A59",
                        color: "#f0f0f0",
                        '&:hover': {
                            backgroundColor: "#487d4b",
                        },
                    }}
                >
                    <AddIcon />
                </IconButton>
            </Box>

            <List sx={{ width: "100%", padding: "10px", borderRadius: "8px" }}>
                {notes.length === 0 ? (
                    <ListItem>
                        <Typography>No Notes Available</Typography>
                    </ListItem>
                ) : (
                    notes.map((note, index) => (
                        <Card
                            key={note.noteid}
                            sx={{
                                marginBottom: "15px",
                                backgroundColor: "#f0f0f0",
                                borderRadius: "10px",
                                textAlign: "left",
                                width: "100%",
                                boxShadow: 2,
                                cursor: "pointer", // Make the card clickable
                                position: "relative", // For positioning icons
                            }}
                            onClick={() => openNotePreview(note)}
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
                            </CardContent>

                            {/* Edit and Delete icons placed beside each other */}
                            <Box
                                sx={{
                                    position: "absolute",
                                    top: "10px",
                                    right: "10px",
                                    display: "flex",
                                    gap: "10px", // Adding space between icons
                                }}
                            >
                                <IconButton
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent modal opening
                                        handleEditNote(index);
                                    }}
                                    color="primary"
                                    sx={{
                                        backgroundColor: "transparent",
                                        '&:hover': {
                                            backgroundColor: "#d0d0d0", // Light hover effect
                                        },
                                    }}
                                >
                                    <EditIcon />
                                </IconButton>
                                <IconButton
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent modal opening
                                        openDeleteDialog(note.noteid, index);
                                    }}
                                    color="error"
                                    sx={{
                                        backgroundColor: "transparent",
                                        '&:hover': {
                                            backgroundColor: "#f7dcdc", // Light hover effect for delete
                                        },
                                    }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        </Card>
                    ))
                )}
            </List>

            {/* Delete Confirmation Dialog */}
            <Dialog open={openDialog} onClose={closeDeleteDialog}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this note?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={closeDeleteDialog}
                        sx={{
                            color: "#579A59", // Green color
                            fontWeight: "bold",
                            textTransform: "none", // Remove uppercase text
                            '&:hover': {
                                backgroundColor: "#f0f0f0", // Subtle hover effect
                            },
                        }}
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteNote} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Note Preview Dialog */}
            <Dialog open={!!selectedNote} onClose={closeNotePreview} maxWidth="md" fullWidth>
                <DialogTitle>Note Preview</DialogTitle>
                <DialogContent>
                    {selectedNote && (
                        <>
                            <Typography variant="h5">{selectedNote.title}</Typography>
                            <Typography variant="body2" color="textSecondary">
                                {selectedNote.description}
                            </Typography>
                            <Typography
                                variant="body1"
                                dangerouslySetInnerHTML={{ __html: styleNoteContent(selectedNote.content) }}
                            />
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={closeNotePreview}
                        color="primary"
                        sx={{
                            backgroundColor: "#579A59",
                            color: "#f0f0f0",
                            '&:hover': {
                                backgroundColor: "#487d4b",
                            },
                        }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
