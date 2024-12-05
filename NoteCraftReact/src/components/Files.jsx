import React, { useState, useEffect } from "react";
import axios from "axios";
import { List, ListItem, ListItemText, Button, Box, Typography, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Pagination } from "@mui/material";
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
    const [deleteModalOpen, setDeleteModalOpen] = useState(false); // State for delete modal
    const [fileToDelete, setFileToDelete] = useState(null); // State for the file to delete
    const [currentPage, setCurrentPage] = useState(1); // State for current page
    const filesPerPage = 4; // Number of files per page

    const { darkMode, toggleTheme } = useTheme(); // Use theme hook for dark mode toggle

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

    // Open delete confirmation modal
    const handleOpenDeleteModal = (fileId) => {
        setFileToDelete(fileId);
        setDeleteModalOpen(true);
    };

    // Close delete confirmation modal
    const handleCloseDeleteModal = () => {
        setDeleteModalOpen(false);
        setFileToDelete(null);
    };

    // Confirm delete file
    const confirmDeleteFile = async () => {
        if (!fileToDelete) return;
        try {
            await axios.delete(`http://localhost:8081/api/files/delete/${fileToDelete}`);
            setFiles(files.filter(file => file.fileId !== fileToDelete));
            handleCloseDeleteModal();
        } catch (error) {
            console.error("There was an error deleting the file!", error);
        }
    };

    // Edit file (Update file name)
    const handleUpdateFile = async (fileId) => {
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

    // Pagination logic
    const indexOfLastFile = currentPage * filesPerPage;
    const indexOfFirstFile = indexOfLastFile - filesPerPage;
    const currentFiles = files.slice(indexOfFirstFile, indexOfLastFile);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    if (!userId) {
        return <Typography variant="h6">Please log in to view your files.</Typography>;
    }

    return (
        <Box
            sx={{
                width: "80%",
                padding: "20px",
                borderRadius: "20px",
            }}
        >
            <Typography
                variant="h4"
                sx={{
                    textAlign: "center",
                    marginBottom: "20px",
                    color: darkMode ? "#d8dee9" : "#2b2f3a",
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
                <Box
                    sx={{
                        height: "500px",
                        flex: 2,
                        borderRadius: "15px",
                        padding: "20px",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                    }}
                >
                    <Box>
                        <Typography variant="h6" sx={{ marginBottom: "20px", color: darkMode ? "#d8dee9" : "#2b2f3a" }}>
                            Your Files
                        </Typography>
                        <List>
                            {currentFiles.map((file) => (
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
                                                    color: darkMode ? "#d8dee9" : "#2b2f3a",
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
                                        <IconButton onClick={() => handleDownloadFile(file)}><DownloadIcon /></IconButton>
                                        <IconButton onClick={() => handleUpdateFile(file.fileId)}><EditIcon /></IconButton>
                                        <IconButton onClick={() => handleOpenDeleteModal(file.fileId)}><DeleteIcon /></IconButton>
                                    </Box>
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                    <Pagination
                        count={Math.ceil(files.length / filesPerPage)}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                        sx={{ marginTop: "20px", alignSelf: "center" }}
                    />
                </Box>

                {/* Upload Section */}
                <Box
                    sx={{
                        height: "200px",
                        flex: 1,
                        borderRadius: "15px",
                        padding: "20px",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{ marginBottom: "20px", color: darkMode ? "#d8dee9" : "#2b2f3a" }}
                    >
                        Upload a File
                    </Typography>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        style={{
                            marginBottom: "10px",
                            width: "100%",
                            color: darkMode ? "#d8dee9" : "#2b2f3a",
                            backgroundColor: "transparent",
                        }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleUploadFile}
                        fullWidth
                    >
                        Upload
                    </Button>
                </Box>
            </Box>

            {/* Delete Confirmation Modal */}
            <Dialog open={deleteModalOpen} onClose={handleCloseDeleteModal}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this file? This action cannot be undone.</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteModal} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={confirmDeleteFile} color="primary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Image Preview Modal */}
            <Dialog open={openModal} onClose={() => setOpenModal(false)}>
                <DialogContent>
                    <img src={imageUrl} alt="Preview" style={{ maxWidth: "100%", maxHeight: "100%" }} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenModal(false)} color="secondary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
