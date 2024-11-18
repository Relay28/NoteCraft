import React, { useState, useEffect } from "react";
import axios from "axios";
import { List, ListItem, ListItemText, Button, Box, Typography, IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

export default function File() {
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [userId, setUserId] = useState(null); // State to hold the userId

    // Fetch userId from localStorage (or cookies) if available
    useEffect(() => {
        const storedUserId = localStorage.getItem('userId'); // Assuming you stored the userId in localStorage
        if (storedUserId) {
            setUserId(storedUserId);
            fetchFiles(storedUserId);
        }
    }, []); // This runs only once when the component mounts

    // Fetch files from the API for the specific user
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
                params: { userId },  // Pass userId when uploading
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

    if (!userId) {
        return <Typography variant="h6">Please log in to view your files.</Typography>;
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", width: "80%", margin: "0 auto", padding: "10px", height: "100vh" }}>
            {/* Files List */}
            <Box sx={{ width: "50%", overflowY: "auto", padding: "10px" }}>
                <Typography variant="h6">Your Files</Typography>
                <List>
                    {files.map((file) => (
                        <ListItem key={file.fileId} sx={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", padding: "5px" }}>
                            <ListItemText primary={file.fileName} secondary={`Size: ${file.size} bytes`} />
                            <Box>
                                <IconButton onClick={() => handleUpdateFile(file.fileId)}><EditIcon /></IconButton>
                                <IconButton onClick={() => handleDeleteFile(file.fileId)}><DeleteIcon /></IconButton>
                            </Box>
                        </ListItem>
                    ))}
                </List>
            </Box>

            {/* File Upload */}
            <Box sx={{ width: "40%" }}>
                <Typography variant="h6">Upload a File</Typography>
                <input type="file" onChange={handleFileChange} />
                <Button variant="contained" onClick={handleUploadFile}>Upload</Button>
            </Box>
        </Box>
    );
}
