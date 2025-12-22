import { useState, useRef, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';

// import User1 from 'assets/images/users/user-round.svg';

// assets
import { IconLogout, IconUser } from '@tabler/icons-react';
import { API_URL, APP_PREFIX_PATH } from 'config/constant';
import axios from 'axios';
import { Button, Modal } from 'react-bootstrap';
import { fetchAdminData } from '../../../../utils/fetchAdminData';
import NotificationSection from '../NotificationSection';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'; // or use IconChevronDown from Tabler

// ==============================|| PROFILE MENU ||============================== //

const ProfileSection = (props) => {
    const theme = useTheme();
    const customization = useSelector((state) => state.customization);
    const navigate = useNavigate();

    // const [imageupdate, setImageUpdate] = useState( || "");
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [open, setOpen] = useState(false);
    const [admin, setAllAdminData] = useState([]);
    const [showlogoutModel, setLogoutModel] = useState(false);

    const anchorRef = useRef(null);
    const handleLogout = async () => {
        setLogoutModel(false);
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('id');
        sessionStorage.removeItem('name');
        sessionStorage.removeItem('email');
        sessionStorage.removeItem('mobile');
        sessionStorage.removeItem('address');
        sessionStorage.removeItem('user_type');
        sessionStorage.removeItem('expirationTime');
        Swal.fire({
            icon: 'success',
            text: 'Log Out Successfully.',
            timer: 1000,
            showConfirmButton: false
        }).then(() => {
            navigate(APP_PREFIX_PATH + '/');
        });
    };

    // console.log('props :', props);

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };
    const handleListItemClick = (event, index, route = '') => {
        setSelectedIndex(index);
        handleClose(event);

        if (route && route !== '') {
            navigate(route);
        }
    };
    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };
    var token = sessionStorage.getItem('token');

    const fetchData = async () => {
        try {
            const adminData = await fetchAdminData(navigate);
            setAllAdminData(adminData);

            // console.log('Admin Data from index:', adminData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData(); // initial fetch

        const handleUpdate = () => {
            fetchData(); // re-fetch on profile update
        };

        window.addEventListener('adminDataUpdated', handleUpdate);

        return () => {
            window.removeEventListener('adminDataUpdated', handleUpdate);
        };
    }, []);

    const prevOpen = useRef(open);

    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);

    return (
        <>
            {/* <NotificationSection /> */}
            <Chip
                sx={{
                    height: '48px',
                    alignItems: 'center',
                    borderRadius: '27px',
                    transition: 'all .2s ease-in-out',
                    borderColor: theme.palette.primary.light,
                    backgroundColor: ' #305CDE',
                    '&[aria-controls="menu-list-grow"], &:hover': {
                        borderColor: '#7c4dff',
                        // background: `#7c4dff`,
                        color: theme.palette.primary.light,
                        '& svg': {
                            stroke: theme.palette.primary.light
                        }
                    },
                    '& .MuiChip-label': {
                        lineHeight: 0
                    }
                }}
                icon={
                    <Avatar
                        src={`${admin?.profileImage}`}
                        sx={{
                            ...theme.typography.mediumAvatar,
                            margin: '8px 0 8px 8px !important',
                            cursor: 'pointer'
                        }}
                        ref={anchorRef}
                        aria-controls={open ? 'menu-list-grow' : undefined}
                        aria-haspopup="true"
                        color="inherit"
                    />
                }
                label={
                    <KeyboardArrowDownIcon
                        style={{
                            transition: 'transform 0.3s',
                            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                            color: 'white'
                        }}
                    />
                }
                variant="outlined"
                ref={anchorRef}
                aria-controls={open ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
                color="primary"
            />
            <Popper
                placement="bottom-end"
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                popperOptions={{
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [0, 14]
                            }
                        }
                    ]
                }}
            >
                {({ TransitionProps }) => (
                    <Transitions in={open} {...TransitionProps}>
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MainCard border={false} elevation={16} content={false} boxShadow={theme.shadows[16]}>
                                    <PerfectScrollbar style={{ height: '100%', maxHeight: 'calc(100vh - 250px)', overflowX: 'hidden' }}>
                                        <Box sx={{ p: 2, pt: 0 }}>
                                            <Divider />
                                            <List
                                                component="nav"
                                                sx={{
                                                    width: '100%',
                                                    maxWidth: 150,
                                                    minWidth: 150,
                                                    backgroundColor: theme.palette.background.paper,
                                                    borderRadius: '10px',

                                                    [theme.breakpoints.down('md')]: {
                                                        minWidth: '100%'
                                                    },
                                                    '& .MuiListItemButton-root': {
                                                        mt: 0.5
                                                    }
                                                }}
                                            >
                                                <ListItemButton
                                                    component={Link}
                                                    // breadcrumbs = {false}
                                                    to={`${APP_PREFIX_PATH}/profile`}
                                                    sx={{ borderRadius: `${customization.borderRadius}px` }}
                                                    selected={selectedIndex === 1}
                                                    onClick={(event) => handleListItemClick(event, 1, '#')}
                                                >
                                                    <ListItemIcon>
                                                        <IconUser stroke={1.5} size="1.3rem" />
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={
                                                            <Grid container spacing={1} justifyContent="space-between">
                                                                <Grid item>
                                                                    <Typography variant="body2">Profile</Typography>
                                                                </Grid>
                                                            </Grid>
                                                        }
                                                    />
                                                </ListItemButton>
                                                {/* <ListItemButton
                                                    component={Link}
                                                    sx={{ borderRadius: `${customization.borderRadius}px` }}
                                                    selected={selectedIndex === 4}
                                                    onClick={() => setLogoutModel(true)}
                                                >

                                                    <ListItemIcon>
                                                        <IconLogout stroke={1.5} size="1.3rem" />
                                                    </ListItemIcon>
                                                    <ListItemText primary={<Typography variant="body2">Logout</Typography>} />
                                                </ListItemButton> */}
                                                <ListItemButton
                                                    sx={{ borderRadius: `${customization.borderRadius}px` }}
                                                    selected={selectedIndex === 4}
                                                    onClick={(event) => {
                                                        event.preventDefault(); // Yeh navigate hone se rokega
                                                        setLogoutModel(true);
                                                        setOpen(false);
                                                    }}
                                                >
                                                    <ListItemIcon>
                                                        <IconLogout stroke={1.5} size="1.3rem" />
                                                    </ListItemIcon>
                                                    <ListItemText primary={<Typography variant="body2">Logout</Typography>} />
                                                </ListItemButton>
                                            </List>
                                        </Box>
                                    </PerfectScrollbar>
                                </MainCard>
                            </ClickAwayListener>
                        </Paper>
                    </Transitions>
                )}
            </Popper>

            <Modal show={showlogoutModel} onHide={() => setLogoutModel(false)} style={{ zIndex: '99999' }}>
                <Modal.Header closeButton>
                    <Modal.Title>Log Out Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to log out?</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" className="btn btn-primary" onClick={handleLogout}>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ProfileSection;
