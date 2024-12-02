import React, { useState, useEffect, useContext } from 'react';
import { Box, Button, Typography, List, ListItem, ListItemText, Card, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const Todolist = () => {
    const [tasks, setTasks] = useState([]);
    const [taskToDelete, setTaskToDelete] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const personalInfo = location.state?.user || { id: '', username: '' };
    console.log(personalInfo.id);

    useEffect(() => {
        // If the user ID is missing, redirect to the login page
        if (!personalInfo.id) {
            navigate('/login');
            return;
        }

        // Fetch the to-do list for the logged-in user
        axios.get('http://localhost:8081/api/todolist/getAllToDoList', {
            params: { userId: personalInfo.id },
        })
            .then(response => {
                console.log('Fetched Tasks:', response.data);
                if (Array.isArray(response.data)) {
                    setTasks(response.data);
                } else {
                    setTasks([]);
                }
            })
            .catch(error => {
                console.error('Error fetching tasks', error);
                setTasks([]);
            });
    }, [personalInfo.id, navigate]);

    const handleEdit = (task) => {
        console.log('Editing task:', task);
        const taskCopy = JSON.parse(JSON.stringify(task));
        navigate('/add-task', { state: { task: taskCopy, user: personalInfo } });
    };

    const handleDeleteTask = (id, index) => {
        axios.delete(`http://localhost:8081/api/todolist/deleteToDoList/${id}`, {
            params: { userId: personalInfo.id },
        })
            .then(() => {
                const updatedTasks = tasks.filter((_, i) => i !== index);
                setTasks(updatedTasks);
                setOpenDialog(false);
            })
            .catch(error => {
                console.error('Error deleting task', error);
            });
    };

    const handleOpenDeleteDialog = (task, index) => {
        setTaskToDelete({ task, index });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setTaskToDelete(null);
    };

    const handleTaskClick = (task) => {
        navigate('/task', { state: { task, user: personalInfo } });
    };

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "row",
            width:"85%",
            alignItems: "flex-start",
            overflowX: "hidden"
        }}>
            <Box sx={{
                flex: 2,
                marginRight: "20px",
                overflowY: "auto",
            }}>
                <Box sx={{
                    display: "flex",
                    
                    alignItems: "center",
                    marginBottom: "20px",
                }}>
                    <Typography variant="h4" component="h2" sx={{ color: "black" }}>
                        To-Do List
                    </Typography>

                    <Button 
                        sx={{
                            marginLeft: "60%",
                            transition: 'transform 0.3s ease, background-color 0.3s ease', // Smooth transition for both scale and color
                            '&:hover': {
                                transform: 'scale(1.1)',  // Enlarges the button
                                backgroundColor: 'darkgreen',  // Changes the color to a darker shade
                            }
                        }}
                        variant="contained" 
                        color="success" 
                        onClick={() => navigate('/add-task', { state: { user: personalInfo } })}
                    >
                        Add New To-Do List
                    </Button>
                </Box>

                <List sx={{
                    padding: "10px",
                    borderRadius: "8px",
                }}>
                    {tasks.length === 0 ? (
                        <ListItem>
                            <ListItemText primary="No To-Do Lists Available" />
                        </ListItem>
                    ) : (
                        tasks.map((task, index) => (
                            <Card
                                key={index}
                                sx={{
                                    marginBottom: "15px",
                                    borderRadius: "10px",
                                    cursor: "pointer"
                                }}
                                onClick={() => handleTaskClick(task)}
                            >
                                <CardContent
                                    sx={{
                                        transition: 'transform 0.3s ease, background-color 0.3s ease',  // Smooth transition for scaling and color change
                                        '&:hover': {
                                            transform: 'scale(1.01)',  // Slightly enlarges the CardContent
                                            backgroundColor: 'rgba(0, 0, 0, 0.1)',  // Grays it out with a slight transparency
                                        }
                                    }}
                                >
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Box>
                                            <Typography variant="h5" sx={{ fontWeight: "bold"}}>
                                                {task.taskName}
                                            </Typography>
                                        </Box>

                                        <Box>
                                            <Button    
                                                variant="contained"
                                                color="success"  // Use the same color as the "Add New To-Do List" button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEdit(task);
                                                }}
                                                sx={{
                                                    marginTop: "15px",
                                                    marginRight: "10px",
                                                    transition: 'transform 0.3s ease, background-color 0.3s ease',  // Smooth transition for scaling and color change
                                                    '&:hover': {
                                                        transform: 'scale(1.1)',  // Enlarges the button
                                                        backgroundColor: 'darkgreen',  // Darker shade on hover
                                                        borderColor: 'darkgreen',  // Optional: Makes the border match the background color
                                                    }
                                                }}
                                            >
                                                Edit
                                            </Button>

                                            <Button
                                                variant="contained"
                                                color="error"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleOpenDeleteDialog(task, index);
                                                }}
                                                sx={{
                                                    marginTop: "15px",
                                                    marginRight: "10px",
                                                    transition: 'transform 0.3s ease, background-color 0.3s ease',  // Smooth transition for scaling and color change
                                                    '&:hover': {
                                                        transform: 'scale(1.1)',  // Enlarges the button
                                                        backgroundColor: 'darkred',  // Darker shade on hover
                                                        borderColor: 'darkred',  // Optional: Makes the border match the background color
                                                    }
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        </Box>
                                    </Box>

                                    <Box sx={{
                                        display: "flex",
                                        gap: "250px"
                                    }}>
                                        <Box sx={{ marginLeft: "25px", marginTop: "20px", textAlign: "left" }}>
                                            <Typography variant="body1" sx={{ marginBottom: "10px"}}>
                                                <strong>Category:</strong> {task.category || 'N/A'}
                                            </Typography>
                                            <Typography variant="body1">
                                                <strong>Status:</strong> {task.isCompleted ? "Completed" : "Incomplete"}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ marginTop: "20px", textAlign: "left" }}>
                                            <Typography variant="body1" sx={{ marginBottom: "10px"}}>
                                                <strong>Date Started:</strong> {task.taskStarted || 'N/A'}
                                            </Typography>
                                            <Typography variant="body1" sx={{ marginBottom: "10px"}}>
                                                <strong>Date Ended:</strong> {task.taskEnded || 'Ongoing'}
                                            </Typography>
                                            <Typography variant="body1">
                                                <strong>Deadline:</strong> {task.deadline || 'N/A'}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </List>

                <Dialog
                    open={openDialog}
                    onClose={handleCloseDialog}
                >
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete this task?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} color="primary">
                            Cancel
                        </Button>
                        <Button
                            onClick={() => {
                                if (taskToDelete) {
                                    handleDeleteTask(taskToDelete.task.taskID, taskToDelete.index);
                                }
                            }}
                            color="error"
                            autoFocus
                        >
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
};

export default Todolist;