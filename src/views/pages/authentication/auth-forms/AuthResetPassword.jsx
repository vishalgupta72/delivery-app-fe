import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Button, FormControl, InputAdornment, InputLabel, OutlinedInput, IconButton, Grid } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { API_URL, APP_PREFIX_PATH } from 'config/constant';
import axios from 'axios';
import { Modal } from 'react-bootstrap';

const AuthResetPassword3 = ({ ...others }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { user_id } = useParams();
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const handleSubmit = async (values) => {
        const { newPassword, confirmPassword } = values;
        if (newPassword !== confirmPassword) {
            setError('Password and confirm password do not match');
            return;
        }
        try {
            const response = await axios.post(`${API_URL}admin_forget_new_password`, { newPassword, decodedUserId: user_id });
            if (response.data?.key === 'expire') {
                setError('Your link has expired. Please request a new one!');
                setSuccess('');
            } else {
                setSuccess('Password has been reset successfully!');
                setError('');
                setModalShow(true);
                setTimeout(() => {
                    setModalShow(false);
                    navigate(`${APP_PREFIX_PATH}`);
                }, 2000);
            }
        } catch (error) {
            setError('Error');
            setSuccess('');
        }
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <>
            <Formik
                initialValues={{
                    newPassword: '',
                    confirmPassword: ''
                }}
                validationSchema={Yup.object().shape({
                    newPassword: Yup.string()
                        .min(6, 'Password must be at least 6 characters')
                        .max(15)
                        .required('Please enter new password'),
                    confirmPassword: Yup.string()
                        .min(6, 'Confirm Password must be at least 6 characters')
                        .max(15)
                        .required('Please enter confirm password')
                })}
                onSubmit={handleSubmit}
            >
                {({ values, handleChange, handleSubmit, touched, errors }) => (
                    <form noValidate onSubmit={handleSubmit} {...others}>
                        <Grid item sx={{ mb: 3 }} style={{ textAlign: 'center' }}>
                            <h3>Reset Password</h3>
                        </Grid>

                        <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                            <InputLabel htmlFor="outlined-adornment-password1">Enter New Password</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password1"
                                type={showNewPassword ? 'text' : 'password'}
                                value={values.newPassword}
                                onChange={handleChange('newPassword')}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => setShowNewPassword((prev) => !prev)}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showNewPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="New Password"
                            />
                            {touched.newPassword && errors.newPassword && <p style={{ color: 'red' }}>{errors.newPassword}</p>}
                        </FormControl>

                        <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                            <InputLabel htmlFor="outlined-adornment-password2">Enter Confirm Password</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password2"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={values.confirmPassword}
                                onChange={handleChange('confirmPassword')}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Confirm Password"
                            />
                            {touched.confirmPassword && errors.confirmPassword && <p style={{ color: 'red' }}>{errors.confirmPassword}</p>}
                        </FormControl>

                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        {success && <p style={{ color: 'green' }}>{success}</p>}

                        <Box sx={{ mt: 2 }}>
                            <AnimateButton>
                                <Button
                                    disableElevation
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                    color="secondary"
                                    style={{ color: 'white' }}
                                >
                                    Reset password
                                </Button>
                            </AnimateButton>
                        </Box>
                    </form>
                )}
            </Formik>

            <Modal show={modalShow} onHide={() => setModalShow(false)}>
                <Modal.Header>
                    <Modal.Title>Reset Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>Password has been changed successfully</Modal.Body>
                <Modal.Footer></Modal.Footer>
            </Modal>
        </>
    );
};

export default AuthResetPassword3;
