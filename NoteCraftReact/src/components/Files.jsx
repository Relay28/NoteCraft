import React, { useState, useEffect } from "react";
import axios from "axios";
import { List, ListItem, ListItemText, Button, Box, Typography, IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

export default function File() {
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [userId, setUserId] = useState(null);

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

    if (!userId) {
        return <Typography variant="h6">Please log in to view your files.</Typography>;
    }

    return (
        <Box
            sx={{
                maxWidth: "1325px",
                margin: "20px auto",
                padding: "20px",
                backgroundColor: "#C8E6C9", // Light green background for the larger container
                borderRadius: "20px",
                boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.2)",
                marginLeft: "0px" // Adjust the Location of the Entire Content
            }}
        >
            <Typography
                variant="h5"
                sx={{
                    textAlign: "center",
                    marginBottom: "20px",
                    color: "#2E7D32", // Dark green for the title
                }}
            >
                Files Dashboard
            </Typography>

            <Box
                sx={{
                    display: "flex",
                    gap: "20px",
                    justifyContent: "center",
                    
                }}
            >
                {/* Your Files Section */}
                <Box
                    sx={{
                        flex: 2,
                        backgroundColor: "#E8F5E9",
                        borderRadius: "15px",
                        padding: "20px",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                    }}
                >
                    <Typography 
                        variant="h6" 
                        sx={{ marginBottom: "20px",
                        color: "#2E7D32",}}
                        >
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
                                    backgroundColor: "#FBFBFB",
                                }}
                            >
                                <ListItemText primary={file.fileName} secondary={`Size: ${file.size} bytes`} />
                                <Box>
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
                        flex: 1,
                        backgroundColor: "#E8F5E9",
                        borderRadius: "15px",
                        padding: "20px",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                    }}
                >
                    <Typography variant="h6" sx={{ marginBottom: "20px", color: "#2E7D32"}}>Upload a File</Typography>
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
        </Box>
    );
}
