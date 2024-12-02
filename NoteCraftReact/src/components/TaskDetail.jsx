// npm install react-calendar
// npm install @mui/icons-material
import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, FormControlLabel, Radio } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const TaskDetail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = location.state?.user || { id: '', username: '' };
    const [taskData, setTaskData] = useState(location.state?.task || {
        taskName: '',
        description: '',
        deadline: '',
        taskStarted: '',
        taskEnded: '',
        isCompleted: false,
        category: '',
        subtasks: []
    });
    const [date, setDate] = useState(new Date());

    console.log("Task Data in TaskDetail:", taskData);

    useEffect(() => {
        if (!location.state?.task) {
            navigate('/todolist', { state: { user: user } });
        } else {
            const taskId = location.state.task.id; // Assuming the task object has an 'id'
        }
    }, [location, navigate]);

    const handleBack = () => {
        navigate('/todolist', { state: { user: user } });
    };

    const tileClassName = ({ date }) => {
        const taskStartedDate = new Date(taskData.taskStarted);
        const taskEndedDate = new Date(taskData.taskEnded);
        const deadlineDate = new Date(taskData.deadline);
        const todayDate = new Date();
    
        if (date.toDateString() === todayDate.toDateString()) {
            if (date.toDateString() === deadlineDate.toDateString()) return 'today-deadline';
            if (date.toDateString() === taskStartedDate.toDateString()) return 'today-started';
            if (taskData.taskEnded && date.toDateString() === taskEndedDate.toDateString()) return 'today-ended';
            return 'today';
        }
        if (date.toDateString() === taskStartedDate.toDateString()) return 'task-started';
        if (taskData.taskEnded && date.toDateString() === taskEndedDate.toDateString()) return 'task-ended';
        if (date.toDateString() === deadlineDate.toDateString()) return 'deadline';
    
        return null;
    };

    const calculateRemainingDays = () => {
        const today = new Date();
        const deadlineDate = new Date(taskData.deadline);
        const timeDiff = deadlineDate - today;
        return Math.ceil(timeDiff / (1000 * 3600 * 24));
    };

    const calculateDaysTaken = () => {
        if (taskData.taskEnded) {
            const taskStartedDate = new Date(taskData.taskStarted);
            const taskEndedDate = new Date(taskData.taskEnded);
            const timeDiff = taskEndedDate - taskStartedDate;
            return Math.ceil(timeDiff / (1000 * 3600 * 24));
        }
        return null;
    };

    const remainingDays = calculateRemainingDays();
    const daysTaken = calculateDaysTaken();

    const renderDeadlineText = () => {
        if (taskData.taskEnded) return `Days taken to complete: ${daysTaken}`;
        return remainingDays >= 0 ? `Days until deadline: ${remainingDays}` : 'Deadline has passed.';
    };

    const renderDeadlineColor = () => {
        if (taskData.taskEnded) return 'black';
        return remainingDays <= 5 ? 'red' : 'black';
    };

    return (
        <Box sx={{
            padding: '20px',

            width: "70vw",
            height: "70vh",
            color: "black"
        }}>
            <Box display="flex" alignItems="center" marginBottom="20px">
            <IconButton
                onClick={handleBack}
                sx={{
                    backgroundColor: '#8dbf8d',  // Slightly muted pastel green
                    color: 'white',  // White text color
                    borderRadius: '50%',  // Make the button circular
                    width: '40px',  // Button width
                    height: '40px',  // Button height
                    outline: "none",
                    transition: 'transform 0.3s ease, background-color 0.3s ease',  // Smooth transition for scaling and background color
                    '&:hover': {
                        transform: 'scale(1.1)',  // Slightly enlarges the button on hover
                        backgroundColor: '#388e3c',  // Darker green for hover effect
                    }
                }}
            >
                <Typography variant="h6" component="span">{'<'}</Typography>
            </IconButton>
                <Typography variant="h4" component="h2" marginLeft="10px">
                    {taskData.taskName}
                </Typography>
            </Box>

            <Box sx={{ backgroundColor: "#fff", borderRadius: "25px", padding: "30px", display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: "100%", marginBottom: '20px', marginLeft: "25px" }}>
                    
                    <Box sx={{ width: "45%", textAlign: "left" }}>
                        <Typography gutterBottom sx={{ fontSize: "18px" }}> {taskData.description || "N/A"}</Typography>

                        <Typography variant="h6" gutterBottom sx={{ marginTop: "30px" }}>
                            <Typography sx={{
                                textDecoration: "underline",
                                fontWeight: "bold",
                                fontSize: "20px"
                            }}>
                                Subtasks:
                            </Typography>
                        </Typography>
                        {taskData.subTasks && taskData.subTasks.length > 0 ? (
                            <ul>
                                {taskData.subTasks.map((subtask, subIndex) => (
                                    <li key={subIndex}>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontSize: "18px",
                                                marginBottom: "10px"
                                            }}
                                        >
                                            {subtask.subTaskName}
                                        </Typography>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <Typography variant="body2">No subtasks available</Typography>
                        )}
                    </Box>

                    <Box sx={{ width: "45%", display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Calendar value={date} tileClassName={tileClassName} onClickDay={() => { }} />
                        <Typography variant="h6" component="p" sx={{ color: renderDeadlineColor() }}>{renderDeadlineText()}</Typography>

                        {/* Legends for Calendar Colors */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-evenly', width: '100%', marginTop: '20px' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box sx={{ width: '20px', height: '20px', backgroundColor: 'rgba(255, 99, 71, 0.5)', marginRight: '5px' }}></Box>
                                <Typography variant="body1">= deadline</Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box sx={{ width: '20px', height: '20px', backgroundColor: 'rgba(144, 238, 144, 0.5)', marginRight: '5px' }}></Box>
                                <Typography variant="body1">= date started</Typography>
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-evenly', width: '100%', marginTop: '20px' }}>

                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box sx={{ width: '20px', height: '20px', backgroundColor: 'rgba(255, 255, 153, 0.5)', marginRight: '5px' }}></Box>
                                <Typography variant="body1">= current date</Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box sx={{ width: '20px', height: '20px', backgroundColor: 'rgba(173, 216, 230, 0.5)', marginRight: '5px' }}></Box>
                                <Typography variant="body1">= date ended</Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>

            <style>
            {`
                .task-started { background-color: rgba(144, 238, 144, 0.5) !important; color: black !important; }
                .task-ended { background-color: rgba(173, 216, 230, 0.5) !important; color: black !important; }
                .deadline { background-color: rgba(255, 99, 71, 0.5) !important; color: black !important; }
                .today { background-color: rgba(255, 255, 153, 0.5) !important; color: gray !important; }

                /* Double border styles for special cases */
                .today-deadline {
                    background-color: rgba(255, 255, 153, 0.5) !important;
                    box-shadow: 0 0 0 2px yellow, 0 0 0 4px rgba(255, 99, 71, 0.5);
                    color: gray !important;
                }
                .today-started {
                    background-color: rgba(255, 255, 153, 0.5) !important;
                    box-shadow: 0 0 0 2px yellow, 0 0 0 4px rgba(144, 238, 144, 0.5);
                    color: gray !important;
                }
                .today-ended {
                    background-color: rgba(255, 255, 153, 0.5) !important;
                    box-shadow: 0 0 0 2px yellow, 0 0 0 4px rgba(173, 216, 230, 0.5);
                    color: gray !important;
                }

                /* Standard calendar styles */
                .react-calendar__month-view__days__day {
                    color: black !important;
                }
                .react-calendar__month-view__days__day--weekend {
                    color: orange !important;
                }
                .react-calendar__navigation button {
                    color: black !important;
                }
            `}
            </style>
        </Box>
    );
};

export default TaskDetail;