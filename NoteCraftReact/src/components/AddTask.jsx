import React, { useState, useEffect, useContext } from 'react';
import { Box, Button, TextField, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { PersonalInfoContext } from './PersonalInfoProvider';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const MAX_DESCRIPTION_LENGTH = 200;

const AddTask = () => {
    const location = useLocation();
    const isEditing = !!location.state?.task;
    const { personalInfo } = useContext(PersonalInfoContext);
    const token = localStorage.getItem('token');
    const user = personalInfo;
    const navigate = useNavigate();

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

    const [errors, setErrors] = useState({
        taskName: false,
        deadline: false,
        description: false,
        subTasks: false
    });

    /* useEffect(() => {
        // Ensure user is authenticated and has a valid userId
        if (!token || !user?.id) {
            navigate('/login'); // Redirect to login if authentication fails
        }
    
        // Verify user is authorized to edit the task
        if (isEditing && location.state.task.id !== user.id) {
            alert("Unauthorized access to this task.");
            navigate('/todolist'); // Redirect to task list
        }
    }, [token, user, isEditing, location.state?.task, navigate]); */

    // Prevent editing of taskStarted in edit mode
    // Modify the useEffect hook to handle subtasks correctly
    useEffect(() => {
        if (isEditing) {
            setTaskData((prevData) => ({
                ...prevData,
                ...location.state.task,
                // Ensure subtasks are in the correct format
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

    return (
        <Box sx={{ padding: '10px',width:"80%"  }}>
            <Typography variant="h4" component="h2" marginBottom="20px" sx={{ color: "black" }}>
                {isEditing ? "Edit Task" : "Add New Task"}
            </Typography>
            
            <Box sx={{ backgroundColor: "#fff", borderRadius: "25px", padding: "30px" }}>
                <TextField 
                    label="Task Name" 
                    name="taskName" 
                    value={taskData.taskName} 
                    onChange={handleInputChange} 
                    fullWidth 
                    margin="normal" 
                    error={errors.taskName}
                    helperText={errors.taskName ? "Task Name is required." : ""}
                    sx={{
                        transition: 'transform 0.3s ease, background-color 0.3s ease',  // Smooth transition
                        '&:hover': {
                            transform: 'scale(1.01)',  // Slightly enlarges the text field
                            backgroundColor: 'rgba(0, 0, 0, 0.05)',  // Light gray background color on hover
                            '& input': {
                                color: 'gray',  // Change the input text color to gray when hovered
                            }
                        }
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
                    sx={{
                        transition: 'transform 0.3s ease, background-color 0.3s ease',  // Smooth transition
                        '&:hover': {
                            transform: 'scale(1.01)',  // Slightly enlarges the text field
                            backgroundColor: 'rgba(0, 0, 0, 0.05)',  // Light gray background color on hover
                            '& input': {
                                color: 'gray',  // Change the input text color to gray when hovered
                            }
                        }
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
                    InputLabelProps={{ shrink: true }}
                    error={errors.deadline}
                    helperText={errors.deadline ? "Deadline is required." : ""}
                    sx={{
                        transition: 'transform 0.3s ease, background-color 0.3s ease',  // Smooth transition
                        '&:hover': {
                            transform: 'scale(1.01)',  // Slightly enlarges the text field
                            backgroundColor: 'rgba(0, 0, 0, 0.05)',  // Light gray background color on hover
                            '& input': {
                                color: 'gray',  // Change the input text color to gray when hovered
                            }
                        }
                    }}
                />
                <TextField 
                    label="Task Ended" 
                    name="taskEnded" 
                    type="date" 
                    value={taskData.taskEnded} 
                    onChange={handleInputChange} 
                    fullWidth 
                    margin="normal" 
                    InputLabelProps={{ shrink: true }} 
                    style={{ display: isEditing ? 'block' : 'none' }}
                    sx={{
                        transition: 'transform 0.3s ease, background-color 0.3s ease',  // Smooth transition
                        '&:hover': {
                            transform: 'scale(1.01)',  // Slightly enlarges the text field
                            backgroundColor: 'rgba(0, 0, 0, 0.05)',  // Light gray background color on hover
                            '& input': {
                                color: 'gray',  // Change the input text color to gray when hovered
                            }
                        }
                    }}
                />
                <TextField 
                    label="Category" 
                    name="category" 
                    value={taskData.category} 
                    onChange={handleInputChange} 
                    fullWidth 
                    margin="normal"
                    sx={{
                        transition: 'transform 0.3s ease, background-color 0.3s ease',  // Smooth transition
                        '&:hover': {
                            transform: 'scale(1.01)',  // Slightly enlarges the text field
                            backgroundColor: 'rgba(0, 0, 0, 0.05)',  // Light gray background color on hover
                            '& input': {
                                color: 'gray',  // Change the input text color to gray when hovered
                            }
                        }
                    }}
                />

                <Box marginTop="20px">
                    <Typography variant="h6" marginBottom="10px">
                        Subtasks
                    </Typography>

                    <Typography variant="body2" color="error" style={{ marginTop: '-10px', marginBottom: '10px' }}>
                        {errors.subTasks && "At least one subtask is required and delete empty subtasks."}
                    </Typography>
                    
                    {taskData.subTasks.map((subtask, index) => (
                        <Box key={index} display="flex" alignItems="center">
                            <TextField 
                                label={`Subtask ${index + 1}`}
                                value={subtask.SubTaskName}
                                onChange={(e) => handleSubtaskChange(index, e.target.value)}
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
                            />
                            {taskData.subTasks.length > 1 && (
                                <IconButton 
                                    color="error" 
                                    onClick={() => handleDeleteSubtask(index)}
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
                    <Button
                        variant="contained"
                        color="success"
                        onClick={addSubtaskField}
                        sx={{
                            marginRight: "10px",
                            transition: 'transform 0.3s ease, border-color 0.3s ease, color 0.3s ease',  // Smooth transition for scaling, border and color
                            '&:hover': {
                                transform: 'scale(1.1)',  // Enlarges the button
                                backgroundColor: 'darkgreen',  // Darker shade on hover
                                borderColor: 'darkgreen',  // Optional: Makes the border match the background color
                            }
                        }}
                    >
                        Add Subtask
                    </Button>
                </Box>
                
                <Box display="flex" justifyContent="space-between" marginTop="20px">
                    <Button
                        variant="contained"
                        color="success"
                        onClick={() => {
                            if (validateForm()) handleSaveTask();
                        }}
                        sx={{
                            marginRight: "10px",
                            transition: 'transform 0.3s ease, border-color 0.3s ease, color 0.3s ease',  // Smooth transition for scaling, border and color
                            '&:hover': {
                                transform: 'scale(1.1)',  // Enlarges the button
                                backgroundColor: 'darkgreen',  // Darker shade on hover
                                borderColor: 'darkgreen',  // Optional: Makes the border match the background color
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
                            marginRight: "10px",
                            borderColor: "#e28e8e",
                            transition: 'transform 0.3s ease, background-color 0.3s ease',  // Smooth transition for scaling and color change
                            '&:hover': {
                                transform: 'scale(1.1)',  // Enlarges the button
                                backgroundColor: 'darkred',  // Darker shade on hover
                                borderColor: 'darkred',  // Optional: Makes the border match the background color
                            }
                        }}
                    >
                        Back
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default AddTask;
