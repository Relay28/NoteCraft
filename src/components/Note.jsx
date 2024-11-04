import React, { useState, useEffect } from "react";
import axios from "axios";
import { List, ListItem, ListItemText, Button, Card, CardContent, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Note() {
    const [notes, setNotes] = useState([]);
    const navigate = useNavigate();

    // Fetch notes from the API
    useEffect(() => {
        axios.get('http://localhost:8080/api/note/getAllNotes')
            .then(response => {
                setNotes(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the notes!", error);
            });
    }, []);

    // Edit a note
    const handleEditNote = (index) => {
        const noteId = notes[index].noteid;
        navigate(`/edit-note/${noteId}`, { state: { noteData: notes[index] } });
    };

    // Delete a note
   // Delete a note with confirmation
const handleDeleteNote = (id, index) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this note?");
    if (confirmDelete) {
        axios.delete(`http://localhost:8080/api/note/deleteNote/${id}`)
            .then(() => {
                const updatedNotes = notes.filter((_, i) => i !== index);
                setNotes(updatedNotes);
            })
            .catch(error => {
                console.error("There was an error deleting the note!", error);
            });
    }
};

    // Function to sanitize and style the content
    const styleNoteContent = (content) => {
        // Create a temporary DOM element to manipulate the HTML
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = content;

        // Select all images and apply styles
        const images = tempDiv.querySelectorAll("img");
        images.forEach(img => {
            img.style.width = "200px"; // Set fixed width
            img.style.height = "auto"; // Maintain aspect ratio
            img.style.maxHeight = "200px"; // Optional max height
            img.style.objectFit = "cover"; // Crop to fit if necessary
        });

        return tempDiv.innerHTML; // Return styled HTML
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "75%",       // Ensure full width utilization
                padding: 2,
                marginLeft: 30
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",      // Full width to align elements to edges
                    marginBottom: "20px",
                }}
            >
                <Typography variant="h4" component="h2">
                    Notes
                </Typography>
                <Button
                    variant="contained"
                    color="success"
                    onClick={() => navigate("/new-note")}
                >
                    Add New Note
                </Button>
            </Box>

            <List sx={{ width: "100%", padding: "10px", borderRadius: "8px"  }}>
                {notes.length === 0 ? (
                    <ListItem>
                        <ListItemText primary="No Notes Available" />
                    </ListItem>
                ) : (
                    notes.map((note, index) => (
                        <Card
                            key={index}
                            sx={{
                                marginBottom: "15px",
                                backgroundColor: "#f0f0f0",
                                borderRadius: "10px",
                                textAlign: "left",
                                width: "100%",    // Stretch cards to full width
                                boxShadow: 2,
                            }}
                        >
                            <CardContent>
                                <Typography variant="h6"><b>{note.title}</b></Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {note.description}
                                </Typography>
                                {/* Use the styled note content here */}
                                <Typography variant="body1" dangerouslySetInnerHTML={{ __html: styleNoteContent(note.content).split("\n")[0] }} />

                                <Box sx={{ marginTop: "10px", textAlign: "right" }}>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => handleEditNote(index)}
                                        sx={{ marginRight: "10px" }}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={() => handleDeleteNote(note.noteid, index)}
                                    >
                                        Delete
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    ))
                )}
            </List>
        </Box>
    );
}
