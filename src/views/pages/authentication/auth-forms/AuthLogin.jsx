import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from 'axios';
import AnimateButton from 'ui-component/extended/AnimateButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { API_URL, APP_PREFIX_PATH } from 'config/constant';
import Authentication from 'views/pages/auth/authentication';
import sessionStorage from 'redux-persist/es/storage/session';
import Swal from 'sweetalert2';
const AuthLogin = ({ ...others }) => {
    const theme = useTheme();
    const [checked, setChecked] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <>
            <Authentication />
            <Formik
                initialValues={{
                    email: '',
                    password: '',
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    email: Yup.string()
                        .trim()
                        .email('Please enter a valid email')
                        .matches(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i, {
                            message: 'Please enter a valid email address',
                            excludeEmptyString: true
                        })
                        .max(255)
                        .required('Please enter email'),
                    password: Yup.string().min(6, 'Password must be at least 6 characters').max(15).required('Please enter password')
                })}
                onSubmit={async (values, { setSubmitting, setErrors }) => {
                    try {
                        const trimmedEmail = values.email.trim();
                        const trimmedPassword = values.password.trim();
                        const response = await axios.post(`${API_URL}/admin/login`, {
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: ''
                            },
                            email: trimmedEmail,
                            password: trimmedPassword
                        });

                        if (response.data.success) {
                            // const user = response.data.info[0];
                            sessionStorage.setItem('token', response.data.token);
                            // sessionStorage.setItem('id', user.user_id);
                            // sessionStorage.setItem('user_type', user.user_type);

                            const sessionDuration = 30 * 60 * 1000;
                            const expirationTime = new Date().getTime() + sessionDuration;
                            sessionStorage.setItem('expirationTime', expirationTime);

                            if (checked) {
                                localStorage.setItem('rememberedEmail', trimmedEmail);
                                localStorage.setItem('rememberedPassword', trimmedPassword);
                            } else {
                                localStorage.removeItem('rememberedEmail');
                                localStorage.removeItem('rememberedPassword');
                            }
                            Swal.fire({
                                icon: 'success',
                                text: 'Login Successful!',
                                timer: 1200,
                                showConfirmButton: false
                            }).then(() => {
                                navigate(APP_PREFIX_PATH + '/dashboard');
                            });
                        } else {
                            let errorMsg = 'Email address and password are invalid';
                            if (response.data.key === 'email') {
                                setErrors({ email: 'Email address is not correct', password: '' });
                                errorMsg = 'Email address is not correct';
                            } else if (response.data.key === 'password') {
                                setErrors({ password: 'Password is not correct', email: '' });
                                errorMsg = 'Password is not correct';
                            } else {
                                setErrors({ submit: errorMsg });
                            }
                            Swal.fire({
                                icon: 'error',
                                text: errorMsg,
                                timer: 1500,
                                showConfirmButton: false
                            });
                        }
                    } catch (error) {
                        console.error('Login error:', error);
                        setErrors({ submit: 'Something went wrong. Please try again later.' });
                    }

                    setSubmitting(false);
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit} {...others}>
                        <Grid item sx={{ mb: 3 }} style={{ textAlign: 'center' }}>
                            <h3>Login</h3>
                        </Grid>
                        <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
                            <InputLabel htmlFor="outlined-adornment-email-login">Email Address</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-email-login"
                                type="email"
                                value={values.email}
                                name="email"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                label="Email Address"
                                inputProps={{}}
                                maxLength={30}
                            />
                            {touched.email && errors.email && (
                                <FormHelperText error id="standard-weight-helper-text-email-login">
                                    {errors.email}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <FormControl
                            fullWidth
                            error={Boolean(touched.password && errors.password)}
                            sx={{ ...theme.typography.customInput }}
                        >
                            <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password-login"
                                type={showPassword ? 'text' : 'password'}
                                value={values.password}
                                name="password"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                            size="large"
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                                inputProps={{}}
                            />
                            {touched.password && errors.password && (
                                <FormHelperText error id="standard-weight-helper-text-password-login">
                                    {errors.password}
                                </FormHelperText>
                            )}
                        </FormControl>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={checked}
                                        onChange={(event) => setChecked(event.target.checked)}
                                        name="checked"
                                        color="primary"
                                    />
                                }
                                label="Remember me"
                            />

                            <Link to={`${APP_PREFIX_PATH}/forgotpassword`} style={{ fontWeight: '600', color: '#305CDE' }}>
                                Forgot Password?
                            </Link>
                        </Stack>
                        {errors.submit && (
                            <Box sx={{ mt: 3 }}>
                                <FormHelperText error>{errors.submit}</FormHelperText>
                            </Box>
                        )}

                        <Box sx={{ mt: 2 }}>
                            <AnimateButton>
                                <Button
                                    disableElevation
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                    disabled={isSubmitting}
                                    style={{ color: '#305CDE' }}
                                >
                                    <span style={{ color: '#fff' }}>Log in</span>
                                </Button>
                            </AnimateButton>
                        </Box>
                    </form>
                )}
            </Formik>
        </>
    );
};

export default AuthLogin;
