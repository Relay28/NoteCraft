import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import EditProfile from './Edit';
import profile from '/src/assets/profile.jpg'; // Make sure this is the correct path
import { useContext } from 'react';

export default function Profile({ personalInfo, token }) {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Use the personalInfo passed from the parent, falling back to location state if not passed
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
                {
                    ...updatedInfo,
                    id: userInfo.id,
                },
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
        <div style={{ border:"3px solid #93BA95", width: "150vh", height: "70vh", marginLeft: "28vh", marginTop: "10vh", borderRadius: "10px", padding: "20px", boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)" }}>
            <div style={{ width: "96%", padding: "20px", display: "flex", alignItems: "center", gap: "20px", borderBottom: "3px solid #93BA95", marginBottom: "20px" }}>
                {userInfo.profileImg ? (
                    <img
                        src={`http://localhost:8081/profileImages/${userInfo.profileImg}`}
                        alt="Profile"
                        style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover" }}
                    />
                ) : (
                    <img
                        src={profile} 
                        alt="Default Profile"
                        style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover" }}
                    />
                )}

                <div>
                    <h2 style={{ margin: 0, textAlign: "left" }}>Name</h2>
                    <h3 style={{ marginTop: "4px", fontWeight: "normal" }}>{userInfo.name || 'N/A'}</h3>
                </div>
            </div>

            <div style={{ width: "80vh", padding: "20px", textAlign: "left" }}>
                {isEditing ? (
                    <EditProfile 
                        personalInfo={userInfo} 
                        onUpdate={handleUpdate}
                        onCancel={() => setIsEditing(false)}  
                    />
                ) : (
                    <>
                        <h3 style={{ fontWeight: "bold" }}>Name: <span style={{ fontWeight: "normal" }}>{userInfo.name || 'N/A'}</span></h3>
                        <h3 style={{ fontWeight: "bold" }}>Username: <span style={{ fontWeight: "normal" }}>{userInfo.username || 'N/A'}</span></h3>
                        <h3 style={{ fontWeight: "bold" }}>Email: <span style={{ fontWeight: "normal" }}>{userInfo.email || 'N/A'}</span></h3>
                        <h3 style={{ fontWeight: "bold" }}>
                            Password: <span style={{ fontWeight: "normal" }}>{userInfo.password ? '*'.repeat(userInfo.password.length) : 'N/A'}</span>
                        </h3>

                        <div style={{ display: "flex", marginTop: "15vh", gap: "10px", marginLeft: "120vh" }}>
                            <button 
                                onClick={() => setIsEditing(true)} 
                                style={{ width: "20vh", height: "6vh", background: "#579A59", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
                            >
                                Edit
                            </button>
                            <button 
                                onClick={handleDelete} 
                                style={{ width: "20vh", height: "6vh", background: "#CF514E", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
                            >
                                Delete
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
