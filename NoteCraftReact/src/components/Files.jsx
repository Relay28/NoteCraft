import React, { useState, useEffect } from "react";
import axios from "axios";
import { List, ListItem, ListItemText, Button, Box, Typography, IconButton, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';
import { useTheme } from './ThemeProvider'; // Import the hook

export default function File() {
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [userId, setUserId] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [imageUrl, setImageUrl] = useState("");

    // Fetch userId from localStorage and files for that user
    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            setUserId(storedUserId);
            fetchFiles(storedUserId);
        }
    }, []);

    // Fetch files from API
    const fetchFiles = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:8081/api/files/getFilesByUser/${userId}`);
            setFiles(response.data);
        } catch (error) {
            console.error("There was an error fetching the files!", error);
        }
    };

    // Handle file selection
    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    // Upload file
    const handleUploadFile = async () => {
        if (!selectedFile) {
            alert("Please select a file to upload");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const response = await axios.post('http://localhost:8081/api/files/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                params: { userId },
            });
            setFiles(prevFiles => [...prevFiles, response.data]);
            setSelectedFile(null);
        } catch (error) {
            console.error("There was an error uploading the file!", error);
        }
    };

    // Delete file
    const handleDeleteFile = async (fileId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:8081/api/files/delete/${fileId}`);
            setFiles(files.filter(file => file.fileId !== fileId));
        } catch (error) {
            console.error("There was an error deleting the file!", error);
        }
    };

    // Edit file (Update file name)
    const handleUpdateFile = async (fileId) => {
        const confirmEdit = window.confirm("Are you sure you want to edit this?");
        if (!confirmEdit) return;

        const newFileName = prompt("Enter new file name:");
        if (!newFileName) return;

        try {
            const response = await axios.put(`http://localhost:8081/api/files/updateFile`, null, {
                params: {
                    fileId: fileId,
                    newFileName: newFileName
                }
            });
            setFiles(files.map(file => (file.fileId === fileId ? response.data : file)));
        } catch (error) {
            console.error("There was an error updating the file!", error);
        }
    };

    // Handle download of file
    const handleDownloadFile = (file) => {
        const fileUrl = `http://localhost:8081/api/files/download/${file.fileId}`;
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = file.fileName; // Set the filename for download
        link.click(); // Trigger the download
    };

    // Handle image preview in modal
    const handlePreviewImage = (file) => {
        if (file.fileType === "image/png" || file.fileType === "image/jpeg") {
            setImageUrl(`http://localhost:8081/api/files/download/${file.fileId}`);
            setOpenModal(true);
        }
    };

    if (!userId) {
        return <Typography variant="h6">Please log in to view your files.</Typography>;
    }

    const { darkMode, toggleTheme } = useTheme(); // Use theme hook for dark mode toggle

    return (
        <Box
            sx={{
                width: "80%",
                padding: "20px",
                backgroundColor: darkMode ? "#2b2f3a" : "#C8E6C9", // Adjust background color for dark mode
                borderRadius: "20px",
                boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.2)",
            }}
        >
            <Typography
                variant="h5"
                sx={{
                    textAlign: "center",
                    marginBottom: "20px",
                    color: darkMode ? "#d8dee9" : "#2E7D32", // Adjust text color for dark mode
                }}
            >
                Files Dashboard
            </Typography>

            <Button
                variant="outlined"
                onClick={toggleTheme}
                sx={{ position: "absolute", top: 10, right: 20 }}
            >
                Toggle {darkMode ? "Light" : "Dark"} Mode
            </Button>

            <Box sx={{ display: "flex", gap: "20px", justifyContent: "center" }}>
                {/* Your Files Section */}
                <Box
                    sx={{
                        height: "500px",
                        flex: 2,
                        backgroundColor: darkMode ? "#383e4a" : "#E8F5E9", // Background color adjustment
                        borderRadius: "15px",
                        padding: "20px",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                    }}
                >
                    <Typography variant="h6" sx={{ marginBottom: "20px", color: darkMode ? "#d8dee9" : "#2E7D32" }}>
                        Your Files
                    </Typography>
                    <List>
                        {files.map((file) => (
                            <ListItem
                                key={file.fileId}
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginBottom: "10px",
                                    padding: "10px",
                                    borderRadius: "10px",
                                    backgroundColor: darkMode ? "#383e4a" : "#FBFBFB",
                                }}
                            >
                                <ListItemText
                                    primary={
                                        <Button
                                            sx={{
                                                textTransform: "none",
                                                fontWeight: "bold",
                                                color: file.fileType === "image/png" || file.fileType === "image/jpeg" ? "#1976d2" : "inherit",
                                                display: "block",
                                                textAlign: "left",
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                maxWidth: "400px",
                                            }}
                                            onClick={() => handlePreviewImage(file)}
                                        >
                                            {file.fileName}
                                        </Button>
                                    }
                                    secondary={`Size: ${file.size} bytes`}
                                />
                                <Box>
                                    {/* Display download button */}
                                    <IconButton onClick={() => handleDownloadFile(file)}><DownloadIcon /></IconButton>
                                    <IconButton onClick={() => handleUpdateFile(file.fileId)}><EditIcon /></IconButton>
                                    <IconButton onClick={() => handleDeleteFile(file.fileId)}><DeleteIcon /></IconButton>
                                </Box>
                            </ListItem>
                        ))}
                    </List>
                </Box>

                {/* Upload a File Section */}
                <Box
                    sx={{
                        height: "200px",
                        flex: 1,
                        backgroundColor: darkMode ? "#383e4a" : "#E8F5E9", // Background color adjustment
                        borderRadius: "15px",
                        padding: "20px",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                    }}
                >
                    <Typography variant="h6" sx={{ marginBottom: "20px", color: darkMode ? "#d8dee9" : "#2E7D32" }}>
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
            </Box>

            {/* Image Preview Modal */}
            <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="md" fullWidth>
                <DialogTitle>Image Preview</DialogTitle>
                <DialogContent>
                    <img src={imageUrl} alt="file preview" style={{ width: "100%", height: "auto" }} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenModal(false)} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
