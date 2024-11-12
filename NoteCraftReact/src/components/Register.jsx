import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function SignIn() {
    const [personalInfo, setPersonalInfo] = useState({
        name: '',
        email: '',
        username: '',
        password: '',
    });
    const [account, setAcc] = useState({
        id: '',
        username: '',
        password: '',
        email: '',
        name: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPersonalInfo((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Send a POST request to the API
            const response = await axios.post('http://localhost:8081/api/user/insertUserRecord', personalInfo);
            
            // Log the response to check the structure
            console.log('Response data:', response.data);
    
            // Adjust this based on the actual response structure
            const userData = response.data;
    
            // If userId is directly inside response.data:
            const userId = userData.id; // Adjust this as needed
            setAcc(userData); // Set the entire user data to account
            
            console.log('User created with ID:', userId);
    
            // Redirect to the Profile page with account data
            navigate('/login', { state: { account: userData } });
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    return (
        <div style={{
            display: 'flex',
            height: '70vh',
            width: '150vh',
            fontFamily: 'Arial, sans-serif',
            background: '#ffffff',
            border: "1px solid black",
            marginLeft:"85px",
            borderRadius: "20px",
            overflow: "hidden"
        }}>
            {/* Left section for the registration form */}
            <div style={{
                flex: '1',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#ffffff',
                marginRight: '10px',
            }}>
                <h1 style={{
                    color: '#579A59',
                    marginBottom: '20px',
                    fontSize: '24px',
                }}>Register</h1>

                <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={personalInfo.email}
                        onChange={handleChange}
                        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                        required
                        style={{
                            width: '100%',
                            padding: '12px',
                            marginBottom: '15px',
                            borderRadius: '5px',
                            border: '1px solid #ced4da',
                            outline: 'none',
                            fontSize: '16px',
                        }}
                    />
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={personalInfo.name}
                        onChange={handleChange}
                        required
                        style={{
                            width: '100%',
                            padding: '12px',
                            marginBottom: '15px',
                            borderRadius: '5px',
                            border: '1px solid #ced4da',
                            outline: 'none',
                            fontSize: '16px',
                        }}
                    />
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={personalInfo.username}
                        onChange={handleChange}
                        required
                        style={{
                            width: '100%',
                            padding: '12px',
                            marginBottom: '15px',
                            borderRadius: '5px',
                            border: '1px solid #ced4da',
                            outline: 'none',
                            fontSize: '16px',
                        }}
                    />
                    <div style={{ position: "relative", marginBottom: "15px" }}>
                        <span
                            onClick={togglePasswordVisibility}
                            style={{
                                position: "absolute",
                                right: "10px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                cursor: "pointer",
                                fontSize: '20px',
                            }}
                        >
                            {showPassword ? '🙈' : '👁️'}
                        </span>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="Password"
                            value={personalInfo.password}
                            onChange={handleChange}
                            required
                            pattern="^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                            title="Password must be at least 8 characters, include one special character, one uppercase letter, and one number."
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '5px',
                                border: '1px solid #ced4da',
                                outline: 'none',
                                fontSize: '16px',
                            }}
                        />
                    </div>

                    <button type="submit" style={{
                        width: '100%',
                        padding: '12px',
                        background: '#579A59',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        marginLeft:"10px",
                    }}>
                        Sign Up
                    </button>
                </form>
            </div>

            {/* Right section for the image */}
            <div
                className="transition-section-register" // Use right-to-left animation
                style={{
                    height: '100%',
                    width: 'calc(50% - 10px)',
                    background: "#579A59",
                    color: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '20px',
                    borderRadius: "15px",
                    boxSizing: "border-box",
                }}
            >
                <h1 style={{ fontSize: '28px', marginBottom: '10px' }}>
                Stay Organized, Stay Creative: NoteCraft Makes It Easy.
                </h1>
            </div>
        </div>
    );
}
