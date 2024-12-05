import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Button, TextField, Typography, IconButton, Grid, Pagination } from '@mui/material';
import { PersonalInfoContext } from './PersonalInfoProvider';
import { useTheme } from './ThemeProvider';

import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';

const MAX_DESCRIPTION_LENGTH = 200;
const MAX_SUBTASKS_PER_PAGE = 3;

const AddTask = () => {
    const token = localStorage.getItem('token');
    const location = useLocation();
    const { personalInfo } = useContext(PersonalInfoContext);
    const isEditing = !!location.state?.task;
    const navigate = useNavigate();
    const [subtaskPage, setSubtaskPage] = useState(1);
    const [taskData, setTaskData] = useState(location.state?.task || {
        taskName: '',
        description: '',
        deadline: '',
        taskStarted: new Date().toISOString().split('T')[0],
        taskEnded: '',
        isCompleted: false,
        category: '',
        subTasks: [{ SubTaskName: '' }]
    });
    const { theme } = useTheme();

    const user = personalInfo;

    const [errors, setErrors] = useState({
        taskName: false,
        deadline: false,
        description: false,
        subTasks: false
    });

    useEffect(() => {
        if (isEditing) {
            setTaskData((prevData) => ({
                ...prevData,
                ...location.state.task,
                subTasks: location.state.task.subTasks && location.state.task.subTasks.length > 0 
                    ? location.state.task.subTasks.map(subtask => ({
                        SubTaskName: subtask.subTaskName || subtask.SubTaskName || ''
                    }))
                    : [{ SubTaskName: '' }]
            }));
        }
    }, [isEditing, location.state?.task]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTaskData((prevTask) => ({
            ...prevTask,
            [name]: value,
        }));

        if (name === 'taskName' || name === 'deadline') {
            setErrors((prevErrors) => ({ ...prevErrors, [name]: !value }));
        }

        if (name === 'description') {
            setErrors((prevErrors) => ({ ...prevErrors, description: value.length > MAX_DESCRIPTION_LENGTH }));
        }
    };

    // Modify the handleSubtaskChange method
    const handleSubtaskChange = (index, value) => {
        setTaskData((prevTaskData) => {
            const newSubtasks = [...prevTaskData.subTasks];
            newSubtasks[index] = { SubTaskName: value };
            return {
                ...prevTaskData,
                subTasks: newSubtasks
            };
        });
    };

    const addSubtaskField = () => {
        setTaskData((prevTaskData) => ({
            ...prevTaskData,
            subTasks: [...prevTaskData.subTasks, { SubTaskName: '' }]
        }));
    };

    const handleSaveTask = () => {
        // Store the original subtask IDs if we're in editing mode
        const originalSubtaskIds = isEditing 
            ? location.state.task.subTasks.map(subtask => subtask.subTaskID)
            : [];
    
        const taskWithDates = {
            ...taskData,
            dateCreated: new Date().toISOString().split('T')[0],
            // If editing an existing task, use the original task's ID
            taskID: isEditing ? location.state.task.taskID : undefined,
            subTasks: taskData.subTasks
                .filter(subtask => subtask.SubTaskName && subtask.SubTaskName.trim() !== '')
                .map((subtask, index) => ({
                    // Use the original subtask ID if it exists, otherwise omit
                    ...(originalSubtaskIds[index] ? { subTaskID: originalSubtaskIds[index] } : {}),
                    subTaskName: subtask.SubTaskName.trim() || ''
                }))
        };
    
        // Rest of the method remains the same
        console.log('Task Data:', taskWithDates);
        console.log('User ID:', user?.id);
        console.log('Token:', token);
    
        const headers = { Authorization: `Bearer ${token}` };
    
        axios.post(
            `http://localhost:8081/api/todolist/postToDoListRecord?userId=${user.id}`, 
            taskWithDates, 
            { headers }
        )
            .then(() => navigate('/todolist', { state: { user: user } }))
            .catch(error => {
                console.error('Error response:', error.response);
                console.error('Error message:', error.message);
                alert(`Failed to save task: ${error.response?.data?.message || "Please try again."}`);
            });
    };

    const handleBack = () => {
        navigate('/todolist', { state: { user: user } });
    };

    const validateForm = () => {
        const newErrors = {
            taskName: !taskData.taskName,
            deadline: !taskData.deadline,
            description: taskData.description.length > MAX_DESCRIPTION_LENGTH,
            subTasks: taskData.subTasks.length === 0 || taskData.subTasks.some(subtask => !subtask.SubTaskName.trim())
        };
        setErrors(newErrors);
        return !newErrors.taskName && !newErrors.deadline && !newErrors.description && !newErrors.subTasks;
    };

    const handleDeleteSubtask = (indexToRemove) => {
        if (!isEditing) {
            // Only remove the subtask locally during task creation
            setTaskData((prevTaskData) => ({
                ...prevTaskData,
                subTasks: prevTaskData.subTasks.filter((_, index) => index !== indexToRemove),
            }));
            return;
        }
        // Retrieve the original task from location state
        const originalTask = location.state.task;
        
        // Find the specific subtask ID from the original task's subtasks
        const subtaskToDelete = originalTask.subTasks[indexToRemove];
        const subTaskId = subtaskToDelete ? subtaskToDelete.subTaskID : null;
    
        console.log("Subtask to delete:", subTaskId);
    
        if (!subTaskId) {
            // If no subTaskId is present, simply remove it from the state
            setTaskData((prevTaskData) => ({
                ...prevTaskData,
                subTasks: prevTaskData.subTasks.filter((_, index) => index !== indexToRemove),
            }));
            return;
        }
    
        const headers = { Authorization: `Bearer ${token}` };
    
        axios
            .delete(`http://localhost:8081/api/todolist/deleteSubTask/${originalTask.taskID}/${subTaskId}`, { headers })
            .then(() => {
                // Update the state to remove the subtask locally
                setTaskData((prevTaskData) => ({
                    ...prevTaskData,
                    subTasks: prevTaskData.subTasks.filter((_, index) => index !== indexToRemove),
                }));
            })
            .catch((error) => {
                console.log("Task ID:", originalTask.taskID);
                console.log("Task ID:", subTaskId);
                console.error("Error deleting subtask:", error.response || error.message);
                alert("Failed to delete subtask. Please try again.");
            });
    };

    const handleSubtaskPageChange = (event, value) => {
        setSubtaskPage(value);
    };

    const renderSubtasks = () => {
        const startIndex = (subtaskPage - 1) * MAX_SUBTASKS_PER_PAGE;
        const endIndex = startIndex + MAX_SUBTASKS_PER_PAGE;
        const currentSubtasks = taskData.subTasks.slice(startIndex, endIndex);

        return (
            <Box sx={{ }}>
                {currentSubtasks.map((subtask, index) => (
                    <Box key={startIndex + index} display="flex" alignItems="center">
                        <TextField 
                            label={`Subtask ${startIndex + index + 1}`}
                            value={subtask.SubTaskName}
                            onChange={(e) => handleSubtaskChange(startIndex + index, e.target.value)}
                            fullWidth
                            margin="normal"
                            error={errors.subTasks && subtask.SubTaskName.trim() === ''}
                            helperText={errors.subTasks && subtask.SubTaskName.trim() === '' ? "Subtask is required." : ""}
                            sx={{
                                marginRight: "10px",
                                transition: 'transform 0.3s ease, background-color 0.3s ease',
                                '&:hover': {
                                    transform: 'scale(1.01)',
                                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                                }
                            }}
                            InputLabelProps={{
                                style: { color: theme.palette.text.primary }, // Use theme palette text color
                            }}
                        />
                        {taskData.subTasks.length > 1 && (
                            <IconButton 
                                color="error" 
                                onClick={() => handleDeleteSubtask(startIndex + index)}
                                sx={{
                                    transition: 'transform 0.3s ease, color 0.3s ease',
                                    '&:hover': {
                                        transform: 'scale(1.2)',
                                        color: 'darkred'
                                    }
                                }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        )}
                    </Box>
                ))}
                {taskData.subTasks.length > MAX_SUBTASKS_PER_PAGE && (
                    <Box display="flex" justifyContent="center" marginTop="20px">
                        <Pagination 
                            count={Math.ceil(taskData.subTasks.length / MAX_SUBTASKS_PER_PAGE)}
                            page={subtaskPage}
                            onChange={handleSubtaskPageChange}
                            color="primary"
                        />
                    </Box>
                )}
                <Button
                    variant="contained"
                    color="success"
                    onClick={addSubtaskField}
                    sx={{
                        marginTop: "10px",
                        transition: 'transform 0.3s ease, border-color 0.3s ease, color 0.3s ease',
                        '&:hover': {
                            transform: 'scale(1.1)',
                            backgroundColor: 'darkgreen',
                            borderColor: 'darkgreen',
                        }
                    }}
                >
                    Add Subtask
                </Button>
            </Box>
        );
    };

    return (
        <Box sx={{padding: '10px', width:"90%", overflow:"hidden"}}>
            <Typography variant="h4" component="h2" marginBottom="20px">
                {isEditing ? "Edit Task" : "Add New Task"}
            </Typography>
            
            <Grid container spacing={3}>
                {/* Left Column */}
                <Grid item xs={12} md={6}>
                    <Box sx={{ borderRadius: "25px", padding: "30px", height: "100%" }}>
                        <TextField 
                            label="Task Name" 
                            name="taskName" 
                            value={taskData.taskName} 
                            onChange={handleInputChange} 
                            fullWidth 
                            margin="normal" 
                            error={errors.taskName}
                            helperText={errors.taskName ? "Task Name is required." : ""}
                            InputLabelProps={{
                                style: { color: theme.palette.text.primary }, // Use theme palette text color
                            }}
                        />
                        <TextField 
                            label="Description" 
                            name="description" 
                            value={taskData.description} 
                            onChange={handleInputChange} 
                            fullWidth 
                            margin="normal"
                            multiline
                            rows={4}
                            error={errors.description}
                            helperText={errors.description ? `Description is too long (max ${MAX_DESCRIPTION_LENGTH} characters).` : ""}
                            InputLabelProps={{
                                style: { color: theme.palette.text.primary }, // Use theme palette text color
                            }}
                        />
                        <TextField 
                            label="Deadline" 
                            name="deadline" 
                            type="date" 
                            value={taskData.deadline} 
                            onChange={handleInputChange} 
                            fullWidth 
                            margin="normal" 
                            error={errors.deadline}
                            helperText={errors.deadline ? "Deadline is required." : ""}
                            InputLabelProps={{
                                shrink: true,
                                style: { color: theme.palette.text.primary }, // Combine shrink and color
                            }}
                        />
                    </Box>
                </Grid>

                {/* Right Column - Subtasks */}
                <Grid item xs={12} md={6}>
                    <Box sx={{ borderRadius: "25px", padding: "30px", height: "100%" }}>
                        <Typography variant="h6" marginBottom="10px">
                            Subtasks
                        </Typography>

                        <Typography variant="body2" color="error" style={{ marginTop: '-10px', marginBottom: '10px' }}>
                            {errors.subTasks && "At least one subtask is required and delete empty subtasks."}
                        </Typography>
                        
                        {renderSubtasks()}
                    </Box>
                </Grid>

                {/* Buttons Box */}
                <Grid item xs={12}>
                    <Box sx={{  
                        display: "flex", 
                        justifyContent: "space-between",
                        marginLeft: "30px",
                        marginRight: "35px",
                        marginTop: "-30px",
                    }}>
                        <Button
                            variant="contained"
                            color="success"
                            onClick={() => {
                                if (validateForm()) handleSaveTask();
                            }}
                            sx={{
                                marginRight: "10px",
                                transition: 'transform 0.3s ease, border-color 0.3s ease, color 0.3s ease',
                                '&:hover': {
                                    transform: 'scale(1.1)',
                                    backgroundColor: 'darkgreen',
                                    borderColor: 'darkgreen',
                                }
                            }}
                        >
                            Save Task
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleBack}
                            sx={{
                                marginLeft: "10px",
                                borderColor: "#e28e8e",
                                transition: 'transform 0.3s ease, background-color 0.3s ease',
                                '&:hover': {
                                    transform: 'scale(1.1)',
                                    backgroundColor: 'darkred',
                                    borderColor: 'darkred',
                                }
                            }}
                        >
                            Back
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AddTask;