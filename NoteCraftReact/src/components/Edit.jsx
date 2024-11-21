import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function EditProfile({ personalInfo, onUpdate, onCancel, token }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ ...personalInfo });
    const [error, setError] = useState(null);
    const [profileImage, setProfileImage] = useState(null);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        console.log(file); 
        if (file) {
            setProfileImage(file); // Store the file in state
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        
        const isConfirmed = window.confirm("Are you sure you want to update your profile?");
        if (!isConfirmed) {
            return; 
        }

        
        const updatedFormData = new FormData();

        
        for (const key in formData) {
            updatedFormData.append(key, formData[key]);
        }

        
        if (profileImage) {
            updatedFormData.append('profileImg', profileImage);
        }

        try {
            const response = await axios.put(
                `http://localhost:8081/api/user/putUserDetails?id=${formData.id}`,
                updatedFormData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        
                    }
                }
            );
            console.log('User details updated:', response.data);
            onUpdate(response.data); 
            setError(null); 
            navigate('/myprofile'); 
        } catch (error) {
            console.error('Error updating user details:', error);
            setError('Failed to update user details. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Edit User Details:</h3>
            <div>
                <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    placeholder="Name"
                    required
                />
            </div>
            <div>
                <input 
                    type="text" 
                    name="username" 
                    value={formData.username} 
                    onChange={handleChange} 
                    placeholder="Username"
                    required
                />
            </div>
            <div>
                <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    placeholder="Email"
                    required
                />
            </div>
            <div>
                <input 
                    type="password" 
                    name="password" 
                    value={formData.password} 
                    onChange={handleChange} 
                    placeholder="Password"
                    required
                />
            </div>

            <div>
                <input 
                    type="file" 
                    name="profileImage" 
                    onChange={handleImageChange} 
                    accept="image/*" 
                />
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="submit" style={{ background: "#579A59", color: "#fff", padding: '10px 20px' }}>Save</button>
                <button type="button" onClick={onCancel} style={{ background: "grey", color: "#fff", padding: '10px 20px' }}>Cancel</button>
            </div>
        </form>
    );
}
