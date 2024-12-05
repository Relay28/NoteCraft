import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Box,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Button,
    Chip,
    Paper,
    Grid,
    TextField,
    Stack,
    Pagination
} from "@mui/material";
import { 
    Edit as EditIcon, 
    Delete as DeleteIcon, 
    Add as AddIcon, 
    Close as CloseIcon, 
    Tag,
    LocalOffer,
    TagOutlined
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "./ThemeProvider";
const ITEMS_PER_PAGE = 6; //
export default function Note() {
    const { theme } = useTheme();
    const [notes, setNotes] = useState([]);
    const [selectedNote, setSelectedNote] = useState(null);
    const [deleteNoteId, setDeleteNoteId] = useState(null);
    const [tagModalOpen, setTagModalOpen] = useState(false);
    const [newTag, setNewTag] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [currentNoteForTagging, setCurrentNoteForTagging] = useState(null);
    const [selectedTags, setSelectedTags] = useState([]);

    const navigate = useNavigate();
    const location = useLocation();
    const personalInfo = location.state?.user || { id: '', username: '' };

    // Fetch notes and process tags
    useEffect(() => {
        if (personalInfo.id) {
            axios.get(`http://localhost:8081/api/note/getNotesByUser`, {
                params: { userId: personalInfo.id },
            })
            .then(response => {
                setNotes(response.data);
            })
            .catch(error => {
                console.error("Error fetching notes", error);
            });
        }
    }, [personalInfo.id]);

    // Tag filtering logic
    // const filteredNotes = notes.filter(note => 
    //     selectedTags.length === 0 || 
    //     selectedTags.every(tag => 
    //         note.tags && note.tags.some(noteTag => noteTag.tagName === tag)
    //     )
    // );

    // Existing helper functions from original component
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

    // Note interactions
    const handleEditNote = (note) => {
        navigate(`/notes/edit/${note.noteid}`, { 
            state: { noteData: note, user: personalInfo.id } 
        });
    };

    const handleDeleteNote = () => {
        if (deleteNoteId) {
            axios.delete(`http://localhost:8081/api/note/deleteNote/${deleteNoteId}`)
            .then(() => {
                setNotes(notes.filter(note => note.noteid !== deleteNoteId));
                setDeleteNoteId(null);
            })
            .catch(error => {
                console.error("Error deleting note", error);
            });
        }
    };

    const handleAddTag = async () => {
        if (currentNoteForTagging && newTag) {
            try {
                const response = await axios.post(
                    'http://localhost:8081/api/tags/addToNote',
                    {
                        noteId: currentNoteForTagging.noteid,
                        tagName: newTag,
                    }
                );
                
                // Update notes with new tag
                const updatedNotes = notes.map(note => 
                    note.noteid === currentNoteForTagging.noteid ? response.data : note
                );
                setNotes(updatedNotes);
                
                // Reset modal states
                setTagModalOpen(false);
                setNewTag("");
                setCurrentNoteForTagging(null);
            } catch (error) {
                console.error('Error adding tag', error);
            }
        }
    };

    const handleRemoveTagFromNote = async (noteId, tagId) => {
        try {
            const response = await axios.delete(`http://localhost:8081/api/tags/removeFromNote`, {
                params: { noteId, tagId }
            });
            
            // Update notes list
            const updatedNotes = notes.map(note => 
                note.noteid === noteId ? response.data : note
            );
            setNotes(updatedNotes);
        } catch (error) {
            console.error("Error removing tag", error);
        }
    };

    // Consolidated tags extraction
    const allTags = [...new Set(notes.flatMap(note => 
        note.tags?.map(tag => tag.tagName) || []
    ))];

    // Note Pagination
    // Filtered Notes based on selected tags
const filteredNotes = notes.filter(
    (note) =>
      selectedTags.length === 0 ||
      selectedTags.some((tag) =>
        note.tags?.some((noteTag) => noteTag.tagName === tag)
      )
  );
  
  // Calculate pagination details
  const totalPages = Math.ceil(filteredNotes.length / ITEMS_PER_PAGE);
  const displayedNotes = filteredNotes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  
  
  // Reset to the first page if filtered notes change
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [filteredNotes, totalPages]);
    return (
        <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "85%",
        height:"80vh",
        marginTop:10,
        padding: 2,
        backgroundColor: theme.palette.background.primary,
        borderRadius: "12px",
      }}
    >
      {/* Tag Filter Section */}
      <Box
        sx={{
          position: "relative",
          top: 0,
          zIndex: 1,
          width: "100%",
          padding: 1,
          backgroundColor: theme.palette.background.default,
          boxShadow: theme.shadows[2],
        }}
      >
        <Typography
          variant="h6"
          component="div"
          sx={{ mb: 0, color: theme.palette.text.primary }}
        >
          Filter by Tags:
        </Typography>
        <Stack
          direction="row"
          spacing={1}
          sx={{
            overflowX: "hidden",
            flexWrap: "nowrap",
            padding: 1,
            gap: 0,
          }}
        >
          {allTags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              icon={<TagOutlined />}
              color={selectedTags.includes(tag) ? "primary" : "default"}
              onClick={() =>
                setSelectedTags((prev) =>
                  prev.includes(tag)
                    ? prev.filter((t) => t !== tag)
                    : [...prev, tag]
                )
              }
              clickable
              sx={{
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            />
          ))}
        </Stack>
      </Box>

      {/* Notes Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          marginBottom: "8px",
        }}
      >
        <Typography variant="h4" component="h2" sx={{ color: theme.palette.text.primary ,marginTop:3}}>
          Notes
        </Typography>
        <IconButton
          onClick={() => navigate("/notes/new", { state: { user: personalInfo } })}
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.background.default,
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
        >
          <AddIcon />
        </IconButton>
      </Box>

      {/* Notes Grid */}
     <Grid container spacing={2}>
  {displayedNotes.map((note) => (
    <Grid item xs={12} sm={6} md={4} key={note.noteid}>
        
      <Paper
        elevation={2}
        sx={{
          marginBottom: "15px",
          backgroundColor: theme.palette.background.paper,
          borderRadius: "10px",
          textAlign: "left",
          width: "100%",
          height: "150px", // Ensures all notes have the same height
          overflow: "hidden", // Prevents content overflow
          display: "flex",
          flexDirection: "column",
          position: "relative",
          cursor: "pointer",
          transition: "transform 0.2s",
          "&:hover": {
            transform: "scale(1.02)",
            boxShadow: theme.shadows[4],
          },
        }}
        onClick={() => setSelectedNote(note)}
      >
           <Box sx={{ p: 1 }}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            flexWrap="wrap"
            gap={1}
          >
            {note.tags &&
              note.tags.map((tag) => (
                <Chip
                  key={tag.tagId}
                  label={tag.tagName}
                  size="small"
                  color="secondary"
                  icon={<TagOutlined />}
                  onDelete={() =>
                    handleRemoveTagFromNote(note.noteid, tag.tagId)
                  }
                />
              ))}
            <IconButton
              size="small"
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentNoteForTagging(note);
                setTagModalOpen(true);
              }}
              sx={{
                "&:hover": {
                  color: theme.palette.primary.dark,
                },
              }}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Box>
        <Box sx={{ p: 2, flex: 1 }}>
          <Typography variant="h6" style={{ color: theme.palette.text.primary }}>
            <b>{note.title}</b>
          </Typography>
          <Typography
            variant="body2"
            sx={{ mb: 1, color: theme.palette.text.secondary }}
          >
            {note.description}
          </Typography>
          <Typography
            variant="body1"
            // dangerouslySetInnerHTML={{
            //   __html: styleNoteContent(note.content).split("\n")[0],
            // }}
          />
        </Box>

        {/* Edit and Delete Actions */}
        <Box
          sx={{
            position: "absolute",
            top: "10px",
            right: "10px",
            display: "flex",
            gap: "10px",
          }}
        >
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handleEditNote(note);
            }}
            color="primary"
            size="small"
            sx={{
              backgroundColor: "transparent",
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              setDeleteNoteId(note.noteid);
            }}
            color="error"
            size="small"
            sx={{
              backgroundColor: "transparent",
              "&:hover": {
                backgroundColor: "#f7dcdc",
              },
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Tags Section */}
     
      </Paper>
      
    </Grid>
  ))}
  
