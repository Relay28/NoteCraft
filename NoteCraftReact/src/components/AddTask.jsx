import React, { useState, useEffect, useContext } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
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

    useEffect(() => {
        // Ensure user is authenticated and has a valid userId
        if (!token || !user?.id) {
            navigate('/login'); // Redirect to login if authentication fails
        }
    
        // Verify user is authorized to edit the task
        if (isEditing && location.state.task.id !== user.id) {
            alert("Unauthorized access to this task.");
            navigate('/todolist'); // Redirect to task list
        }
    }, [token, user, isEditing, location.state?.task, navigate]);

    // Prevent editing of taskStarted in edit mode
    useEffect(() => {
        if (isEditing) {
            setTaskData((prevData) => ({
                ...prevData,
                ...location.state.task,
                subTasks: location.state.task.subTasks || [{ SubTaskName: '' }]
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

    const handleSubtaskChange = (index, value) => {
        const newSubtasks = [...taskData.subTasks];
        newSubtasks[index] = { SubTaskName: value };
        setTaskData({ ...taskData, subTasks: newSubtasks });
    };

    const addSubtaskField = () => {
        setTaskData((prevTaskData) => ({
            ...prevTaskData,
            subTasks: [...prevTaskData.subTasks, { SubTaskName: '' }]
        }));
    };

    const handleSaveTask = () => {
        const taskWithDates = {
            ...taskData,
            dateCreated: new Date().toISOString().split('T')[0],
            subTasks: taskData.subTasks
                .filter(subtask => subtask.SubTaskName && subtask.SubTaskName.trim() !== '')
                .map(subtask => ({ subTaskName: subtask.SubTaskName.trim() || '' }))
        };
    
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
            description: taskData.description.length > MAX_DESCRIPTION_LENGTH
        };
        setErrors(newErrors);
        return !newErrors.taskName && !newErrors.deadline && !newErrors.description;
    };

    return (
        <Box sx={{ padding: '20px', marginLeft: "200px" }}>
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

                <Box marginTop="20px">
                    <Typography variant="h6" marginBottom="10px">
                        Subtasks
                    </Typography>
                    {taskData.subTasks.map((subtask, index) => (
                        <TextField 
                            key={index}
                            label={`Subtask ${index + 1}`}
                            value={subtask.SubTaskName}
                            onChange={(e) => handleSubtaskChange(index, e.target.value)}
                            fullWidth
                            margin="normal"
                            error={errors.subTasks && subtask.SubTaskName.trim() === ''}
                            helperText={errors.subTasks && subtask.SubTaskName.trim() === '' ? "Subtask is required." : ""}
                        />
                    ))}
                    <Button variant="outlined" color="primary" onClick={addSubtaskField}>
                        Add Subtask
                    </Button>
                </Box>
                
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
                    <Button variant="outlined" onClick={handleBack}>
                        Back
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default AddTask;
