/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-key */
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, List, ListItem, ListItemAvatar, ListItemText, Typography, IconButton, Divider } from '@mui/material';
import BeenhereIcon from '@mui/icons-material/Beenhere';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL, APP_PREFIX_PATH} from 'config/constant';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const NotificationList = ({ onClose }) => {
    const theme = useTheme();
    const [notification_arr, setNotification] = useState([]);
    const navigate = useNavigate();
    const token = sessionStorage.getItem('token');

    const fetchNotification = () => {
        axios
            .get(`${API_URL}get_notification`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then((response) => {
                if (response.data.key === 'authenticateFailed') {
                    sessionStorage.clear();
                    navigate(APP_PREFIX_PATH + '/');
                } else if (response.data.success) {
                    setNotification(response.data.contact_arr || []);
                } else {
                    setNotification([]);
                }
            })
            .catch((error) => {
                console.error('Error fetching notification:', error);
            });
    };

    useEffect(() => {
        fetchNotification();
    }, []);

    const handleNotificationDelete = (contact_id) => {
        axios
            .post(`${API_URL}delete_notification`, { contact_id }, { headers: { Authorization: `Bearer ${token}` } })
            .then((response) => {
                if (response.data.success) {
                    Swal.fire({
                        icon: 'success',
                        text: 'Notification marked as read successfully.',
                        timer: 1000,
                        showConfirmButton: false
                    });
                    fetchNotification();
                } else {
                    console.error('Error deleting notification:', response.data.message);
                }
            })
            .catch((error) => {
                console.error('Error deleting notification:', error);
            });
    };

    const handleItemClick = () => {
        if (onClose) onClose();
        navigate(APP_PREFIX_PATH + '/manage-contact');
    };

    return (
        <List
            sx={{
                width: '100%',
                maxWidth: 330,
                py: 0,
                borderRadius: '10px',
                [theme.breakpoints.down('md')]: {
                    maxWidth: 300
                },
                '& .MuiDivider-root': {
                    my: 0
                }
            }}
        >
            {notification_arr.length > 0 ? (
                <>
                    {notification_arr.map((item, index) => (
                        <ListItem
                            key={item.id || index}
                            onClick={handleItemClick}
                            sx={{
                                p: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                borderBottom: '1px solid',
                                borderColor: 'divider',
                                cursor: 'pointer',
                                '&:hover': {
                                    bgcolor: 'primary.light'
                                }
                            }}
                        >
                            <ListItemAvatar sx={{ minWidth: 50, marginLeft: '15px' }}>
                                <Avatar
                                    alt={item.name}
                                    src={item ? `${item.profileImage}` : `${item.profileImage}`}
                                />
                            </ListItemAvatar>

                            <ListItemText
                                primary={
                                    <Typography variant="subtitle2" noWrap sx={{ color: 'black' }}>
                                        {item.name}
                                    </Typography>
                                }
                                secondary={
                                    <>
                                        <Typography variant="body2" color="text.secondary">
                                            {item.message}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {item.date_time}
                                        </Typography>
                                    </>
                                }
                                sx={{ flex: 1, mx: 2 }}
                            />

                            <IconButton
                                edge="end"
                                aria-label="mark as read"
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent dropdown from closing
                                    handleNotificationDelete(item.contact_id);
                                }}
                            >
                                <BeenhereIcon fontSize="small" />
                            </IconButton>
                        </ListItem>
                    ))}
                </>
            ) : (
                <Box sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
                    <Typography variant="body2">No notifications available</Typography>
                </Box>
            )}
            <Divider />
        </List>
    );
};

NotificationList.propTypes = {
    onClose: PropTypes.func
};

export default NotificationList;
