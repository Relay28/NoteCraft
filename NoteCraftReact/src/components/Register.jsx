import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';

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

    const [usernameError, setUsernameError] = useState('');
    const [emailError, setEmailError] = useState('');
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
        setUsernameError('');
        setEmailError('');

        try {
            const usernameResponse = await axios.get('http://localhost:8081/api/user/checkAvailability', {
                params: { username: personalInfo.username },
            });
            const emailResponse = await axios.get('http://localhost:8081/api/user/checkAvailability', {
                params: { email: personalInfo.email },
            });

            if (!usernameResponse.data.available) {
                setUsernameError('Username is taken');
            }
            if (!emailResponse.data.available) {
                setEmailError('Email is taken');
            }

            if (usernameResponse.data.available && emailResponse.data.available) {
                const response = await axios.post('http://localhost:8081/api/user/insertUserRecord', personalInfo);
                navigate('/login', { state: { account: response.data } });
            }
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
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={personalInfo.name}
                        onChange={handleChange}
                        required
                        style={{
                            width: '100%',
                            padding: '12px',
                            marginBottom: '3.5vh',
                            borderRadius: '5px',
                            border: '1px solid #ced4da',
                            outline: 'none',
                            fontSize: '16px',
                        }}
                    />
                    <div style={{ position: 'relative', height: '50px', marginBottom: '30px' }}>
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
                                borderRadius: '5px',
                                border: '1px solid #ced4da',
                                outline: 'none',
                                fontSize: '16px',
                            }}
                        />
                        {emailError && (
                            <div style={{ color: 'red', textAlign: 'left', fontSize:'15px', marginTop: '5px' }}>
                                {emailError}
                            </div>
                        )}
                    </div>
                    
                    <div style={{ position: 'relative', height: '50px', marginBottom: '30px' }}>
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
                                borderRadius: '5px',
                                border: '1px solid #ced4da',
                                outline: 'none',
                                fontSize: '16px',
                            }}
                        />
                        {usernameError && (
                            <div style={{ color: 'red', textAlign: 'left', fontSize:'15px', marginTop: '5px' }}>
                                {usernameError}
                            </div>
                        )}
                    </div>

                    <div style={{ position: 'relative', width: '100%', maxWidth: '400px', marginBottom: '30px' }}>
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
                            width: '106.5%',
                            padding: '12px',
                            borderRadius: '5px',
                            border: '1px solid #ced4da',
                            outline: 'none',
                            fontSize: '16px',
                            boxSizing: 'border-box',
                        }}
                    />
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
                    
                    <div style={{ marginTop: '15px', fontSize: '14px', color: '#579A59' }}>
                        Already have an account?{' '}
                        <span
                            onClick={() => navigate('/login')}
                            style={{ cursor: 'pointer', color: '#007bff', textDecoration: 'underline' }}
                        >
                            Sign in
                        </span>
                    </div>
                </form>
            </div>

            <div
                className="transition-section-register"
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
                    animation: "slideInRight 1s ease-out forwards" 
                }}
            >
                <h1 style={{ fontSize: '28px', marginBottom: '10px' }}>
                    Stay Organized, Stay Creative: NoteCraft Makes It Easy.
                </h1>
            </div>
        </div>
    );
}
