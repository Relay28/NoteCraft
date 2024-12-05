// npm install react-calendar
// npm install @mui/icons-material
import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from './ThemeProvider';
import Checkbox from '@mui/material/Checkbox';
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
    const { darkMode, toggleTheme, theme } = useTheme(); 

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
            if (date.toDateString() === taskStartedDate.toDateString() && date.toDateString() === taskEndedDate.toDateString()) {
                return 'today-started-ended';
            }
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

    const handleToggleSubtaskCompletion = (subIndex) => {
        // Retrieve the original task from location state
        const originalTask = location.state.task;
    
        // Find the specific subtask ID from the original task's subtasks
        const subtaskToToggle = originalTask.subTasks[subIndex];
        const subTaskId = subtaskToToggle ? subtaskToToggle.subTaskID : null;

        if (!subTaskId) {
            console.error("No subtask ID found");
            return;
        }

        axios
            .put(`http://localhost:8081/api/todolist/toggleSubTaskCompletion/${originalTask.taskID}/${subTaskId}`)
            .then((response) => {
                // Update the state to reflect the new completion status
                setTaskData((prevTaskData) => ({
                    ...prevTaskData,
                    subTasks: prevTaskData.subTasks.map((subtask, index) => 
                        index === subIndex 
                            ? { ...subtask, isSubTaskCompleted: response.data.isSubTaskCompleted }
                            : subtask
                    )
                }));
            })
            .catch((error) => {
                console.error("Error toggling subtask completion:", error.response || error.message);
                alert("Failed to toggle subtask completion. Please try again.");
            });
    };

    const handleCompleteTask = () => {
        // Retrieve the original task from location state
        const originalTask = location.state.task;
    
        // Prepare the data to send to the backend
        const taskEndedDetails = {
            taskEnded: new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toISOString().split('T')[0], // Current date in 'yyyy-mm-dd' format
            isCompleted: true
        };
    
        axios
            .put(`http://localhost:8081/api/todolist/updateTaskEnded?id=${originalTask.taskID}&userId=${user.id}`, taskEndedDetails)
            .then((response) => {
                // Update the local state to reflect the changes
                setTaskData(prevTaskData => ({
                    ...prevTaskData,
                    taskEnded: response.data.taskEnded,
                    isCompleted: response.data.isCompleted
                }));
    
                // Navigate back to the todo list or show a success message
                navigate('/todolist', { state: { user: user } });
            })
            .catch((error) => {
                console.error("Error completing task:", error.response || error.message);
                alert("Failed to complete task. Please try again.");
            });
    };

    return (
        <Box
            sx={{
                padding: '20px',
                overflow: 'auto',
                width: '90%',
                height: '70vh',
                color: 'black',
                '&::-webkit-scrollbar': {
                    display: 'none', // Hides the scrollbar in WebKit browsers (Chrome, Edge, Safari)
                },
                scrollbarWidth: 'none', // Hides the scrollbar in Firefox
            }}
        >
            <Box display="flex" alignItems="center" marginBottom="20px">
            <IconButton
                variant="contained"
                color="success"
                onClick={handleBack}
                sx={{
                    backgroundColor: 'green',  // Slightly muted pastel green
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
                    {taskData.taskEnded && (
                        <Typography 
                            variant="h4" 
                            sx={{  
                                fontWeight: 'bold',
                            }}
                        >
                            {taskData.taskName} (Task Complete)
                        </Typography>
                    )}

                    {!taskData.taskEnded && (
                        <Typography 
                            variant="h4" 
                            sx={{  
                                fontWeight: 'bold',
                            }}
                        >
                            {taskData.taskName}
                        </Typography>
                    )}
                </Typography>
            </Box>

            <Box sx={{ borderRadius: "25px", padding: "30px", display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: "100%", marginBottom: '20px', marginLeft: "25px" }}>
                    
                    <Box sx={{ width: "45%", textAlign: "left" }}>
                        <Typography gutterBottom sx={{ fontSize: "18px", color: darkMode ? '#fff' : '#000' }}>
                            {taskData.description || "N/A"}
                        </Typography>

                        <Typography variant="h6" gutterBottom sx={{ marginTop: "30px" }}>
                            <Typography sx={{
                                textDecoration: "underline",
                                fontWeight: "bold",
                                fontSize: "20px",
                                color: darkMode ? '#fff' : '#000'
                            }}>
                                Subtasks:
                            </Typography>
                        </Typography>
                        {taskData.subTasks && taskData.subTasks.length > 0 ? (
                            <ul>
                                {taskData.subTasks.map((subtask, subIndex) => (
                                    <li key={subIndex} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                        <Checkbox
                                            checked={subtask.isSubTaskCompleted}
                                            onChange={() => handleToggleSubtaskCompletion(subIndex)}
                                            sx={{
                                                padding: '0 9px',
                                                marginRight: '10px',
                                                color: darkMode ? (subtask.isSubTaskCompleted ? 'lightgreen' : '#fff') : (subtask.isSubTaskCompleted ? 'green' : '#000'), // Dynamic color
                                                '&.Mui-checked': {
                                                    color: darkMode ? 'lightgreen' : 'green', // Green for checked, adjusts for dark mode
                                                },
                                            }}
                                        />
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontSize: "18px",
                                                textDecoration: subtask.isSubTaskCompleted ? 'line-through' : 'none',
                                                color: subtask.isSubTaskCompleted
                                                    ? 'gray' // If subtask is completed, color is gray
                                                    : darkMode
                                                    ? '#fff' // If dark mode is active and subtask is not completed, color is white
                                                    : '#000', // Otherwise, color is black
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
                        <Box sx={{ width: "100%", textAlign: "end", marginBottom: "50px", marginRight: "50px" }}>
                            {!taskData.taskEnded && (
                                <button
                                    onClick={handleCompleteTask}
                                    disabled={!taskData.subTasks.every(subtask => subtask.isSubTaskCompleted)}
                                    style={{
                                        padding: "10px 20px",
                                        backgroundColor: taskData.subTasks.every(subtask => subtask.isSubTaskCompleted) ? "green" : "gray",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "5px",
                                        cursor: taskData.subTasks.every(subtask => subtask.isSubTaskCompleted) ? "pointer" : "not-allowed",
                                        fontSize: "16px",
                                    }}
                                >
                                    Complete Task
                                </button>
                            )}
                        </Box>

                        <Calendar
                            value={date}
                            tileClassName={tileClassName}
                            onClickDay={() => {}}
                            className={darkMode ? 'calendar-dark' : 'calendar-light'} // Dynamic class based on mode
                        />

                        <Typography variant="h6" component="p" sx={{ color: darkMode ? '#fff' : '#000', marginTop: "5px" }}>
                            {renderDeadlineText()}
                        </Typography>

                        {/* Legends for Calendar Colors */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-evenly', width: '100%', marginTop: '20px' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box sx={{ width: '20px', height: '20px', backgroundColor: 'rgba(255, 99, 71, 0.5)', marginRight: '5px' }}></Box>
                                <Typography variant="body1" sx={{ color: darkMode ? '#fff' : '#000' }}>= deadline</Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box sx={{ width: '20px', height: '20px', backgroundColor: 'rgba(144, 238, 144, 0.5)', marginRight: '5px' }}></Box>
                                <Typography variant="body1" sx={{ color: darkMode ? '#fff' : '#000' }}>= date started</Typography>
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-evenly', width: '100%', marginTop: '20px' }}>

                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box sx={{ width: '20px', height: '20px', backgroundColor: 'rgba(255, 255, 153, 0.5)', marginRight: '5px' }}></Box>
                                <Typography variant="body1" sx={{ color: darkMode ? '#fff' : '#000' }}>= current date</Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box sx={{ width: '20px', height: '20px', backgroundColor: 'rgba(173, 216, 230, 0.5)', marginRight: '5px' }}></Box>
                                <Typography variant="body1" sx={{ color: darkMode ? '#fff' : '#000' }}>= date ended</Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>

            <style>
                {`
                    /* Light mode styles */
                    .calendar-light {
                        background-color: white;
                        color: black;
                    }

                    .calendar-light .react-calendar__month-view__days__day {
                        background-color: rgba(255, 255, 255, 0.9);
                        color: black !important;
                    }

                    .calendar-light .react-calendar__navigation button {
                        color: black;
                    }

                    /* Dark mode styles */
                    .calendar-dark {
                        background-color: #2b2f3a; /* Match dark mode background */
                        color: white;
                    }

                    .calendar-dark .react-calendar__month-view__days__day {
                        background-color: rgba(43, 47, 58, 0.9); /* Slightly transparent dark color */
                        color: white !important;
                    }

                    .calendar-dark .react-calendar__month-view__days__day--weekend {
                        color: orange !important; /* Orange for weekends */
                    }

                    .calendar-dark .react-calendar__navigation button {
                        color: white;
                    }

                    /* Styles for special tiles */
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
                        box-shadow: 0 0 0 4px rgba(144, 238, 144, 0.5);
                        color: gray !important;
                    }
                    .today-ended {
                        background-color: rgba(255, 255, 153, 0.5) !important;
                        box-shadow: 0 0 0 2px yellow, 0 0 0 4px rgba(173, 216, 230, 0.5);
                        color: gray !important;
                    }
                    .today-started-ended {
                        background-color: rgba(255, 255, 153, 0.5) !important;
                        box-shadow: 0 0 0 4px rgba(144, 238, 144, 0.5),
                                    0 0 0 6px rgba(173, 216, 230, 0.5); /* Extra layer for ended styling */
                        color: gray !important;
                    }
                `}
            </style>
        </Box>
    );
};

export default TaskDetail;