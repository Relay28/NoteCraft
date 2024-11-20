import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, List, ListItem, ListItemText, Typography } from '@mui/material';

export default function StudyGroupPage() {
    const location = useLocation();
    const personalInfo = location.state?.user || { id: '', username: '' };
    const userId = personalInfo.id;

    const [studyGroups, setStudyGroups] = useState([]);
    const [responseMessage, setResponseMessage] = useState('');

    const apiBaseUrl = 'http://localhost:8081/api/study-groups';
    const navigate = useNavigate();

    const fetchUserGroups = async () => {
        try {
            const response = await axios.get(`${apiBaseUrl}/getStudyGroupByOwner/owner/${userId}`);
            setStudyGroups(response.data);
        } catch (error) {
            console.error('Error fetching study groups:', error);
            setResponseMessage('Error fetching study groups.');
        }
    };

    useEffect(() => {
        fetchUserGroups();
    }, [userId]);

    const handleGroupClick = (groupId) => {
        navigate(`/group-details/${groupId}`);
    };

    return (
        <div style={{ padding: '20px' }}>
            <Typography variant="h4">Study Group Manager</Typography>
            <Typography variant="h6">Your Study Groups</Typography>
            <List>
                {studyGroups.map((group) => (
                    <ListItem button key={group.id} onClick={() => handleGroupClick(group.id)}>
                        <ListItemText
                            primary={group.groupName}
                            secondary={`Description: ${group.groupDescription}`}
                        />
                    </ListItem>
                ))}
            </List>
            {responseMessage && <p>{responseMessage}</p>}
        </div>
    );
}
