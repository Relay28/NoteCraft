import React, { useState, useEffect, useContext } from 'react';
import { Box, Button, Typography, List, ListItem, ListItemText, Card, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Select, MenuItem, Grid } from '@mui/material';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const Todolist = () => {
    const [tasks, setTasks] = useState([]);
    const [taskToDelete, setTaskToDelete] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [filter, setFilter] = useState('All');
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

    useEffect(() => {
        switch (filter) {
            case 'Ongoing':
                setFilteredTasks(tasks.filter(task => !task.isCompleted));
                break;
            case 'Completed':
                setFilteredTasks(tasks.filter(task => task.isCompleted));
                break;
            default:
                setFilteredTasks(tasks);
        }
    }, [filter, tasks]);

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

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            overflowX: "auto"
        }}>
            <Box sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                marginBottom: "20px"
            }}>
                <Typography variant="h4" component="h2" sx={{ color: "black" }}>
                    To-Do List
                </Typography>

                <FormControl sx={{
                    marginLeft: "20px"
                }}>
                    <Select
                        value={filter}
                        onChange={handleFilterChange}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Filter Tasks' }}
                    >
                        <MenuItem value="All">All</MenuItem>
                        <MenuItem value="Ongoing">Ongoing</MenuItem>
                        <MenuItem value="Completed">Completed</MenuItem>
                    </Select>
                </FormControl>

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

            <Grid container spacing={3}>
                {filteredTasks.length === 0 ? (
                    <Grid item xs={12}>
                        <ListItem>
                            <ListItemText primary={`No ${filter !== 'All' ? filter : ''} To-Do Lists Available`} />
                        </ListItem>
                    </Grid>
                ) : (
                    filteredTasks.map((task, index) => (
                        index % 4 === 0 ? (
                            <Grid container item xs={12} spacing={3} key={`row-${index}`}>
                                {filteredTasks.slice(index, index + 4).map((task, innerIndex) => (
                                    <Grid item xs={3} key={`task-${index}-${innerIndex}`}>
                                        <Card
                                            sx={{
                                                height: '100%',
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
                                                <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                                    <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: "10px" }}>
                                                        {task.taskName}
                                                    </Typography>
                                                    <Box sx={{ flex: 1 }}>
                                                        <Typography variant="body1" sx={{ marginBottom: "5px" }}>
                                                            <strong>Category:</strong> {task.category || 'N/A'}
                                                        </Typography>
                                                        <Typography variant="body1" sx={{ marginBottom: "5px" }}>
                                                            <strong>Status:</strong> {task.isCompleted ? "Completed" : "Incomplete"}
                                                        </Typography>
                                                        <Typography variant="body1" sx={{ marginBottom: "5px" }}>
                                                            <strong>Deadline:</strong> {task.deadline || 'N/A'}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                        {!task.taskEnded && (
                                                            <Button
                                                                variant="contained"
                                                                color="success"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleEdit(task);
                                                                }}
                                                                sx={{
                                                                    marginTop: "10px",
                                                                    marginRight: "10px",
                                                                    transition: 'transform 0.3s ease, background-color 0.3s ease',
                                                                    '&:hover': {
                                                                        transform: 'scale(1.1)',
                                                                        backgroundColor: 'darkgreen',
                                                                        borderColor: 'darkgreen',
                                                                    }
                                                                }}
                                                            >
                                                                Edit
                                                            </Button>
                                                        )}
                                                        <Button
                                                            variant="contained"
                                                            color="error"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleOpenDeleteDialog(task, index);
                                                            }}
                                                            sx={{
                                                                marginTop: "10px",
                                                                transition: 'transform 0.3s ease, background-color 0.3s ease',
                                                                '&:hover': {
                                                                    transform: 'scale(1.1)',
                                                                    backgroundColor: 'darkred',
                                                                    borderColor: 'darkred',
                                                                }
                                                            }}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </Box>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        ) : null
                    ))
                )}
            </Grid>

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
                    <Button
                        onClick={handleCloseDialog}
                        variant="contained"
                        color="success"
                        sx={{
                            transition: 'transform 0.3s ease, background-color 0.3s ease',  // Smooth transition for scaling and color change
                            '&:hover': {
                                transform: 'scale(1.1)',  // Enlarges the button
                                backgroundColor: 'darkgreen',  // Darker shade on hover
                                borderColor: 'darkgreen',  // Optional: Makes the border match the background color
                            }
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            if (taskToDelete) {
                                handleDeleteTask(taskToDelete.task.taskID, taskToDelete.index);
                            }
                        }}
                        autoFocus
                        variant="contained"
                        color="error"
                        sx={{
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
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Todolist;