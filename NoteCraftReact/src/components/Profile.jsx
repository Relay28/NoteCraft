import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import EditProfile from './Edit';
import profile from '/src/assets/profile.jpg'; // Ensure the correct path
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    Avatar,
    Stack,
} from '@mui/material';

export default function Profile({ personalInfo, token }) {
    const location = useLocation();
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [userInfo, setUserInfo] = useState(personalInfo || location.state?.account || {});

    useEffect(() => {
        setUserInfo(personalInfo || location.state?.account || {});
    }, [personalInfo, location.state]);

    const handleUpdate = async (updatedInfo) => {
        if (!userInfo.id) {
            alert('Unable to update. User ID is not found.');
            return;
        }

        try {
            const response = await axios.put(
                `http://localhost:8081/api/user/putUserDetails?id=${userInfo.id}`,
                { ...updatedInfo, id: userInfo.id },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setUserInfo(response.data);
            setIsEditing(false);
        } catch (error) {
            alert('Error updating user details: ' + (error.response?.data?.message || 'Unknown error'));
        }
    };

    const handleDelete = async () => {
        if (!userInfo.id) {
            alert('Unable to delete. User ID is not found.');
            return;
        }

        const confirmDelete = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:8081/api/user/deleteUserDetails/${userInfo.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            alert('Account deleted successfully.');
            navigate('/login');
        } catch (error) {
            alert('Error deleting user: ' + (error.response?.data?.message || 'Unknown error'));
        }
    };

    return (
        <Box
            sx={{
                border: '3px solid #93BA95',
                width: '80%',
                height: '90%',
                mx: 'auto',
                mt: 3,
                borderRadius: 2,
                p: 2,
                boxShadow: 3,
                textAlign:"left",
            }}
        >
            <Stack direction="row" spacing={2} alignItems="center" pb={2} borderBottom="3px solid #93BA95">
                <Avatar
                    src={userInfo.profileImg ? `http://localhost:8081/profileImages/${userInfo.profileImg}` : profile}
                    alt="Profile"
                    sx={{ width: 100, height: 100 }}
                />
                <Box>
                    <Typography variant="h5" component="h2">
                        {userInfo.name || 'N/A'}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                        Name
                    </Typography>
                </Box>
            </Stack>

            <Card sx={{ mt: 2, p: 2, maxWidth: '100%' }}>
                <CardContent>
                    {isEditing ? (
                        <EditProfile
                            personalInfo={userInfo}
                            onUpdate={handleUpdate}
                            onCancel={() => setIsEditing(false)}
                        />
                    ) : (
                        <>
                            <Typography variant="h6">
                                Name: <Typography component="span">{userInfo.name || 'N/A'}</Typography>
                            </Typography>
                            <Typography variant="h6">
                                Username: <Typography component="span">{userInfo.username || 'N/A'}</Typography>
                            </Typography>
                            <Typography variant="h6">
                                Email: <Typography component="span">{userInfo.email || 'N/A'}</Typography>
                            </Typography>
                            <Typography variant="h6">
                                Password: <Typography component="span">{userInfo.password ? '*'.repeat(userInfo.password.length) : 'N/A'}</Typography>
                            </Typography>
                        </>
                    )}
                </CardContent>
            </Card>

            {!isEditing && (
    <Stack direction="row" spacing={2} mt={4} justifyContent="flex-end">
        <Button
            variant="contained"
            color="success"
            onClick={() => setIsEditing(true)}
            sx={{ width: '20vh', height: '6vh',top:"70px" }}
        >
            Edit
        </Button>
        <Button
            variant="contained"s
            color="error"
            onClick={handleDelete}
            sx={{ width: '20vh', height: '6vh', top:"70px" }}
        >
            Delete
        </Button>
    </Stack>
)}
        </Box>
    );
}