</Grid>

<Pagination
  count={totalPages}
  page={currentPage}
  onChange={(event, value) => setCurrentPage(value)}
  sx={{ marginTop: 1}}
/>

            {/* Dialogs */}
            <Dialog 
                open={!!selectedNote} 
                onClose={() => setSelectedNote(null)} 
                maxWidth="md"
                
                fullWidth
                sx={{borderRadius:"200px"}}
            >
                <DialogTitle>{selectedNote?.title}</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        {selectedNote?.description}
                    </Typography>
                    <Typography
                        variant="body1"
                        dangerouslySetInnerHTML={{ 
                            __html: styleNoteContent(selectedNote?.content || '') 
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSelectedNote(null)}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog 
                open={!!deleteNoteId} 
                onClose={() => setDeleteNoteId(null)}
            >
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this note?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setDeleteNoteId(null)}
                        sx={{
                            color: "#579A59",
                            fontWeight: "bold",
                            textTransform: "none",
                            '&:hover': {
                                backgroundColor: "#f0f0f0",
                            },
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

            {/* Add Tag Dialog */}
            <Dialog 
                open={tagModalOpen} 
                onClose={() => {
                    setTagModalOpen(false);
                    setNewTag("");
                    setCurrentNoteForTagging(null);
                }}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle>Add Tag to Note</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Tag Name"
                        fullWidth
                        variant="outlined"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleAddTag}>Add Tag</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}