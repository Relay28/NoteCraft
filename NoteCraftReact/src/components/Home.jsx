import React, { useState, useEffect, useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
    Box,
    Grid,
    Paper,
    Typography,
    Button,
    List,
    ListItem,
    ListItemText,
    Divider,
    useMediaQuery,
} from '@mui/material';
import {
    AddTask as AddTaskIcon,
    StickyNote2 as NoteIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { PersonalInfoContext } from './PersonalInfoProvider';
import { useTheme } from '@mui/material/styles';

export default function Home() {
    const { personalInfo } = useContext(PersonalInfoContext);
    const u = personalInfo;
    const theme = useTheme();
    const navigate = useNavigate();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const [tasks, setTasks] = useState([]);
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!personalInfo.id) {
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            try {
                const [tasksResponse, notesResponse] = await Promise.all([
                    axios.get('http://localhost:8081/api/todolist/getAllToDoList', {
                        params: { userId: personalInfo.id },
                    }),
                    axios.get('http://localhost:8081/api/note/getNotesByUser', {
                        params: { userId: personalInfo.id },
                    }),
                ]);

                setTasks(Array.isArray(tasksResponse.data) ? tasksResponse.data : []);
                setNotes(Array.isArray(notesResponse.data) ? notesResponse.data : []);
            } catch (error) {
                console.error('Error fetching data:', error);
                setTasks([]);
                setNotes([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [personalInfo.id, navigate]);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                p: { xs: 2, sm: 3 },
                backgroundColor: theme.palette.background.default,
            }}
        >
            <Typography variant="h3" sx={{ mb: 3, fontWeight: 'bold' }}>
                Welcome to Bubble Space
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 4, color: theme.palette.text.secondary }}>
                Your centralized hub for tasks and notes.
            </Typography>

            <Grid container spacing={4} sx={{ width: '100%', maxWidth: '1200px' }}>
                {/* Tasks Section */}
                <Grid item xs={12} md={6}>
                    <Paper
                        sx={{
                            p: 4,
                            backgroundColor: 'blue',
                            color: 'white',
                            borderRadius: '12px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            height: '100%',
                        }}
                        elevation={6}
                    >
                        <Typography variant="h5" sx={{ mb: 2 }}>
                            Your Tasks
                        </Typography>
                        {loading ? (
                            <Typography>Loading tasks...</Typography>
                        ) : tasks.length === 0 ? (
                            <Box textAlign="center">
                                <AddTaskIcon fontSize="large" sx={{ mb: 2 }} />
                                <Typography variant="body1" sx={{ mb: 2 }}>
                                    No tasks available. Start by{' '}
                                    <Button
                                        variant="outlined"
                                        onClick={() => navigate('/todolist', { state: { user: u } })}
                                        sx={{
                                            color: 'white',
                                            borderColor: 'white',
                                            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                                        }}
                                    >
                                        creating one!
                                    </Button>
                                </Typography>
                            </Box>
                        ) : (
                            <List sx={{ flexGrow: 1, overflow: 'auto', maxHeight: isSmallScreen ? '150px' : '200px' }}>
                                {tasks.slice(0, 5).map((task) => (
                                    <React.Fragment key={task.taskID}>
                                        <ListItem>
                                            <ListItemText
                                                primary={task.taskName}
                                                secondary={`Deadline: ${task.deadline}`}
                                                primaryTypographyProps={{ style: { color: 'white' } }}
                                                secondaryTypographyProps={{ style: { color: '#cfd8dc' } }}
                                            />
                                        </ListItem>
                                        <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }} />
                                    </React.Fragment>
                                ))}
                            </List>
                        )}
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ mt: 2 }}
                            onClick={() => navigate('/todolist', { state: { user: u } })}
                        >
                            View All Tasks
                        </Button>
                    </Paper>
                </Grid>

                {/* Notes Section */}
                <Grid item xs={12} md={6}>
                    <Paper
                        sx={{
                            p: 4,
                            backgroundColor: 'green',
                            color: 'white',
                            borderRadius: '12px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            height: '100%',
                        }}
                        elevation={6}
                    >
                        <Typography variant="h5" sx={{ mb: 2 }}>
                            Your Notes
                        </Typography>
                        {loading ? (
                            <Typography>Loading notes...</Typography>
                        ) : notes.length === 0 ? (
                            <Box textAlign="center">
                                <NoteIcon fontSize="large" sx={{ mb: 2 }} />
                                <Typography variant="body1" sx={{ mb: 2 }}>
                                    No notes available. Start by{' '}
                                    <Button
                                        variant="outlined"
                                        onClick={() => navigate('/notes', { state: { user: u } })}
                                        sx={{
                                            color: 'white',
                                            borderColor: 'white',
                                            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                                        }}
                                    >
                                        adding one!
                                    </Button>
                                </Typography>
                            </Box>
                        ) : (
                            <List sx={{ flexGrow: 1, overflow: 'auto', maxHeight: isSmallScreen ? '150px' : '200px' }}>
                                {notes.slice(0, 5).map((note) => (
                                    <React.Fragment key={note.noteID}>
                                        <ListItem>
                                            <ListItemText
                                                primary={note.title}
                                                secondary={note.description}
                                                primaryTypographyProps={{ style: { color: 'white' } }}
                                                secondaryTypographyProps={{ style: { color: '#cfd8dc' }, noWrap: true }}
                                            />
                                        </ListItem>
                                        <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }} />
                                    </React.Fragment>
                                ))}
                            </List>
                        )}
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ mt: 2 }}
                            onClick={() => navigate('/notes', { state: { user: u } })}
                        >
                            View All Notes
                        </Button>
                    </Paper>
                </Grid>
            </Grid>

            <Outlet context={personalInfo} />
        </Box>
    );
}
