import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, List, ListItem, ListItemText, Card, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Todolist = () => {
    const [tasks, setTasks] = useState([]);
    const [taskData, setTaskData] = useState({
        taskName: '',
        description: '',
        deadline: '',
        taskStarted: '',
        taskEnded: '',
        isCompleted: false,
        category: ''
    });
    const navigate = useNavigate();
    const [openDialog, setOpenDialog] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:8081/api/todolist/getAllToDoList')
            .then(response => {
                if (Array.isArray(response.data)){
                    setTasks(response.data);
                }
                else{
                    setTasks([]);
                }
            })
            .catch(error => {
                console.error('Error fetching tasks', error);
                setTasks([]);
            });
    }, []);

    const handleEdit = (task) => {
        navigate(`/edit-task`, { state: { task } });
    };

    const handleDeleteTask = (id, index) => {
        axios.delete(`http://localhost:8081/api/todolist/deleteToDoList/${id}`)
            .then(() => {
                const updatedTasks = tasks.filter((_, i) => i !== index);
                setTasks(updatedTasks);
                setOpenDialog(false); // Close dialog on successful deletion
            })
            .catch(error => {
                console.error("Error deleting task", error);
            });
    };

    // Open confirmation dialog
    const handleOpenDeleteDialog = (task, index) => {
        setTaskToDelete({ task, index });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setTaskToDelete(null); // Reset task to delete
    };

    const handleTaskClick = (task) => {
        navigate("/task", { state: { task } });
    };

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginLeft: "90px",
            marginRight: "-50px",
            overflowX: "hidden"
        }}>

        <Box sx={{
                flex: 3,
                marginRight: "20px",
                overflowY: "auto",
            }}>
                
                <Box sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                }}>
                    <Typography variant="h4" component="h2" sx={{ color: "black" }}>
                        To-Do List
                    </Typography>

                    <Button variant="contained" color="success" onClick={() => navigate('/add-task')}>
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
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Box>
                                            <Typography variant="h6">
                                                {task.taskName}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                {task.category}
                                            </Typography>
                                        </Box>

                                        <Box>
                                            <Button
                                                variant="outlined"
                                                color="secondary"
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevent triggering card click
                                                    handleEdit(task);
                                                }}
                                                sx={{ marginRight: "10px" }}
                                            >
                                                Edit
                                            </Button>

                                            <Button
                                                variant="outlined"
                                                color="error"
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevent triggering card click
                                                    handleOpenDeleteDialog(task, index);
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        </Box>
                                    </Box>

                                    <Box sx={{ marginTop: "10px", textAlign: "left" }}>
                                        <Typography variant="body1">
                                            <strong>
                                                Date Started:
                                            </strong>
                                            {' '}
                                            {task.taskStarted ? task.taskStarted : 'N/A'}
                                        </Typography>

                                        <Typography variant="body1">
                                            <strong>
                                                Date Ended: 
                                            </strong>
                                            {' '}
                                            {task.taskEnded ? task.taskEnded : 'N/A'}
                                        </Typography>

                                        <Typography variant="body1">
                                            <strong>
                                                Deadline: 
                                            </strong>
                                            {' '}
                                            {task.deadline ? task.deadline : 'N/A'}
                                        </Typography>
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