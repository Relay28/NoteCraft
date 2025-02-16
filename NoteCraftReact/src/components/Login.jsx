import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PersonalInfoContext } from './PersonalInfoProvider';
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    IconButton,
    InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import logo from '/src/assets/logo.png';

export default function Login() {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const { setPersonalInfo } = useContext(PersonalInfoContext);

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    useEffect(() => {
        document.body.style.margin = "0";
        document.body.style.padding = "0";
        document.body.style.height = "100vh";
        document.body.style.width = "100vw";
        document.body.style.backgroundColor = "#fafafa";
        document.body.style.overflow = "hidden";
    
        return () => {
          // Clean up styles when component unmounts
          document.body.style.margin = "";
          document.body.style.padding = "";
          document.body.style.height = "";
          document.body.style.width = "";
          document.body.style.backgroundColor = "";
          document.body.style.overflow = "";
        };
      }, []);


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
                    setPersonalInfo(userData);
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
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                
            }}
        >
            <Card sx={{ width: 400, boxShadow: "0px 4px 24px rgba(0, 0, 0, 0.1)", borderRadius: 2, padding: '10px' }}>
                <CardContent>
                    {/* Logo Placeholder */}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            mb: 2,
                        }}
                    >
                        <img
                            src={logo}  // Use the imported logo here
                            alt="Application Logo"
                            style={{
                            width: '100px',
                            height: '100px',
                            }}
                        />
                    </Box>

                    {/* Application Name */}
                    <Typography variant="h5" component="h1" sx={{ textAlign: 'center', color: '#579A59', mb: 2 }}>
                        NoteCraft
                    </Typography>

                    <Typography variant="subtitle1" sx={{ textAlign: 'center', color: '#555', mb: 3 }}>
                        Login to your account
                    </Typography>

                    <form onSubmit={handleLogin}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Username"
                            name="username"
                            value={credentials.username}
                            onChange={handleChange}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={credentials.password}
                            onChange={handleChange}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={togglePasswordVisibility} edge="end">
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ mb: 2 }}
                        />
                        {errorMessage && (
                            <Typography
                                variant="body2"
                                color="error"
                                sx={{ mb: 2, textAlign: 'center' }}
                            >
                                {errorMessage}
                            </Typography>
                        )}
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{
                                backgroundColor: "#579A59",
                                color: "#fff",
                                fontWeight: "bold",
                                fontSize: "14px",
                                padding: "10px 0",
                                borderRadius: "8px",
                                "&:hover": { backgroundColor: "#1da23d" },
                              }}
                        >
                            Login
                        </Button>
                    </form>

                    <Typography variant="body2" sx={{ textAlign: 'center', marginTop: 2, color: "#888", fontSize: "12px" }}>
                        Don't have an account?{' '}
                        <Typography
                            component="span"
                            sx={{
                                color: '#579A59',
                                cursor: 'pointer',
                                textDecoration: 'underline',
                                fontSize: "12px"
                            }}
                            onClick={() => navigate('/register')}
                        >
                            Register
                        </Typography>
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
}
