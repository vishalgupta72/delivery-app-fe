/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './main.css';
import MainCard from 'ui-component/cards/MainCard';
import { Row, Col, Button, Form, InputGroup, Modal, BreadcrumbItem } from 'react-bootstrap';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { API_URL, APP_PREFIX_PATH, IMAGE_PATH } from 'config/constant';
import axios from 'axios';
import menuItem from 'menu-items';
import { Breadcrumb } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { fetchAdminData } from '../../utils/fetchAdminData';

const PasswordField = ({ label, placeholder, value, onChange, error }) => {
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Form.Group className="mb-3" controlId={`form${label.replace(' ', '')}`}>
            <Form.Label>{label}</Form.Label>
            <InputGroup>
                <Form.Control type={showPassword ? 'text' : 'password'} placeholder={placeholder} value={value} onChange={onChange} />
                <InputGroup.Text onClick={toggleShowPassword} style={{ cursor: 'pointer' }}>
                    <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                </InputGroup.Text>
            </InputGroup>
            {/* render error inside same Form.Group to avoid extra spacing */}
            {error && <div className="text-danger mt-1 small">{error}</div>}
        </Form.Group>
    );
};

const Profile = () => {
    const [value, setValue] = useState(0);
    const [admin, setAllAdminData] = useState(null);
    const [enlargedImage, setEnlargedImage] = useState(null);
    const [showImagePopup, setShowImagePopup] = useState(false);
    const [oldpassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confiremPassword, setConfirmPassword] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [modalShow, setModalShow] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalShow1, setmodalShow1] = useState(false);
    const [editName, setAdminEditName] = useState('');
    const [editEmail, setAdminEditEmail] = useState('');
    const [editImage, setEditImage] = useState(null);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const token = sessionStorage.getItem('token');

    // Validation States (for Change Password)
    const [oldPasswordError, setOldPasswordError] = useState('');
    const [newPasswordError, setNewPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    // Validation States (for Edit Profile)
    const [editNameError, setEditNameError] = useState('');
    const [editEmailError, setEditEmailError] = useState('');
    const [editImageError, setEditImageError] = useState('');

    const fetchData = async () => {
        try {
            const adminData = await fetchAdminData(navigate);
            if (adminData) {
                setAllAdminData(adminData);
                // Prefer fullName/profileImage from new API, fall back to legacy fields
                setAdminEditName(adminData.fullName || adminData.username || '');
                setAdminEditEmail(adminData.email || '');
                setEditImage(adminData.profileImage || adminData.image || null);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleImageClick = (imageUrl) => {
        setEnlargedImage(imageUrl);
        setShowImagePopup(true);
    };

    const handleCloseImage = () => {
        setEnlargedImage(null);
        setShowImagePopup(false);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type.startsWith('image/')) {
                setEditImage(file);
                setEditImageError('');
            } else {
                setEditImageError('Please upload valid image format');
                e.target.value = null;
            }
        }
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
        // Reset all errors when switching tabs
        setOldPasswordError('');
        setNewPasswordError('');
        setConfirmPasswordError('');
        setEditNameError('');
        setEditEmailError('');
        setEditImageError('');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let hasError = false;

        // Validate Current Password
        if (!oldpassword.trim()) {
            setOldPasswordError('Please Enter Current Password');
            hasError = true;
        } else {
            setOldPasswordError('');
        }

        // Validate New Password
        if (!newPassword.trim()) {
            setNewPasswordError('Please Enter New Password');
            hasError = true;
        } else if (newPassword.length < 6) {
            setNewPasswordError('Password must be at least 6 characters');
            hasError = true;
        } else {
            setNewPasswordError('');
        }

        // Validate Confirm Password
        if (!confiremPassword.trim()) {
            setConfirmPasswordError('Please Enter Confirm Password');
            hasError = true;
        } else if (confiremPassword.length < 6) {
            setConfirmPasswordError('Password must be at least 6 characters');
            hasError = true;
        } else if (newPassword !== confiremPassword) {
            setConfirmPasswordError('New password and confirm password must match');
            hasError = true;
        } else {
            setConfirmPasswordError('');
        }

        if (hasError) return;

        const data = {
            oldPassword: oldpassword,
            newPassword,
            confirmPassword: confiremPassword
        };

        try {
            const res = await axios.put(`${API_URL}/admin/change-password`, data, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.status === 401) {
                sessionStorage.clear();
                navigate(APP_PREFIX_PATH + '/');
                return;
            }

            if (!res.data?.success) {
                const message = res.data?.message || 'Error updating password';
                // Map common API messages to field errors when possible
                if (message.toLowerCase().includes('old password')) {
                    setOldPasswordError(message);
                } else if (message.toLowerCase().includes('match')) {
                    setConfirmPasswordError(message);
                } else if (message.toLowerCase().includes('length')) {
                    setNewPasswordError(message);
                } else {
                    setError(message);
                }
                setModalTitle('Change Password');
                setModalMessage(message);
                setModalShow(true);
                return;
            }

            // Success
            setModalShow(true);
            setModalMessage('Password updated successfully');
            setModalTitle('Change Password');
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setOldPasswordError('');
            setNewPasswordError('');
            setConfirmPasswordError('');
            setTimeout(() => setModalShow(false), 2000);
        } catch (err) {
            const message = err?.response?.data?.message || 'Error updating password';
            if (err?.response?.status === 401) {
                sessionStorage.clear();
                navigate(APP_PREFIX_PATH + '/');
                return;
            }
            setModalTitle('Change Password');
            setModalMessage(message);
            setModalShow(true);
        }
    };

    const handleAdminData = async (e) => {
        e.preventDefault();

        let hasError = false;
        const emailRegex = /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i;

        // Validate Name
        if (!editName.trim()) {
            setEditNameError('Please Enter Name');
            hasError = true;
        } else {
            setEditNameError('');
        }

        // Validate Email
        if (!editEmail.trim()) {
            setEditEmailError('Please Enter Email');
            hasError = true;
        } else if (!emailRegex.test(editEmail)) {
            setEditEmailError('Invalid Email Format');
            hasError = true;
        } else {
            const emailDomain = editEmail.split('@')[1].toLowerCase();
            if (emailDomain !== 'mailinator.com' && emailDomain !== 'gmail.com') {
                setEditEmailError('Please enter a valid email address');
                hasError = true;
            } else {
                setEditEmailError('');
            }
        }

        // Validate Image
        if (!editImage) {
            setEditImageError('Please Select Image');
            hasError = true;
        } else {
            setEditImageError('');
        }

        if (hasError) return;

        const data = new FormData();
        data.append('name', editName.trim());
        data.append('email', editEmail.trim());
        if (editImage) {
            data.append('image', editImage);
        }

        try {
            const res = await axios.post(`${API_URL}edit_admin_profile`, data, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.key === 'authenticateFailed') {
                sessionStorage.clear();
                navigate(APP_PREFIX_PATH + '/');
            }

            if (res.data.success) {
                setModalTitle('Update');
                setModalMessage('Profile updated successfully');
                setmodalShow1(true);
                window.dispatchEvent(new Event('adminDataUpdated'));
                setTimeout(() => setmodalShow1(false), 2000);
                fetchData();
            }
        } catch (error) {
            setModalMessage('Error updating profile');
            setmodalShow1(true);
        }
    };

    const breadcrumbs = menuItem.items
        .filter((item) => item.title !== 'Profile' && item.breadcrumbs !== false)
        .map((item) => (
            <BreadcrumbItem key={item.id} title={item.title}>
                {item.title}
            </BreadcrumbItem>
        ));

    return (
        <div>
            <Breadcrumb>{breadcrumbs}</Breadcrumb>
            <div>
                <Row>
                    <Col lg={4} className="mb-3">
                        <MainCard style={{ height: '425px' }} className="d-flex justify-content-center align-items-center">
                            <img
                                src={
                                    admin && (admin.profileImage || admin.image)
                                        ? admin.profileImage || (admin.image && `${IMAGE_PATH}${admin.image}`)
                                        : `${IMAGE_PATH}placeholder.png`
                                }
                                alt="Profile"
                                style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover' }}
                                onClick={() =>
                                    handleImageClick(
                                        admin && (admin.profileImage || admin.image)
                                            ? admin.profileImage || (admin.image && `${IMAGE_PATH}${admin.image}`)
                                            : `${IMAGE_PATH}placeholder.png`
                                    )
                                }
                            />
                            <Box className="mt-3">
                                <Typography variant="h4" textAlign={'center'}>
                                    {admin ? admin.fullName || admin.username : ''}
                                </Typography>
                                <Typography variant="body2" className="mt-2">
                                    {admin ? admin.email : ''}
                                </Typography>
                            </Box>
                        </MainCard>
                        {showImagePopup && (
                            <div
                                className="enlarged-image-overlay"
                                onClick={handleCloseImage}
                                onKeyDown={(e) => {
                                    if (e.key === 'Escape') {
                                        handleCloseImage();
                                    }
                                }}
                                role="button"
                                tabIndex={0}
                            >
                                <span
                                    className="close-button"
                                    onClick={handleCloseImage}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleCloseImage();
                                        }
                                    }}
                                    role="button"
                                    tabIndex={0}
                                >
                                    &times;
                                </span>
                                <img
                                    src={enlargedImage}
                                    alt="Enlarged Profile Image"
                                    className="enlarged-image"
                                    style={{ width: '30rem', height: '30rem', objectFit: 'cover' }}
                                />
                            </div>
                        )}
                    </Col>

                    <Col lg={8}>
                        <MainCard>
                            <Tabs value={value} onChange={handleChange}>
                                <Tab label="Profile" />
                                <Tab label="Change Password" />
                            </Tabs>
                            {value === 1 && (
                                <Form onSubmit={handleSubmit} className="m-3">
                                    <PasswordField
                                        label="Current password"
                                        placeholder="Enter Current Password"
                                        value={oldpassword}
                                        onChange={(e) => {
                                            setOldPassword(e.target.value);
                                            setOldPasswordError('');
                                        }}
                                        error={oldPasswordError}
                                    />

                                    <PasswordField
                                        label="New Password"
                                        placeholder="Enter New Password"
                                        value={newPassword}
                                        onChange={(e) => {
                                            setNewPassword(e.target.value);
                                            setNewPasswordError('');
                                        }}
                                        error={newPasswordError}
                                    />

                                    <PasswordField
                                        label="Confirm Password"
                                        placeholder="Confirm New Password"
                                        value={confiremPassword}
                                        onChange={(e) => {
                                            setConfirmPassword(e.target.value);
                                            setConfirmPasswordError('');
                                        }}
                                        error={confirmPasswordError}
                                    />

                                    <div className="d-flex justify-content-end">
                                        <Button type="submit" variant="primary" className="mt-3">
                                            Change Password
                                        </Button>
                                    </div>
                                </Form>
                            )}

                            {value === 0 && (
                                <Form className="m-3">
                                    <Form.Group className="mb-3" controlId="formName">
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={editName}
                                            readOnly
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formEmail">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            value={editEmail}
                                            readOnly
                                        />
                                    </Form.Group>

                                    {admin?.mobile && (
                                        <Form.Group className="mb-3" controlId="formMobile">
                                            <Form.Label>Mobile</Form.Label>
                                            <Form.Control type="text" value={admin.mobile} readOnly />
                                        </Form.Group>
                                    )}

                                    {admin?.gender && (
                                        <Form.Group className="mb-3" controlId="formGender">
                                            <Form.Label>Gender</Form.Label>
                                            <Form.Control type="text" value={admin.gender} readOnly />
                                        </Form.Group>
                                    )}
                                </Form>
                            )}
                        </MainCard>
                    </Col>
                </Row>

                {/* Modal for Password Update */}
                <Modal show={modalShow} onHide={() => setModalShow(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{modalTitle}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{modalMessage}</Modal.Body>
                    <Modal.Footer></Modal.Footer>
                </Modal>

                {/* Modal for Profile Update */}
                <Modal show={modalShow1} onHide={() => setmodalShow1(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{modalTitle}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{modalMessage}</Modal.Body>
                    <Modal.Footer></Modal.Footer>
                </Modal>
            </div>
        </div>
    );
};

export default Profile;