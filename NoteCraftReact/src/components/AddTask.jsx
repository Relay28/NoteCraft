import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const MAX_DESCRIPTION_LENGTH = 200; // Set your max length here

const AddTask = () => {
    const location = useLocation();
    const isEditing = !!location.state?.task;
    const navigate = useNavigate();
    
    const [taskData, setTaskData] = useState(location.state?.task || {
        taskName: '',
        description: '',
        deadline: '',
        taskStarted: new Date().toISOString().split('T')[0],
        taskEnded: '',
        isCompleted: false,
        category: ''
    });
    
    const [errors, setErrors] = useState({
        taskName: false,
        deadline: false,
        description: false // New error state for description
    });

    // Prevent editing of taskStarted in edit mode
    useEffect(() => {
        if (isEditing) {
            setTaskData(prevData => ({ ...prevData, taskStarted: location.state.task.taskStarted }));
        }
    }, [isEditing, location.state?.task.taskStarted]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTaskData((prevTask) => ({
            ...prevTask,
            [name]: value,
        }));
        
        // Clear errors when input is updated
        if (name === 'taskName' || name === 'deadline') {
            setErrors((prevErrors) => ({ ...prevErrors, [name]: !value }));
        }

        // Check for description length
        if (name === 'description') {
            setErrors((prevErrors) => ({ ...prevErrors, description: value.length > MAX_DESCRIPTION_LENGTH }));
        }
    };

    const handleSaveTask = () => {
        const taskWithDates = {
            ...taskData,
            dateCreated: new Date().toISOString().split('T')[0],
        };

        axios.post('http://localhost:8081/api/todolist/postToDoListRecord', taskWithDates)
            .then(response => {
                navigate('/todolist');  // Redirect back to Todolist page
            })
            .catch(error => {
                console.error("Error creating task!", error);
            });
    };

    const handleBack = () => {
        navigate('/todolist');
    };

    const validateForm = () => {
        const newErrors = {
            taskName: !taskData.taskName,
            deadline: !taskData.deadline,
            description: taskData.description.length > MAX_DESCRIPTION_LENGTH // Validate description length
        };
        setErrors(newErrors);
        return !newErrors.taskName && !newErrors.deadline && !newErrors.description; // Include description in validation
    };

    return (
        <Box sx={{
            padding: '20px',
            marginLeft: "200px"
        }}>
            <Typography variant="h4" component="h2" marginBottom="20px" sx={{ color: "black" }}>
                {isEditing ? "Edit Task" : "Add New Task"}
            </Typography>
            
            <Box sx={{
                backgroundColor: "#fff",
                borderRadius: "25px",
                padding: "30px"
            }}>
                <TextField 
                    label="Task Name" 
                    name="taskName" 
                    value={taskData.taskName} 
                    onChange={handleInputChange} 
                    fullWidth 
                    margin="normal" 
                    error={errors.taskName}
                    helperText={errors.taskName ? "Task Name is required." : ""}
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
                    error={errors.description} // Set error state based on length
                    helperText={errors.description ? `Description is too long (max ${MAX_DESCRIPTION_LENGTH} characters).` : ""}
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
                />
                <TextField 
                    label="Task Started" 
                    name="taskStarted" 
                    type="date" 
                    value={taskData.taskStarted} 
                    onChange={handleInputChange} 
                    fullWidth 
                    margin="normal" 
                    InputLabelProps={{ shrink: true }}
                    disabled
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
                />
                <TextField 
                    label="Category" 
                    name="category" 
                    value={taskData.category} 
                    onChange={handleInputChange} 
                    fullWidth 
                    margin="normal" 
                />
                
                <Box display="flex" justifyContent="space-between" marginTop="20px">
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={() => {
                            if (validateForm()) handleSaveTask();
                        }}
                    >
                        Save Task
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={handleBack}>
                        Back
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default AddTask;
