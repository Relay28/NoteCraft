import React, { useState, useEffect, useRef, useCallback, useMemo, useContext } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Button, TextField, Box, Typography, Dialog, DialogContent } from "@mui/material";
import { PersonalInfoContext } from "./PersonalInfoProvider";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { createQuillModules } from "./quillModules";

export default function NoteForm() {
  const navigate = useNavigate();
  const { noteId } = useParams();
  const location = useLocation();
  const quillRef = useRef(null);
  const { personalInfo } = useContext(PersonalInfoContext);
 
  const user = personalInfo;

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

  const [openImagePreview, setOpenImagePreview] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState("");
  const BASE_URL = "http://localhost:8081";

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
        width: "80%",
        maxWidth: "900px",
        marginTop: "1%",
        marginLeft: "1%",
        padding: "30px",
        height:"fit-content",
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
      }}
    >
      <Typography variant="h4" sx={{ color: "#487d4b", marginBottom: "20px", fontWeight: "600" }}>
        {noteId ? "Edit Note" : "Add New Note"}
      </Typography>r
      <TextField
        label="Title"
        name="title"
        value={note.title}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
        sx={{ marginBottom: "20px", fontWeight: "bold" }}
      />
      <TextField
        label="Description"
        name="description"
        value={note.description}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
        sx={{ marginBottom: "20px" }}
      />

      <Typography variant="h6" sx={{ marginBottom: "10px", color: "#579A59" }}>
        Content
      </Typography>
      <ReactQuill
        ref={quillRef}
        value={note.content}
        onChange={handleContentChange}
        modules={quillModules}
        formats={formats}
        style={{
          height: "300px",
          marginBottom: "50px",
          borderRadius: "8px",
          border: "1px solid #ddd",
        }}
      />

      <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
        <Button
          variant="contained"
          onClick={handleSaveNote}
          disabled={!note.title.trim() || !note.content.trim()}
          sx={{
            backgroundColor: "#487d4b",
            color: "#fff",
            padding: "10px 30px",
            "&:hover": { backgroundColor: "#579A59" },
            fontWeight: "bold",
            borderRadius: "8px",
          }}
        >
          Save
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate("/notes", { state: { user: user } }) }
          sx={{
            borderColor: "#487d4b",
            color: "#487d4b",
            fontWeight: "bold",
            padding: "10px 30px",
            "&:hover": { backgroundColor: "#eaf6e9", borderColor: "#579A59" },
            borderRadius: "8px",
          }}
        >
          Cancel
        </Button>
      </Box>

      <Dialog open={openImagePreview} onClose={() => setOpenImagePreview(false)} maxWidth="lg">
        <DialogContent>
          <img src={previewImageUrl} alt="Preview" style={{ width: "100%", height: "auto", borderRadius: "8px" }} />
        </DialogContent>
      </Dialog>
    </Box>
  );
}
