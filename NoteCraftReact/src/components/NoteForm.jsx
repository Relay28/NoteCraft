import React, { useState, useEffect, useRef, useCallback, useMemo, useContext } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Button, TextField, Box, Typography, Dialog, DialogContent } from "@mui/material";
import { PersonalInfoContext } from "./PersonalInfoProvider";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { createQuillModules } from "./quillModules";
import { useTheme } from "./ThemeProvider";
export default function NoteForm() {
  const [openImagePreview, setOpenImagePreview] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState("");
  const BASE_URL = "http://localhost:8081";
  const navigate = useNavigate();
  const { noteId } = useParams();
  const location = useLocation();
  const quillRef = useRef(null);
  const { personalInfo } = useContext(PersonalInfoContext);
 
  const user = personalInfo;
  const { theme } = useTheme();
  const [note, setNote] = useState(
    
    location.state?.noteData || {
      title: "",
      description: "",
      content: "",
      dateCreated: "",
      userId: user ? user.id : null,
      isGroupNote: false,
    }
  );

  useEffect(() => {
    if (user && user.id) {
      setNote((prevNote) => ({ ...prevNote, userId: user.id }));
    }
  }, [user]);

 

  useEffect(() => {
    if (noteId && !location.state?.noteData) {
      axios
        .get(`${BASE_URL}/api/note/getNoteById/${noteId}`, {
         
        })
        .then((response) => setNote({ ...response.data, userId: user ? user.id : null }))
        .catch((error) => console.error("Error fetching note:", error));
    }
  }, [noteId, location.state, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNote((prevNote) => ({ ...prevNote, [name]: value }));
  };

  const handleContentChange = (content) => {
    setNote((prevNote) => ({ ...prevNote, content }));
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
            quill.insertEmbed(range.index, "image", imageDataUrl);
            setNote((prevNote) => ({
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
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "color",
    "align",
    "background",
    "script",
    "size",
  ];

  const handleSaveNote = async () => {
    if (!note.title.trim() || !note.content.trim()) {
      alert("Title and Content are required to save the note.");
      return;
    }

    const apiEndpoint = noteId
      ? `${BASE_URL}/api/note/updateNote?noteid=${noteId}&userId=${note.userId}`
      : `${BASE_URL}/api/note/insertNote?userId=${note.userId}`;

    const requestMethod = noteId ? "put" : "post";

    try {
      await axios[requestMethod](
        apiEndpoint,
        {
          ...note,
          dateCreated: noteId ? note.dateCreated : new Date().toISOString(),
          userId: note.userId,
        },
        {
        
        }
      );
  navigate("/notes", { state: { user: user } }); // Redirect after saving
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  const handleImageClick = (e) => {
    if (e.target.tagName === "IMG") {
      setPreviewImageUrl(e.target.src);
      setOpenImagePreview(true);
    }
  };

  useEffect(() => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      editor.root.addEventListener("click", handleImageClick);
      return () => editor.root.removeEventListener("click", handleImageClick);
    }
  }, [quillRef]);

  return (
    <Box
      sx={{
        width: "90%", // Match Note.jsx container width
        maxWidth: "85vw",
        height: "80vh", // Match Note.jsx height
        margin: "auto",
        padding: "2%",
        backgroundColor: theme.palette.background.paper, // Use theme from ThemeProvider
        borderRadius: "12px",
        boxShadow: theme.shadows[2], // Use theme shadows
        display: "flex",
        marginTop:2,
        marginRight:15,
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Typography 
        variant="h4" 
        sx={{ color: "#487d4b", marginBottom: "10px", fontWeight: "600", textAlign: "center" }}
      >
        {noteId ? "Edit Note" : "Add New Note"}
      </Typography>
  
      {/* Content Wrapper */}
      <Box
        sx={{
          flex: 1, // Occupy remaining space
          display: "flex",
          flexDirection: "column",
          overflow: "hidden", // Eliminate overflow scrolling
        }}
      >
        {/* Title Field */}
        <TextField
  label="Title"
  name="title"
  value={note.title}
  onChange={handleInputChange}
  fullWidth
  margin="normal"
  sx={{ marginBottom: "10px" }}
  InputProps={{
    style: { color: theme.palette.text.primary }, // For the input text
  }}
  InputLabelProps={{
    style: { color: theme.palette.text.primary }, // For the label text
  }}
/>

        
        {/* Description Field */}
        <TextField
          label="Description"
          name="description"
          value={note.description}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          sx={{ marginBottom: "10px" }}
          InputProps={{
            style: { color: theme.palette.text.primary }, // For the input text
          }}
          InputLabelProps={{
            style: { color: theme.palette.text.primary }, // For the label text
          }}
        />
  
        {/* ReactQuill Editor */}
        <Typography variant="h6" sx={{ marginBottom: "5px", color: "#579A59" }}>
          Content
        </Typography>
        <ReactQuill
          ref={quillRef}
          value={note.content}
          onChange={handleContentChange}
          modules={quillModules}
          formats={formats}
          style={{
            flex: 1, // Adjust height dynamically to fit available space
            marginBottom: "10px",
            borderRadius: "8px",
            color: theme.palette.text.primary,
            overflow:"auto",
            border: "1px solid #ddd",
          }}
          
        />
      </Box>
  
      {/* Buttons */}
      <Box 
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: "10px",
        }}
      >
        <Button
          variant="contained"
          onClick={handleSaveNote}
          disabled={!note.title.trim() || !note.content.trim()}
          sx={{
            flex: 1,
            backgroundColor: "#487d4b",
            color: "#fff",
            padding: "10px",
            "&:hover": { backgroundColor: "#579A59" },
            fontWeight: "bold",
            borderRadius: "8px",
          }}
        >
          Save
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate("/notes", { state: { user: user } })}
          sx={{
            flex: 1,
            borderColor: "#487d4b",
            color: "#487d4b",
            fontWeight: "bold",
            padding: "10px",
            "&:hover": { backgroundColor: "#eaf6e9", borderColor: "#579A59" },
            borderRadius: "8px",
          }}
        >
          Cancel
        </Button>
      </Box>
  
      {/* Image Preview Dialog */}
      <Dialog open={openImagePreview} onClose={() => setOpenImagePreview(false)} maxWidth="lg">
        <DialogContent>
          <img src={previewImageUrl} alt="Preview" style={{ width: "100%", height: "auto", borderRadius: "8px" }} />
        </DialogContent>
      </Dialog>
    </Box>
  );
}  