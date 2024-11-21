import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PersonalInfoContext } from './PersonalInfoProvider';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';

export default function Login() {
    const [hover, setHover] = useState(false);
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { setPersonalInfo } = useContext(PersonalInfoContext); // Use setPersonalInfo from context
    const [errorMessage, setErrorMessage] = useState('');
    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const loginResponse = await axios.post('http://localhost:8081/api/user/login', credentials);

            if (loginResponse.data.token) {
                const token = loginResponse.data.token;
                localStorage.setItem('token', token);

                const allUsersResponse = await axios.get('http://localhost:8081/api/user/getAllUsers', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const userData = allUsersResponse.data.find(user => user.username === credentials.username);

                if (userData) {
                    setPersonalInfo(userData); // Set personal info in context
                    localStorage.setItem('userId', userData.id);
                    navigate('/home');
                } else {
                    setErrorMessage('User not found after login');
                }
            } else {
                setErrorMessage('Invalid username or password');
            }
        } catch (error) {
            console.error('Error logging in:', error.response?.data || error.message);
            setErrorMessage('Invalid Credentials');
        }
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
            overflow: "hidden",
            justifyContent: "center",
            alignItems: "center",
            alignContent: "center",
            marginTop:"4.5%",
            marginLeft:"5%"
            
        }} className='login-container'>
            <div
                className="transition-section-login"
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
                    animation: 'slideIn 1s ease-out', // Add animation property here
                }}
                >
                <h1 style={{ fontSize: '28px', marginBottom: '10px' }}>
                    Stay Organized, Stay Creative: NoteCraft Makes It Easy.
                </h1>
                </div>
            <div style={{
                flex: '1',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#ffffff',
                padding: '40px',
            }}>
                <h1 style={{
                    color: '#579A59',
                    marginBottom: '20px',
                    fontSize: '24px',
                }}>Login</h1>
                <form onSubmit={handleLogin} style={{ width: '100%', maxWidth: '400px' }}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={credentials.username}
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
                    <IconButton 
                        onClick={togglePasswordVisibility} 
                        style={{
                            position: 'absolute', 
                            top: '10px', 
                            right: '-13px', 
                            backgroundColor: 'transparent', 
                            padding: '0', 
                            cursor: 'pointer'
                        }}
                    >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="Password"
                            value={credentials.password}
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

                    <div style={{
                        height: '20px', // Fixed height to prevent shifting
                        color: 'red',
                        fontSize: '14px',
                        marginBottom: '10px',
                    }}>
                        {errorMessage}
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
                        background: '#579A59',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        marginLeft: "10px",
                    }}>
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}
