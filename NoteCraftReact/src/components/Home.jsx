import React, { useState, useEffect, useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
    Box,
    Grid,
    Typography,
    Button,
    Paper,
    IconButton,
    Container,
    Stack,
    Fade,
} from '@mui/material';
import {
    AddTask as AddTaskIcon,
    StickyNote2 as NoteIcon,
    Brightness4 as ThemeToggleIcon,
    GroupWork as GroupWorkIcon,
    Dashboard as DashboardIcon,
    Check as CheckIcon,
    NoteAdd as NoteAddIcon,
    GroupAdd as GroupAddIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { PersonalInfoContext } from './PersonalInfoProvider';
import { useTheme } from './ThemeProvider';

// Custom Dashboard Card Component
const DashboardCard = ({ 
    title, 
    items, 
    icon: Icon, 
    onViewAll, 
    onAddNew, 
    emptyMessage,
    loading 
}) => {
    const { theme } = useTheme();

    return (
        <Paper 
            elevation={6}
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                background: theme.palette.mode === 'dark' 
                    ? 'linear-gradient(145deg, #1e1e2f, #1a1a28)' 
                    : 'linear-gradient(145deg, #f0f4f8, #ffffff)',
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: theme.shadows[12]
                }
            }}
        >
            {/* Header with Dynamic Actions */}
            <Box 
                sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    p: 2,
                    borderBottom: `1px solid ${theme.palette.divider}`
                }}
            >
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Icon 
                        sx={{ 
                            color: theme.palette.primary.main, 
                            fontSize: 32 
                        }} 
                    />
                    <Typography variant="h6" fontWeight="bold">
                        {title}
                    </Typography>
                </Stack>
                
                <Stack direction="row" spacing={1}>
                    
                    <Button 
                        onClick={onViewAll} 
                        variant="outlined" 
                        size="small"
                    >
                        View All
                    </Button>
                </Stack>
            </Box>

            {/* Content Area */}
            <Box 
                sx={{ 
                    flexGrow: 1, 
                    p: 2,
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                {loading ? (
                    <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        align="center"
                    >
                        Loading {title.toLowerCase()}...
                    </Typography>
                ) : items.length === 0 ? (
                    <Fade in>
                        <Box 
                            sx={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                flexGrow: 1,
                                textAlign: 'center',
                                opacity: 0.7
                            }}
                        >
                            <Icon 
                                sx={{ 
                                    fontSize: 64, 
                                    color: theme.palette.text.secondary,
                                    mb: 2 
                                }} 
                            />
                            <Typography variant="body1" color="text.secondary">
                                {emptyMessage}
                            </Typography>
                        </Box>
                    </Fade>
                ) : (
                    <Stack spacing={2}>
                        {items.slice(0, 3).map((item) => (
                            <Paper 
                                key={item.taskID || item.noteID || item.groupId}
                                variant="outlined"
                                sx={{
                                    p: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        transform: 'scale(1.02)',
                                        boxShadow: theme.shadows[2]
                                    }
                                }}
                            >
                                <Box>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        {item.taskName || item.title || item.groupName}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {item.deadline || item.description || `${item.users?.length || 0} members`}
                                    </Typography>
                                </Box>
                                <CheckIcon 
                                    color="success" 
                                    sx={{ opacity: 0.6 }} 
                                />
                            </Paper>
                        ))}
                    </Stack>
                )}
            </Box>
        </Paper>
    );
};

// Main Home Component
export default function Home() {
    const { personalInfo } = useContext(PersonalInfoContext);
    const { darkMode, toggleTheme, theme } = useTheme();
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [notes, setNotes] = useState([]);
    const [studyGroups, setStudyGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Redirect to login if no personal info
        if (!personalInfo.id) {
            navigate('/login');
            return;
        }

        // Fetch data for dashboard
        const fetchData = async () => {
            try {
                const [tasksResponse, notesResponse, groupsResponse] = await Promise.all([
                    axios.get('http://localhost:8081/api/todolist/getAllToDoList', {
                        params: { userId: personalInfo.id },
                    }),
                    axios.get('http://localhost:8081/api/note/getNotesByUser', {
                        params: { userId: personalInfo.id },
                    }),
                    axios.get('http://localhost:8081/api/study-groups/getGroupsForUser/' + personalInfo.id)
                ]);

                // Safely set state with fallback to empty arrays
                setTasks(Array.isArray(tasksResponse.data) ? tasksResponse.data : []);
                setNotes(Array.isArray(notesResponse.data) ? notesResponse.data : []);
                setStudyGroups(Array.isArray(groupsResponse.data) ? groupsResponse.data : []);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [personalInfo.id, navigate]);

    return (
        <Box 
            sx={{ 
                minHeight: '100vh', 
                marginLeft:-15,
                mt:5,
                background: theme.palette.mode=="Dark"
              
            }}
        >
            <Container maxWidth="lg">
                {/* Header with Personalized Greeting and Theme Toggle */}
                <Stack 
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between" 
                    alignItems="center" 
                    spacing={2}
                    sx={{ mb: 4 }}
                >
                    <Box>
                        <Typography 
                            variant="h3" 
                            fontWeight="bold"
                            sx={{ 
                                background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}
                        >
                            Hello, {personalInfo.username || 'User'}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                            Your productivity dashboard is ready
                        </Typography>
                    </Box>
                    
                    <Stack direction="row" spacing={2} alignItems="center">
                        <IconButton 
                            onClick={toggleTheme} 
                            color="primary"
                            sx={{ 
                                border: `2px solid ${theme.palette.primary.main}`,
                                p: 1
                            }}
                        >
                            <ThemeToggleIcon />
                        </IconButton>
                        <Button 
                            variant="contained" 
                            startIcon={<DashboardIcon />}
                            sx={{ 
                                borderRadius: 2,
                                textTransform: 'none',
                                boxShadow: theme.shadows[4]
                            }}
                        >
                            Overview
                        </Button>
                    </Stack>
                </Stack>

                {/* Dashboard Grid */}
                <Grid container spacing={4}>
                    {/* Tasks Section */}
                    <Grid item xs={12} md={4}>
                        <DashboardCard
                            title="Tasks"
                            items={tasks}
                            icon={AddTaskIcon}
                            loading={loading}
                            onViewAll={() => navigate('/todolist',{ state: { user: personalInfo } })}
                            emptyMessage="No tasks created yet. Start planning!"
                        />
                    </Grid>
                    
                    {/* Notes Section */}
                    <Grid item xs={12} md={4}>
                        <DashboardCard
                            title="Notes"
                            items={notes}
                            icon={NoteIcon}
                            loading={loading}
                            onViewAll={() => navigate('/notes',{ state: { user: personalInfo } })}
                          
                            emptyMessage="Your notebook is empty. Capture your thoughts!"
                        />
                    </Grid>

                    {/* Study Groups/Notebooks Section */}
                    <Grid item xs={12} md={4}>
                        <DashboardCard
                            title="Notebooks"
                            items={studyGroups}
                            icon={GroupWorkIcon}
                            loading={loading}
                            onViewAll={() => navigate('/group',{ state: { user: personalInfo } })}
                            
                            emptyMessage="No notebooks created. Collaborate and learn!"
                        />
                    </Grid>
                </Grid>

                <Outlet context={personalInfo} />
            </Container>
        </Box>
    );
}