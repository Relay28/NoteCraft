import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Button, TextField, Box, Typography, Dialog, DialogContent } from "@mui/material";
import axios from "axios";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { createQuillModules } from './quillModules';

export default function NoteForm() {
    const navigate = useNavigate();
    const { noteId } = useParams();
    const location = useLocation();
    const quillRef = useRef(null);

    // Retrieve token from localStorage
    const token = localStorage.getItem('token');
    const user = location.state?.user || null ;
    const [note, setNote] = useState(location.state?.noteData || { 
        title: "", 
        description: "", 
        content: "", 
        dateCreated: "", 
        userId: location.state?.user.id || null  // Set userId from location.state.user
    });

    const [openImagePreview, setOpenImagePreview] = useState(false);
    const [previewImageUrl, setPreviewImageUrl] = useState("");
    const BASE_URL = "http://localhost:8080";

    useEffect(() => {
        if (noteId && !location.state?.noteData) {
            axios.get(`${BASE_URL}/api/note/getNoteById/${noteId}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => setNote({ ...response.data, userId: location.state?.user }))
            .catch(error => console.error("Error fetching note:", error));
        }
    }, [noteId, location.state, token]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNote(prevNote => ({ ...prevNote, [name]: value }));
    };

    const handleContentChange = (content) => {
        setNote(prevNote => ({ ...prevNote, content }));
    };

    const handleImageUpload = useCallback(() => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");

        input.onchange = () => {
            const file = input.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const imageDataUrl = reader.result;
                    if (quillRef.current) {
                        const quill = quillRef.current.getEditor();
                        const range = quill.getSelection(true);
                        quill.insertEmbed(range.index, 'image', imageDataUrl);
                        setNote(prevNote => ({
                            ...prevNote,
                            content: quill.root.innerHTML,
                        }));
                    }
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    }, []);

    const quillModules = useMemo(() => createQuillModules(handleImageUpload), [handleImageUpload]);

    const formats = [
        'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent', 'link', 'image', 'color', 'align', 'background',
        'script'  
    ];

    const handleSaveNote = async () => {
        if (!note.title.trim() || !note.content.trim()) {
            alert("Title and Content are required to save the note.");
            return;
        }
    
        const apiEndpoint = noteId
            ? `${BASE_URL}/api/note/updateNote?noteid=${noteId}&userId=${note.userId}`
            : `${BASE_URL}/api/note/insertNote?userId=${note.userId}`;
        
        const requestMethod = noteId ? 'put' : 'post';
    
        try {
            await axios[requestMethod](apiEndpoint, {
                ...note,
                dateCreated: noteId ? note.dateCreated : new Date().toISOString(),
                userId: note.userId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate("/notes",{ state: { user}});  // Redirect after saving
        } catch (error) {
            console.error("Error saving note:", error);
        }
    };

    const handleImageClick = (e) => {
        if (e.target.tagName === 'IMG') {
            setPreviewImageUrl(e.target.src);
            setOpenImagePreview(true);
        }
    };

    useEffect(() => {
        if (quillRef.current) {
            const editor = quillRef.current.getEditor();
            editor.root.addEventListener('click', handleImageClick);
            return () => editor.root.removeEventListener('click', handleImageClick);
        }
    }, [quillRef]);

    return (
        <Box sx={{ width: "75%", margin: "20px auto", padding: "20px", backgroundColor: "#f5f5f5", borderRadius: "8px", border: "solid 1px #ddd", marginLeft: 30 }}>
            <Typography variant="h4">{noteId ? "Edit Note" : "Add New Note"}</Typography>
            <TextField label="Title" name="title" value={note.title} onChange={handleInputChange} fullWidth margin="normal" />
            <TextField label="Description" name="description" value={note.description} onChange={handleInputChange} fullWidth margin="normal" />

            <Typography variant="h6" sx={{ marginTop: 2 }}>Content</Typography>
            <ReactQuill 
                ref={quillRef} 
                value={note.content} 
                onChange={handleContentChange} 
                modules={quillModules}
                formats={formats}
                style={{ height: "300px", marginBottom: "20px" }} 
            />
            <style>
                {`
                    .ql-editor img {
                        width: 400px;
                        height: auto;
                        max-height: 200px;
                        object-fit: cover;
                    }
                `}
            </style>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 7 }}>
                <Button variant="contained" color="primary" onClick={handleSaveNote} disabled={!note.title.trim() || !note.content.trim()} sx={{ backgroundColor: "#487d4b", padding: "10px 25px" }}>
                    Save
                </Button>
                <Button variant="outlined" color="secondary" onClick={() => navigate("/note")}>
                    Cancel
                </Button>
            </Box>

            <Dialog open={openImagePreview} onClose={() => setOpenImagePreview(false)} maxWidth="lg">
                <DialogContent>
                    <img src={previewImageUrl} alt="Preview" style={{ width: '100%', height: 'auto' }} />
                </DialogContent>
            </Dialog>
        </Box>
    );
}
