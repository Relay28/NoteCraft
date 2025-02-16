import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
    List, ListItem, ListItemText, Button, Box, Typography, IconButton, 
    Dialog, DialogActions, DialogContent, DialogTitle, Pagination, TextField 
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';
import { useTheme } from './ThemeProvider';

export default function File() {
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [userId, setUserId] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [fileToDelete, setFileToDelete] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [uploadErrorModalOpen, setUploadErrorModalOpen] = useState(false);
    const [uploadSuccessModalOpen, setUploadSuccessModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [fileToEdit, setFileToEdit] = useState(null);
    const [newFileName, setNewFileName] = useState("");
    
    const filesPerPage = 4;

    const { darkMode, toggleTheme } = useTheme();

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            setUserId(storedUserId);
            fetchFiles(storedUserId);
        }
    }, []);

    const fetchFiles = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:8081/api/files/getFilesByUser/${userId}`);
            setFiles(response.data);
        } catch (error) {
            console.error("There was an error fetching the files!", error);
        }
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUploadFile = async () => {
        if (!selectedFile) {
            setUploadErrorModalOpen(true);
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
            setUploadSuccessModalOpen(true);
        } catch (error) {
            console.error("There was an error uploading the file!", error);
        }
    };

    const handleOpenDeleteModal = (fileId) => {
        setFileToDelete(fileId);
        setDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setDeleteModalOpen(false);
        setFileToDelete(null);
    };

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

    const handleOpenEditModal = (file) => {
        setFileToEdit(file);
        setNewFileName(file.fileName);
        setEditModalOpen(true);
    };

    const confirmUpdateFile = async () => {
        if (!fileToEdit || !newFileName) return;

        try {
            const response = await axios.put(`http://localhost:8081/api/files/updateFile`, null, {
                params: {
                    fileId: fileToEdit.fileId,
                    newFileName: newFileName
                }
            });
            setFiles(files.map(file => (file.fileId === fileToEdit.fileId ? response.data : file)));
            setEditModalOpen(false);
            setFileToEdit(null);
        } catch (error) {
            console.error("There was an error updating the file!", error);
        }
    };

    const handleDownloadFile = (file) => {
        const fileUrl = `http://localhost:8081/api/files/download/${file.fileId}`;
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = file.fileName;
        link.click();
    };

    const handlePreviewImage = (file) => {
        if (file.fileType === "image/png" || file.fileType === "image/jpeg") {
            setImageUrl(`http://localhost:8081/api/files/download/${file.fileId}`);
            setOpenModal(true);
        }
    };

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
                                        <IconButton onClick={() => handleOpenEditModal(file)}><EditIcon /></IconButton>
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

            {/* Upload Error Modal */}
            <Dialog open={uploadErrorModalOpen} onClose={() => setUploadErrorModalOpen(false)}>
                <DialogTitle>Error</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">Please select a file to upload.</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setUploadErrorModalOpen(false)} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Upload Success Modal */}
            <Dialog open={uploadSuccessModalOpen} onClose={() => setUploadSuccessModalOpen(false)}>
                <DialogTitle>Success</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">File uploaded successfully!</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setUploadSuccessModalOpen(false)} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

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

            {/* Edit Modal */}
            <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)}>
                <DialogTitle>Edit File Name</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="New File Name"
                        fullWidth
                        variant="standard"
                        value={newFileName}
                        onChange={(e) => setNewFileName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditModalOpen(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={confirmUpdateFile} color="primary">
                        Save
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