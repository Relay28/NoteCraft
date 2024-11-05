import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    List, ListItem, ListItemText, Button, Box, Typography, IconButton
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

export default function File() {
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);

    // Fetch files from the API
    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/files/getAll');
            setFiles(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("There was an error fetching the files!", error);
        }
    };

    // Handle file selection
    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    // Upload the selected file
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
            });
            setFiles(prevFiles => [...prevFiles, response.data]); // Append the new file
            setSelectedFile(null); // Reset file input
        } catch (error) {
            console.error("There was an error uploading the file!", error);
        }
    };

    // Delete file
    const handleDeleteFile = async (fileId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this?");
        if (!confirmDelete) return; // Exit if the user does not confirm
    
        try {
            await axios.delete(`http://localhost:8081/api/files/delete/${fileId}`);
            setFiles(files.filter(file => file.fileId !== fileId)); // Remove file from state
        } catch (error) {
            console.error("There was an error deleting the file!", error);
        }
    };

    // Update file name
    const handleUpdateFile = async (fileId) => {
        const confirmEdit = window.confirm("Are you sure you want to edit this?");
        if (!confirmEdit) return; // Exit if the user does not confirm
    
        const newFileName = prompt("Enter new file name:");
        if (!newFileName) return;
    
        try {
            const response = await axios.put(`http://localhost:8081/api/files/updateFile`, null, {
                params: {
                    fileId: fileId,
                    newFileName: newFileName
                }
            });
            setFiles(files.map(file => (file.fileId === fileId ? response.data : file))); // Update file in state
        } catch (error) {
            console.error("There was an error updating the file!", error);
        }
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", width: "80%", margin: "0 auto", padding: "10px", height: "100vh" }}>
            {/* Files List */}
            <Box sx={{ flex: 1, marginRight: "20px", overflowY: "auto", maxHeight: "100%" }}>
                <Typography variant="h4" component="h2" sx={{ color: 'black', marginBottom: "20px" }}>Files</Typography>
                <List>
                    {files.length === 0 ? (
                        <ListItem>
                            <ListItemText primary="No Files Available" sx={{ color: 'black' }} />
                        </ListItem>
                    ) : (
                        files.map((file) => (
                            <ListItem key={file.fileId}>
                                <ListItemText 
                                    primary={file.fileName} 
                                    secondary={`${file.fileType} - ${file.size} KB`} // Optional secondary text
                                    sx={{ color: 'black' }}
                                />
                                {/* Edit button */}
                                <IconButton color="primary" onClick={() => handleUpdateFile(file.fileId)}>
                                    <EditIcon />
                                </IconButton>
                                {/* Delete button */}
                                <IconButton color="error" onClick={() => handleDeleteFile(file.fileId)}>
                                    <DeleteIcon />
                                </IconButton>
                            </ListItem>
                        ))
                    )}
                </List>
            </Box>

            {/* File Upload Section */}
            <Box component="form" sx={{ flex: 1, padding: "20px", backgroundColor: "#f5f5f5", borderRadius: "8px", border: "solid 1px #ddd", maxHeight: "100%", overflowY: "auto" }}>
                <input
                    type="file"
                    onChange={handleFileChange}
                    style={{ display: "block", marginBottom: "20px" }}
                />
                <Button 
                    variant="contained" 
                    color="success" 
                    onClick={handleUploadFile} 
                    fullWidth
                    disabled={!selectedFile}
                >
                    Upload File
                </Button>
            </Box>
        </Box>
    );
}
