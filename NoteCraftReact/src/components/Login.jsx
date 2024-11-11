import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { blue } from '@mui/material/colors';

export default function Login() {
    const [hover, setHover] = useState(false);
    const [personalInfo, setPersonalInfo] = useState({
        username: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    // Toggle password visibility
    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setPersonalInfo((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Login handler
    const handleLogin = async (e) => {
        e.preventDefault();
        console.log("Submitting login with:", personalInfo); // Log data being sent

        try {
            const loginResponse = await axios.post('http://localhost:8081/api/user/login', {
                username: personalInfo.username,
                password: personalInfo.password,
            });

            if (loginResponse.data.token) {
                const token = loginResponse.data.token;
                localStorage.setItem('token', token);

                console.log(`Your token: ${token}`);

                const allUsersResponse = await axios.get('http://localhost:8081/api/user/getAllUsers', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const userData = allUsersResponse.data.find(user => user.username === personalInfo.username);

                if (userData) {
                    localStorage.setItem('userId', userData.id);
                    navigate('/home', { state: { account: userData } });
                } else {
                    alert('User not found after login');
                }
            } else {
                alert('Invalid username or password');
            }
        } catch (error) {
            console.error('Error logging in:', error.response?.data || error.message);
            alert('Login failed');
        }
    };

    // Inline styles for better readability
    const inputStyle = {
        border: "1px solid line",
        width: "100vh",
        height: "2vh",
        borderRadius: "10px",
        padding: "20px",
        marginBottom: "50px",
    };

    const buttonStyle = {
        background: "linear-gradient(135deg, #6e8efb, #a777e3)",
        color: "#fff",
        padding: "10px 20px",
        borderRadius: "5px",
        marginTop: "20px",
    };

    return (
        <div style={{
            display: 'flex',
            height: '70vh',
            width: '150vh',
            fontFamily: 'Arial, sans-serif',
            background: '#ffffff',
            border: "1px solid #579A59",
            borderRadius: "20px",
            overflow: "hidden"
        }}>
            {/* Left section with background color and border radius */}
            <div
    className="transition-section-login" // Use left-to-right animation
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


    
            {/* Right section for the login form */}
            <div style={{
                flex: '1',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#ffffff',
                padding: '40px',
                // Shadow for depth
            }}>
                <h1 style={{
                    color: '#579A59', // Dark green for title
                    marginBottom: '20px',
                    fontSize: '24px',
                }}>Login</h1>
    
                <form onSubmit={handleLogin} style={{ width: '100%', maxWidth: '400px' }}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={personalInfo.username}
                        onChange={handleChange}
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
                    <div style={{ marginBottom: '15px' }}>
                        <h4
                            style={{
                                color: '#579A59',
                                cursor: "pointer",
                                fontSize: '14px',
                                textDecoration: 'underline',
                                marginLeft:"10px"
                            }}
                            onClick={() => navigate('/register')}
                        >
                            No Account Yet? Register here!
                        </h4>
                    </div>
    
                    <button type="submit" style={{
                        width: '100%',
                        padding: '12px',
                        background: '#579A59', // Green button background
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        marginLeft:"10px"
                    }}>
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
    
    
    
    
}
