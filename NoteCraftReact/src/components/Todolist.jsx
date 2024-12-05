import React, { useState, useEffect, useContext } from 'react';
import { Box, Button, Typography, List, ListItem, ListItemText, Card, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Select, MenuItem, Grid, Pagination } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from './ThemeProvider';

const Todolist = () => {
    const [tasks, setTasks] = useState([]);
    const [taskToDelete, setTaskToDelete] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [filter, setFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const { darkMode, toggleTheme, theme } = useTheme(); 
    const navigate = useNavigate();
    const location = useLocation();

    const ITEMS_PER_PAGE = 8;

    const personalInfo = location.state?.user || { id: '', username: '' };

    useEffect(() => {
        if (!personalInfo.id) {
            navigate('/login');
            return;
        }

        axios.get('http://localhost:8081/api/todolist/getAllToDoList', {
            params: { userId: personalInfo.id },
        })
            .then(response => {
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
        setCurrentPage(1); // Reset to first page when filter changes
    }, [filter, tasks]);

    // Pagination logic
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentTasks = filteredTasks.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handleEdit = (task) => {
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
            width: "95%",
            marginTop:10,
        }}>
            <Box sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                marginBottom: "20px"
            }}>
                <Typography variant="h4" component="h2" sx={{ textAlign: 'left' }}>
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
                        transition: 'transform 0.3s ease, background-color 0.3s ease',
                        '&:hover': {
                            transform: 'scale(1.1)',
                            backgroundColor: 'darkgreen',
                        }
                    }}
                    variant="contained"
                    color="success"
                    onClick={() => navigate('/add-task', { state: { user: personalInfo } })}
                >
                    Add New To-Do List
                </Button>
            </Box>

            {filteredTasks.length === 0 ? (
                <ListItem>
                    <ListItemText sx ={{color:(theme)=>theme.palette.text.primary}}primary={`No ${filter !== 'All' ? filter : ''} To-Do Lists Available`} />
                </ListItem>
            ) : (
                <>
                    <Grid container spacing={3}>
                        {currentTasks.map((task, index) => (
                            <Grid item xs={3} key={`task-${index}`}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        borderRadius: "10px",
                                        cursor: "pointer",
                                        backgroundColor: darkMode
                                            ? task.isCompleted 
                                                ? '#b2d8b2'
                                                : '#f4b2b2'
                                            : task.isCompleted 
                                                ? '#b2d8b2'
                                                : '#f4b2b2',
                                    }}
                                    onClick={() => handleTaskClick(task)}
                                >
                                    <CardContent
                                        sx={{
                                            position: 'relative',
                                            transition: 'transform 0.3s ease, background-color 0.3s ease',
                                            '&:hover': {
                                                transform: 'scale(1.01)',
                                                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                            }
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                            <Box sx={{ 
                                                position: 'absolute', 
                                                top: 0, 
                                                right: 0, 
                                                display: 'flex', 
                                                gap: 1 
                                            }}>
                                                {!task.taskEnded && (
                                                    <Button
                                                        variant="text"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleEdit(task);
                                                        }}
                                                        sx={{
                                                            minWidth: 'auto',
                                                            padding: '4px',
                                                            color: 'green',
                                                            marginTop: "15px",
                                                            marginRight: "10px"
                                                        }}
                                                    >
                                                        <EditIcon />
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="text"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleOpenDeleteDialog(task, index);
                                                    }}
                                                    sx={{
                                                        minWidth: 'auto',
                                                        padding: '4px',
                                                        color: 'red',
                                                        marginTop: "15px",
                                                        marginRight: "10px"
                                                    }}
                                                >
                                                    <DeleteIcon />
                                                </Button>
                                            </Box>
                                            <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: "10px", textAlign: 'left', color: "black" }}>
                                                {task.taskName}
                                            </Typography>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="body1" sx={{ marginBottom: "5px", textAlign: 'left' }}>
                                                    <strong>Date Started:</strong> {task.taskStarted}
                                                </Typography>
                                                {task.isCompleted && (
                                                    <Typography variant="body1" sx={{ marginBottom: "5px", textAlign: 'left' }}>
                                                        <strong>Date Ended:</strong> {task.taskEnded}
                                                    </Typography>
                                                )}
                                                <Typography variant="body1" sx={{ marginBottom: "5px", textAlign: 'left' }}>
                                                    <strong>Deadline:</strong> {task.deadline}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Pagination */}
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        marginTop: 3, 
                        width: '100%' 
                    }}>
                        <Pagination 
                            count={Math.ceil(filteredTasks.length / ITEMS_PER_PAGE)}
                            page={currentPage}
                            onChange={handlePageChange}
                            color="primary"
                            size="large"
                        />
                    </Box>
                </>
            )}

            {/* Delete Confirmation Dialog remains the same */}
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
                            transition: 'transform 0.3s ease, background-color 0.3s ease',
                            '&:hover': {
                                transform: 'scale(1.1)',
                                backgroundColor: 'darkgreen',
                                borderColor: 'darkgreen',
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
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Todolist;