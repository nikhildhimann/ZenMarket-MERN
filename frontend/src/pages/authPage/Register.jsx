import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Box, Button, CircularProgress, TextField, Typography, Snackbar, Alert, Grid, Paper, Link as MuiLink,
    FormControlLabel, Checkbox, InputAdornment, IconButton
} from "@mui/material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useSelector } from "react-redux";

// --- Import Icons ---
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';

const Register = () => {
    const navigate = useNavigate();
    const { token } = useSelector((state) => state.auth);

    useEffect(() => {
        if (token) {
            navigate("/");
        }
    }, [token, navigate]);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", severity: "" });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    const validate = () => {
        const newErrors = {};
        if (!formData.firstName) newErrors.firstName = "First name is required";
        if (!formData.lastName) newErrors.lastName = "Last name is required";
        if (!formData.email) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
        if (!formData.password) newErrors.password = "Password is required";
        else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            setLoading(true);
            try {
                // Note: Your backend expects username & phoneNumber, which are not in this form.
                // You'll need to adjust either this form or your backend schema.
                // For now, we'll send what we have.
                const submissionData = {
                    ...formData,
                    username: formData.email, // Using email as username for now
                    phoneNumber: '+910000000000' // Placeholder phone number
                }
                await axios.post("/api/auth/signup", submissionData);
                setMessage({
                    text: "Registration successful! Redirecting to login...",
                    severity: "success",
                });
                setTimeout(() => navigate("/login"), 2000);
            } catch (err) {
                setMessage({
                    text: err.response?.data?.message || "Registration failed. Please try again.",
                    severity: "error",
                });
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 'calc(100vh - 64px)', // Adjust for navbar height
                bgcolor: 'background.default',
                p: 2,
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 3, md: 5 },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                    maxWidth: 550,
                    borderRadius: 2,
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider'
                }}
            >
                <Box
                    sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                        color: 'primary.contrastText'
                    }}
                >
                    <ShoppingCartCheckoutIcon sx={{ fontSize: 30 }} />
                </Box>
                <Typography component="h1" variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Create your account
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
                    Join thousands of happy customers and start shopping today
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {/* --- Row 1: First Name & Last Name --- */}
                        <Grid item spacing={6} sx={{ mb: 2 }} style={{ display: 'flex' }}>
                            <TextField
                                name="firstName"
                                required
                                fullWidth
                                label="First Name"
                                onChange={handleChange}
                                error={!!errors.firstName}
                                helperText={errors.firstName}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonOutlineIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                name="lastName"
                                required
                                fullWidth
                                label="Last Name"
                                onChange={handleChange}
                                error={!!errors.lastName}
                                helperText={errors.lastName}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonOutlineIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        {/* <Grid item xs={12} sm={6} sx={{ mb: 2 }}>
                            <TextField
                                name="lastName"
                                required
                                fullWidth
                                label="Last Name"
                                onChange={handleChange}
                                error={!!errors.lastName}
                                helperText={errors.lastName}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonOutlineIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid> */}

                        {/* --- Row 2: Email --- */}
                        <Grid item sm={12}>
                            <TextField
                                name="email"
                                required
                                fullWidth
                                label="Email"
                                type="email"
                                onChange={handleChange}
                                error={!!errors.email}
                                helperText={errors.email}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <MailOutlineIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        
                        {/* --- Row 3: Password --- */}
                        <Grid item xs={12}>
                            <TextField
                                name="password"
                                required
                                fullWidth
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                onChange={handleChange}
                                error={!!errors.password}
                                helperText={errors.password || "Password must be at least 6 characters long"}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockOutlinedIcon />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>
                        
                        {/* --- Row 4: Confirm Password --- */}
                         <Grid item xs={12}>
                            <TextField
                                name="confirmPassword"
                                required
                                fullWidth
                                label="Confirm Password"
                                type="password"
                                onChange={handleChange}
                                error={!!errors.confirmPassword}
                                helperText={errors.confirmPassword}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockOutlinedIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                    </Grid>
                    <FormControlLabel
                        control={<Checkbox value="agree" color="primary" />}
                        label={
                             <Typography variant="body2">
                                I agree to the{' '}
                                <MuiLink href="#" variant="body2" sx={{ fontWeight: 600 }}>
                                    Terms of Service
                                </MuiLink>
                                {' and '}
                                <MuiLink href="#" variant="body2" sx={{ fontWeight: 600 }}>
                                    Privacy Policy
                                </MuiLink>
                            </Typography>
                        }
                        sx={{ mt: 2 }}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loading}
                        sx={{ mt: 2, mb: 2, py: 1.5, fontSize: '1rem', fontWeight: 600 }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Create Account"}
                    </Button>
                    
                     <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
                       Already have an account?{' '}
                        <MuiLink component={RouterLink} to="/login" variant="body2" sx={{ fontWeight: 600 }}>
                            Sign in
                        </MuiLink>
                    </Typography>
                </Box>
            </Paper>

            {/* Snackbar for notifications */}
            <Snackbar
                open={!!message.text}
                autoHideDuration={6000}
                onClose={() => setMessage({ text: "", severity: "" })}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={() => setMessage({ text: "", severity: "" })} severity={message.severity} sx={{ width: '100%' }}>
                    {message.text}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Register;

